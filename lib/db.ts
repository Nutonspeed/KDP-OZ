import { neon } from '@neondatabase/serverless';

// Ensure POSTGRES_URL is set in your environment variables
if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set.');
}

// Create a reusable SQL client instance
export const sql = neon(process.env.POSTGRES_URL);
