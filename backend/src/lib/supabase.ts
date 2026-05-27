import { createClient } from '@supabase/supabase-js';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const envFilePath = resolve(process.cwd(), '..', '.env');

if (
  (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) &&
  existsSync(envFilePath)
) {
  const envFile = readFileSync(envFilePath, 'utf8');

  for (const line of envFile.split(/\r?\n/)) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const name = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^['"]|['"]$/g, '');

    if (!(name in process.env)) {
      process.env[name] = value;
    }
  }
}

const url = process.env.SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL;
const key =
  process.env.SUPABASE_SECRET_KEY ??
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUPABASE_KEY ??
  process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.warn(
    '[supabase] environment variables PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY / SUPABASE_KEY / PUBLIC_SUPABASE_PUBLISHABLE_KEY) are not set.'
  );
}

type Row = Record<string, unknown>;
type Filter = [string, unknown];

const createInMemorySupabase = () => {
  const tables = new Map<string, Row[]>();
  const buckets = new Map<string, Map<string, Buffer>>();

  const getTable = (tableName: string): Row[] => {
    if (!tables.has(tableName)) tables.set(tableName, []);
    return tables.get(tableName)!;
  };

  const project = (row: Row | null | undefined, columns = '*'): Row | null => {
    if (!row) return null;
    if (columns === '*') return { ...row };
    return columns.split(',').reduce<Row>((acc, col) => {
      const field = col.trim();
      if (field) acc[field] = row[field];
      return acc;
    }, {});
  };

  const buildQuery = (tableName: string) => {
    const state: {
      operation: string;
      payload: Row | Row[] | null;
      columns: string;
      filters: Filter[];
    } = {
      operation: 'select',
      payload: null,
      columns: '*',
      filters: [],
    };

    const api = {
      insert(rows: Row | Row[]) {
        state.operation = 'insert';
        state.payload = Array.isArray(rows) ? rows : [rows];
        return api;
      },
      update(data: Row) {
        state.operation = 'update';
        state.payload = data;
        return api;
      },
      delete() {
        state.operation = 'delete';
        return api;
      },
      select(columns = '*') {
        state.columns = columns;
        return api;
      },
      eq(field: string, value: unknown) {
        state.filters.push([field, value]);

        if (state.operation === 'delete') {
          tables.set(
            tableName,
            getTable(tableName).filter(
              (row) => !state.filters.every(([f, v]) => row[f] === v)
            )
          );
          return Promise.resolve({ data: null, error: null });
        }

        return api;
      },
      async single() {
        const table = getTable(tableName);

        if (state.operation === 'insert') {
          const first: Row = (state.payload as Row[])[0] ?? {};
          const row: Row = { ...first, id: first['id'] ?? crypto.randomUUID() };
          table.push(row);
          return { data: project(row, state.columns), error: null };
        }

        if (state.operation === 'update') {
          let updatedRow: Row | null = null;
          for (const row of table) {
            if (state.filters.every(([f, v]) => row[f] === v)) {
              Object.assign(row, state.payload);
              updatedRow = row;
            }
          }
          return { data: project(updatedRow, state.columns), error: null };
        }

        const found = table.find((row) => state.filters.every(([f, v]) => row[f] === v));
        return { data: project(found, state.columns), error: null };
      },
    };

    return api;
  };

  return {
    storage: {
      from(bucketName: string) {
        if (!buckets.has(bucketName)) buckets.set(bucketName, new Map());
        const bucket = buckets.get(bucketName)!;
        return {
          async upload(filePath: string, fileBuffer: Buffer) {
            bucket.set(filePath, fileBuffer);
            return { data: { path: filePath }, error: null };
          },
          getPublicUrl(filePath: string) {
            return {
              data: {
                publicUrl: `https://example.local/storage/v1/object/public/${bucketName}/${filePath}`,
              },
            };
          },
          async remove(fileNames: string[]) {
            for (const name of fileNames) bucket.delete(name);
            return { data: null, error: null };
          },
        };
      },
    },
    from(tableName: string) {
      return buildQuery(tableName);
    },
    async rpc(name: string, params?: Record<string, unknown>) {
      if (name === 'reorder_products' && params) {
        const orders = params['p_orders'];
        if (Array.isArray(orders)) {
          const table = getTable('products');
          for (const order of orders as Row[]) {
            const row = table.find((item) => item['id'] === order['id']);
            if (row) row['display_order'] = order['display_order'];
          }
        }
      }
      return { data: null, error: null };
    },
  };
};

export const supabase =
  url && key
    ? createClient(url, key)
    : (createInMemorySupabase() as unknown as ReturnType<typeof createClient>);
