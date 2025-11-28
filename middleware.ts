import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Create a response to mutate
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = await createSupabaseServerClient()

  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession()

  // Protect authenticated routes
  if (pathname.startsWith('/profile') && !session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Redirect authenticated users away from auth pages
  if (pathname.startsWith('/auth') && session) {
    return NextResponse.redirect(new URL('/profile', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
