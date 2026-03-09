import { Pool } from "pg";

declare global {
  var pgPool: Pool | undefined;
}

const pool =
  global.pgPool ??
  new Pool({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    database: process.env.PG_DATABASE,
    ssl: {
      rejectUnauthorized: false,
    },
  });

if (process.env.NODE_ENV !== "production") {
  global.pgPool = pool;
}

export const query = async (text: string, params?: unknown[]) => {
  const result = await pool.query(text, params);
  return result.rows;
};

export const getClient = async () => {
  return pool.connect();
};

