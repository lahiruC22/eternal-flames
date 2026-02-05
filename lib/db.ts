import { neon } from "@neondatabase/serverless";

let sql: ReturnType<typeof neon> | null = null;

function getConnection() {
  if (sql) {
    return sql;
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not defined. Make sure it's in your .env.local file."
    );
  }

  sql = neon(databaseUrl);
  return sql;
}

export function getSql() {
  return getConnection();
}
