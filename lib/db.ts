import { neon, NeonQueryFunction } from '@neondatabase/serverless'

// Create a reusable SQL client instance when a connection string is provided.
// If no database is configured, `sql` will be `null` allowing callers to
// implement graceful fallbacks (e.g. in-memory mocks).
export const sql: NeonQueryFunction<false, false> | null =
  process.env.POSTGRES_URL ? neon(process.env.POSTGRES_URL) : null
