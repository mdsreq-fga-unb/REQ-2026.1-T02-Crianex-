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

const url = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const key =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_KEY ||
  process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.warn(
    '[supabase] environment variables PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY / SUPABASE_KEY / PUBLIC_SUPABASE_PUBLISHABLE_KEY) are not set.'
  );
}

const createInMemorySupabase = () => {
  const tables = new Map();
  const buckets = new Map();

  const getTable = (tableName) => {
    if (!tables.has(tableName)) {
      tables.set(tableName, []);
    }

    return tables.get(tableName);
  };

  const project = (row, columns = '*') => {
    if (!row) {
      return null;
    }

    if (columns === '*') {
      return { ...row };
    }

    return columns.split(',').reduce((result, column) => {
      const field = column.trim();

      if (field) {
        result[field] = row[field];
      }

      return result;
    }, {});
  };

  const buildQuery = (tableName) => {
    const state = {
      operation: 'select',
      payload: null,
      columns: '*',
      filters: [],
    };

    const api = {
      insert(rows) {
        state.operation = 'insert';
        state.payload = Array.isArray(rows) ? rows : [rows];
        return api;
      },
      update(data) {
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
      eq(field, value) {
        state.filters.push([field, value]);

        if (state.operation === 'delete') {
          const remainingRows = [];

          for (const row of getTable(tableName)) {
            const matches = state.filters.every(
              ([filterField, filterValue]) => row[filterField] === filterValue
            );

            if (!matches) {
              remainingRows.push(row);
            }
          }

          tables.set(tableName, remainingRows);

          return Promise.resolve({ data: null, error: null });
        }

        return api;
      },
      async single() {
        const table = getTable(tableName);

        if (state.operation === 'insert') {
          const row = {
            ...state.payload[0],
            id: state.payload[0].id ?? crypto.randomUUID(),
          };

          table.push(row);

          return { data: project(row, state.columns), error: null };
        }

        if (state.operation === 'update') {
          let updatedRow = null;

          for (const row of table) {
            const matches = state.filters.every(
              ([filterField, filterValue]) => row[filterField] === filterValue
            );

            if (matches) {
              Object.assign(row, state.payload);
              updatedRow = row;
            }
          }

          return { data: project(updatedRow, state.columns), error: null };
        }

        const matchedRow = table.find((row) =>
          state.filters.every(([filterField, filterValue]) => row[filterField] === filterValue)
        );

        return { data: project(matchedRow, state.columns), error: null };
      },
    };

    return api;
  };

  return {
    storage: {
      from(bucketName) {
        if (!buckets.has(bucketName)) {
          buckets.set(bucketName, new Map());
        }

        const bucket = buckets.get(bucketName);

        return {
          async upload(filePath, fileBuffer) {
            bucket.set(filePath, Buffer.from(fileBuffer));
            return { data: { path: filePath }, error: null };
          },
          getPublicUrl(filePath) {
            return {
              data: {
                publicUrl: `https://example.local/storage/v1/object/public/${bucketName}/${filePath}`,
              },
            };
          },
          async remove(fileNames) {
            for (const fileName of fileNames) {
              bucket.delete(fileName);
            }

            return { data: null, error: null };
          },
        };
      },
    },
    from(tableName) {
      return buildQuery(tableName);
    },
    async rpc(name, params) {
      if (name === 'reorder_products' && Array.isArray(params?.p_orders)) {
        const table = getTable('products');

        for (const order of params.p_orders) {
          const row = table.find((item) => item.id === order.id);

          if (row) {
            row.display_order = order.display_order;
          }
        }
      }

      return { data: null, error: null };
    },
  };
};

export const supabase = url && key ? createClient(url, key) : createInMemorySupabase();
