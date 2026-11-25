import pg from 'pg'
import 'dotenv/config'

const { Pool } = pg

const connectionString =
  process.env.DATABASE_URL ?? 'postgresql://ekaygabriel@localhost:5432/shopziva'

export const pool = new Pool({ connectionString })

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params?: unknown[],
) {
  return pool.query<T>(text, params)
}
