import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure postgres client for Railway with proper SSL and auth settings
const client = postgres(process.env.DATABASE_URL, { 
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

export const db = drizzle(client, { schema });

// Test connection and log status
export async function testConnection() {
  try {
    await client`SELECT 1`;
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}