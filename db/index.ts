import { loadEnvConfig } from '@next/env';
import { neon }         from '@neondatabase/serverless';
import { drizzle }      from 'drizzle-orm/neon-http';
import { assets, qrcodes, scanEvents } from './schema';

loadEnvConfig(process.cwd());

if (!process.env.DATABASE_URL) {
  throw new Error('Missing DATABASE_URL');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, {
  schema: { assets, qrcodes, scanEvents },
});
