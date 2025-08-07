import { createClient } from '@supabase/supabase-js';

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error('Missing Supabase URL or Anon Key');
  }
  return { url, anonKey };
}

// Client-side Supabase client (for public actions, RLS-enabled)
// Should use NEXT_PUBLIC_SUPABASE_ANON_KEY
export function createSupabaseBrowserClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createClient(url, anonKey);
}

// Exporting the browser client function with the requested name
export const supabaseBrowser = createSupabaseBrowserClient;

// Server-side Supabase client (for Server Components/Actions, RLS-enabled)
// Should use SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY if preferred for consistency)
export function createSupabaseServerClient() {
  const { url, anonKey } = getSupabaseEnv();
  const { cookies } = require('next/headers');
  const cookieStore = cookies();
  return createClient(
    url,
    anonKey, // Using NEXT_PUBLIC for consistency with browser client
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => cookieStore.set(name, value, options),
        remove: (name: string, options: any) => cookieStore.set(name, '', options),
      },
    } as any
  );
}

// Server-side Supabase Admin client (for Server Components/Actions, bypasses RLS)
// Should use SUPABASE_SERVICE_ROLE_KEY
export function createSupabaseAdminClient() {
  const { url } = getSupabaseEnv();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error('Missing Supabase Service Role Key');
  }
  return createClient(
    url,
    serviceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
