import { neon } from "@neondatabase/serverless";

let client: ReturnType<typeof neon> | undefined;

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");
  client ??= neon(url);
  return client;
}

export const sql = new Proxy({} as ReturnType<typeof neon>, {
  get(_target, property) {
    const fn = getSql() as unknown as Record<PropertyKey, unknown>;
    return fn[property];
  },
});
