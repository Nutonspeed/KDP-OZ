import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

// Client-side Supabase client (for public actions, RLS-enabled)
// Should use NEXT_PUBLIC_SUPABASE_ANON_KEY
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Exporting the browser client function with the requested name
export const supabaseBrowser = createSupabaseBrowserClient;

// Server-side Supabase client (for Server Components/Actions, RLS-enabled)
// Should use SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY if preferred for consistency)
export function createSupabaseServerClient() {
  const { cookies } = require('next/headers');
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: () => cookieStore,
    }
  );
}

// Server-side Supabase Admin client (for Server Components/Actions, bypasses RLS)
// Should use SUPABASE_SERVICE_ROLE_KEY
export function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
