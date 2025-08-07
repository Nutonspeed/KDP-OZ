import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Allow the login page to load without checks
  if (url.pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get('sb-access-token')?.value;
  if (!accessToken) {
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.auth.getUser(accessToken);
  const user = data?.user;

  if (error || !user || user.user_metadata?.role !== 'admin') {
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
