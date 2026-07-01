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
    '[supabase] environment variables PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY / SUPABASE_KEY / PUBLIC_SUPABASE_PUBLISHABLE_KEY) are not set. Falling back to in-memory implementation.'
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

  const buildQuery = (tableName: string) => {
    const state: {
      operation: string;
      payload: Row | Row[] | null;
      columns: string;
      filters: Filter[];
      orderBy: { field: string; ascending: boolean } | null;
      committed: boolean;
      insertedRows: Row[];
    } = {
      operation: 'select',
      payload: null,
      columns: '*',
      filters: [],
      orderBy: null,
      committed: false,
      insertedRows: [],
    };

    const table = getTable(tableName);

    const matchesFilters = (row: Row): boolean =>
      state.filters.every(([field, value]) => row[field] === value);

    const projectRow = (row: Row | null | undefined): Row | null => {
      if (!row) return null;
      if (state.columns === '*') return { ...row };

      return state.columns.split(',').reduce<Row>((acc, col) => {
        const field = col.trim();
        if (field) acc[field] = row[field];
        return acc;
      }, {});
    };

    const projectRows = (rows: Row[]): Row[] =>
      rows.map((row) => projectRow(row)).filter(Boolean) as Row[];

    const sortRows = (rows: Row[]): Row[] => {
      if (!state.orderBy) return rows;

      const { field, ascending } = state.orderBy;

      return [...rows].sort((left, right) => {
        const leftValue = left[field];
        const rightValue = right[field];

        if (leftValue === rightValue) return 0;
        if (leftValue == null) return ascending ? -1 : 1;
        if (rightValue == null) return ascending ? 1 : -1;

        return (leftValue > rightValue ? 1 : -1) * (ascending ? 1 : -1);
      });
    };

    const finalize = async () => {
      if (state.operation === 'insert') {
        if (!state.committed) {
          const rows = Array.isArray(state.payload) ? state.payload : [];

          for (const rowInput of rows) {
            const row: Row = {
              ...rowInput,
              id: rowInput['id'] ?? crypto.randomUUID(),
            };

            if (tableName === 'leads') {
              if (
                !rowInput['ip_hash'] ||
                !rowInput['name'] ||
                !rowInput['email'] ||
                !rowInput['message']
              ) {
                return { data: null, error: { code: '23502' } };
              }

              const status = rowInput['status'] ?? 'new';
              if (!['new', 'read', 'archived'].includes(String(status))) {
                return { data: null, error: { code: '23514' } };
              }

              row.status = status;
              row.created_at = rowInput['created_at'] ?? new Date().toISOString();
            }

            table.push(row);
            state.insertedRows.push(row);
          }

          state.committed = true;
        }

        return { data: projectRows(state.insertedRows), error: null };
      }

      if (state.operation === 'update') {
        if (!state.committed) {
          const updateData = (state.payload ?? {}) as Row;
          for (const row of table) {
            if (matchesFilters(row)) {
              Object.assign(row, updateData);
            }
          }
          state.committed = true;
        }

        const updatedRows = projectRows(table.filter(matchesFilters));
        return { data: updatedRows, error: null };
      }

      if (state.operation === 'delete') {
        if (!state.committed) {
          const remaining = table.filter((row) => !matchesFilters(row));
          tables.set(tableName, remaining);
          state.committed = true;
        }

        return { data: null, error: null };
      }

      const selectedRows = sortRows(projectRows(table.filter(matchesFilters)));
      return { data: selectedRows, error: null };
    };

    const queryApi: any = {
      then: (onFulfilled: any, onRejected: any) => finalize().then(onFulfilled, onRejected),
      catch: (onRejected: any) => finalize().catch(onRejected),
      select(columns = '*') {
        state.columns = columns;
        return queryApi;
      },
      order(field: string, options?: { ascending?: boolean }) {
        state.orderBy = { field, ascending: options?.ascending ?? true };
        return queryApi;
      },
      eq(field: string, value: unknown) {
        state.filters.push([field, value]);
        return queryApi;
      },
      async single() {
        const result = await finalize();

        if (!result.data) {
          return { data: null, error: result.error };
        }

        if (Array.isArray(result.data)) {
          return { data: result.data[0] ?? null, error: result.error };
        }

        return { data: result.data, error: result.error };
      },
      async maybeSingle() {
        return queryApi.single();
      },
      insert(rows: Row | Row[]) {
        state.operation = 'insert';
        state.payload = Array.isArray(rows) ? rows : [rows];
        return queryApi;
      },
      update(data: Row) {
        state.operation = 'update';
        state.payload = data;
        return queryApi;
      },
      delete() {
        state.operation = 'delete';
        return queryApi;
      },
    };

    return queryApi;
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
        return { data: null, error: null };
      }

      // Espelha a RPC capture_lead (transação ACID de captação de lead). As mesmas
      // CHECK constraints do banco são validadas ANTES de qualquer escrita, de modo
      // que uma falha não deixa linhas parciais — igual ao rollback do PL/pgSQL.
      if (name === 'capture_lead' && params) {
        const nome = params['p_nome'];
        const email = params['p_email'];
        const conteudo = params['p_conteudo'];
        const telefone = (params['p_telefone'] as string | undefined) ?? null;

        if (!nome || !String(nome).trim()) {
          return { data: null, error: { code: '23514', message: 'clients_nome_check' } };
        }
        if (!email) {
          return { data: null, error: { code: '23502', message: 'clients.email NOT NULL' } };
        }
        if (!conteudo || !String(conteudo).trim()) {
          return { data: null, error: { code: '23514', message: 'notifications_conteudo_check' } };
        }

        const clients = getTable('clients');
        const cards = getTable('client_cards');
        const notifications = getTable('notifications');
        const columns = getTable('crm_columns');

        // Client deduplicado por e-mail.
        let client = clients.find((c) => c['email'] === email);
        if (client) {
          client['nome'] = nome;
          if (telefone) client['telefone'] = telefone;
        } else {
          client = {
            id: crypto.randomUUID(),
            nome,
            email,
            telefone,
            status: 'ativo',
            created_at: new Date().toISOString(),
          };
          clients.push(client);
        }

        // Resolve a coluna default do funil (emula o trigger). Em CI o seed já
        // garante uma; no fake puro criamos uma sob demanda.
        let defaultCol = columns.find((c) => c['is_default'] === true);
        if (!defaultCol) {
          defaultCol = {
            id: crypto.randomUUID(),
            title: 'Novo Lead',
            position: 0,
            is_default: true,
          };
          columns.push(defaultCol);
        }

        const card: Row = {
          id: crypto.randomUUID(),
          client_id: client['id'],
          column_id: defaultCol['id'],
          created_at: new Date().toISOString(),
        };
        cards.push(card);

        const notification: Row = {
          id: crypto.randomUUID(),
          tipo: 'novo_lead',
          conteudo,
          status: 'unread',
          created_at: new Date().toISOString(),
        };
        notifications.push(notification);

        return {
          data: [
            { client_id: client['id'], card_id: card['id'], notification_id: notification['id'] },
          ],
          error: null,
        };
      }

      return { data: null, error: null };
    },
  };
};

// In production we ALWAYS talk to the real database. The in-memory fake is a
// test/dev convenience only — silently falling back to it in production would
// serve and persist data to volatile memory with no RLS, causing data loss and
// a security hole. So production fails fast if Supabase is misconfigured, and
// never pings/falls back.
const isProduction = process.env.NODE_ENV === 'production';

let supabaseClient: ReturnType<typeof createClient> | null = null;

if (isProduction) {
  if (!url || !key) {
    throw new Error(
      '[supabase] SUPABASE_URL and a secret/service key are required in production. ' +
        'Refusing to start with the in-memory fallback.'
    );
  }
  supabaseClient = createClient(url, key);
} else if (url && key) {
  // Non-production: detect whether the configured Supabase URL is reachable.
  // If it's not (network error or timeout) we fall back to an in-memory fake so
  // tests stay stable in CI environments where the DB may be unavailable.
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    await fetch(url, { method: 'GET', signal: controller.signal });
    clearTimeout(timeout);

    // Any HTTP response (including 404) means the server is reachable.
    supabaseClient = createClient(url, key);
  } catch {
    console.warn('[supabase] could not reach Supabase at %s, using in-memory fallback', url);
    supabaseClient = createInMemorySupabase() as unknown as ReturnType<typeof createClient>;
  }
} else {
  supabaseClient = createInMemorySupabase() as unknown as ReturnType<typeof createClient>;
}

export const supabase = supabaseClient as ReturnType<typeof createClient>;
