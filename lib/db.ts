import { Pool } from "pg";

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  database: process.env.PG_DATABASE,
});

export const query = async (text: string, params?: any[]) => {
  const result = await pool.query(text, params);
  return result.rows;
};

export const getClient = async () => {
  const client = await pool.connect();
  return client;
};
