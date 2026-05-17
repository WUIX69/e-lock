import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Public paths
  if (pathname === "/login" || pathname === "/unauthorized") {
    return NextResponse.next()
  }

  // Allow static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next()
  }

  const hasAccessToken = request.cookies.has("elock_access_token")
  const hasRefreshToken = request.cookies.has("elock_refresh_token")

  // Lightweight presence check: no cryptograph verification in proxy
  if (!hasAccessToken && !hasRefreshToken) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
