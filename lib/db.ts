import { neon, Pool, type PoolClient } from "@neondatabase/serverless";

let httpClient: ReturnType<typeof neon> | undefined;
let pool: Pool | undefined;

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");
  httpClient ??= neon(url);
  return httpClient;
}

export const sql = new Proxy({} as ReturnType<typeof neon>, {
  get(_target, property) {
    const fn = getSql() as unknown as Record<PropertyKey, unknown>;
    return fn[property];
  },
});

export type SqlExecutor = (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<Record<string, unknown>[]>;

function getPool() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");
  pool ??= new Pool({ connectionString: url, max: 10 });
  return pool;
}

function createTransactionSql(client: PoolClient): SqlExecutor {
  return async (strings, ...values) => {
    const text = strings.reduce(
      (query, part, index) => query + part + (index < values.length ? `$${index + 1}` : ""),
      "",
    );
    const result = await client.query(text, values);
    return result.rows as Record<string, unknown>[];
  };
}

export async function withTransaction<T>(
  callback: (tx: SqlExecutor) => Promise<T>,
): Promise<T> {
  const client = await getPool().connect();

  try {
    await client.query("BEGIN");
    const tx = createTransactionSql(client);
    const result = await callback(tx);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
