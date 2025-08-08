import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const session = req.cookies.get('session')?.value === 'authenticated'
  const isLoginPage = req.nextUrl.pathname === '/admin/login'

  if (!session && !isLoginPage) {
    const loginUrl = new URL('/admin/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  if (session && isLoginPage) {
    const adminUrl = new URL('/admin', req.url)
    return NextResponse.redirect(adminUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
