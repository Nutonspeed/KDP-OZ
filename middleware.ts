import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next({ request: { headers: req.headers } })

  const hasSupabaseCreds =
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!hasSupabaseCreds) {
    return res
  }

  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const pathname = req.nextUrl.pathname
  const isLoginPage = pathname === '/admin/login'
  const isLogoutPage = pathname === '/admin/logout'

  if (!session && !isLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  if (session && session.user.user_metadata?.role !== 'admin' && !isLoginPage && !isLogoutPage) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  if (session && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*'],
}
