import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";
import { logger } from "@shared/logger";

let db: ReturnType<typeof drizzle> | null = null;
let client: postgres.Sql | null = null;

if (process.env.DATABASE_URL) {
  // Configure postgres client for Railway with proper SSL and auth settings
  client = postgres(process.env.DATABASE_URL, {
    prepare: false,
    ssl: 'prefer',
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    // Configurações específicas para pooling do Railway
    connection: {
      application_name: 'brick_call_sheet_app'
    }
  });

  db = drizzle(client, { schema });
} else {
    logger.warn('DATABASE_URL not set – falling back to in-memory storage');
}

export { db };

// Test connection and log status
export async function testConnection() {
  if (!client) return false;
  try {
    await client`SELECT 1`;
      logger.log('✅ Database connection successful');
    return true;
  } catch (error: any) {
      logger.error('❌ Database connection failed:', error.message);
    return false;
  }
}
