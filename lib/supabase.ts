import { createClient } from '@supabase/supabase-js';

// Client-side Supabase client (for public actions, RLS-enabled)
// Should use NEXT_PUBLIC_SUPABASE_ANON_KEY
export function createSupabaseBrowserClient() {
  return createClient(
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
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Using NEXT_PUBLIC for consistency with browser client
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => cookieStore.set(name, value, options),
        remove: (name: string, options: any) => cookieStore.set(name, '', options),
      },
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
