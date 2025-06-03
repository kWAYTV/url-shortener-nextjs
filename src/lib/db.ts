import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { env } from '@/env';
import * as schema from '@/schemas/db.schema';

const connectionString = env.DATABASE_URL;

const client = postgres(connectionString, {
  prepare: false
});

export const db = drizzle(client, { schema });

export { and, asc, desc, eq, like, or, sql } from 'drizzle-orm';
