import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next({ request: { headers: req.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        getAll() {
          return req.cookies.getAll().map((c) => ({ name: c.name, value: c.value }))
        },
        setAll(cookies) {
          cookies.forEach((c) => res.cookies.set(c.name, c.value, c.options))
        },
      },
    }
  )

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
