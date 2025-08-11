import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create pool with error handling and connection validation
const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({ 
  connectionString,
  // Connection pool settings for production
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // close idle clients after 30 seconds
  connectionTimeoutMillis: 5000, // return an error after 5 seconds if connection could not be established
});

export const db = drizzle({ client: pool, schema });

// Database connection health check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Initialize database connection with retry logic
export async function initializeDatabase(): Promise<void> {
  const maxRetries = 5;
  const retryDelay = 2000; // 2 seconds

  // Validate DATABASE_URL format before attempting connection
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  // Basic validation of DATABASE_URL format
  try {
    new URL(dbUrl);
  } catch (urlError) {
    throw new Error('DATABASE_URL environment variable has invalid format');
  }

  console.log('🔄 Attempting database connection...');

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📡 Connection attempt ${attempt}/${maxRetries}`);
      const isConnected = await checkDatabaseConnection();
      if (isConnected) {
        console.log('✅ Database connection established successfully');
        
        // Run a basic schema validation in production
        if (process.env.NODE_ENV === 'production') {
          await validateDatabaseSchema();
        }
        
        return;
      }
      throw new Error('Database connection health check failed');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`❌ Database connection attempt ${attempt}/${maxRetries} failed: ${errorMessage}`);
      
      if (attempt === maxRetries) {
        console.error('💥 All database connection attempts failed');
        throw new Error(`Failed to connect to database after ${maxRetries} attempts: ${errorMessage}`);
      }
      
      // Exponential backoff with jitter
      const backoffDelay = (retryDelay * Math.pow(2, attempt - 1)) + Math.random() * 1000;
      console.log(`⏳ Waiting ${Math.round(backoffDelay)}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
}

// Validate critical database schema exists
async function validateDatabaseSchema(): Promise<void> {
  try {
    console.log('🔍 Validating database schema...');
    const client = await pool.connect();
    
    // Check if critical tables exist
    const tableCheckQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('events', 'users', 'sessions')
    `;
    
    const result = await client.query(tableCheckQuery);
    const existingTables = result.rows.map(row => row.table_name);
    
    const requiredTables = ['events', 'users', 'sessions'];
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));
    
    client.release();
    
    if (missingTables.length > 0) {
      console.warn(`⚠️  Missing database tables: ${missingTables.join(', ')}`);
      console.log('ℹ️  Tables will be created automatically on first use');
    } else {
      console.log('✅ Database schema validation passed');
    }
  } catch (error) {
    console.warn('⚠️  Schema validation failed (non-critical):', error);
    // Don't throw here - schema issues shouldn't prevent startup
  }
}
