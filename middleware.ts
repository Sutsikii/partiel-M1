import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl

  const protectedRoutes = [
    '/admin',
    '/admin/conferences',
    '/admin/sponsors',
    '/programme',
    '/sponsor'
  ]

  const adminRoutes = [
    '/admin',
    '/admin/conferences',
    '/admin/sponsors'
  ]

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))

  if (!session?.user && isProtectedRoute) {
    const loginUrl = new URL('/auth/signin', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (session?.user && isAdminRoute && (session.user as any).role !== 'ADMIN') {
    const loginUrl = new URL('/auth/signin', request.url)
    loginUrl.searchParams.set('error', 'insufficient_permissions')
    loginUrl.searchParams.set('message', 'Vous devez avoir les permissions administrateur pour accéder à cette page')
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/programme/:path*',
    '/sponsor/:path*'
  ]
} 