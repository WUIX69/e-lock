import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-development"
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET)

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("elock_session")?.value
  const pathname = request.nextUrl.pathname

  // Public paths
  if (pathname === "/login" || pathname === "/unauthorized") {
    return NextResponse.next()
  }

  // Allow static files and API routes (or adapt if you need to protect APIs)
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico") || pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    const role = payload.role as string

    // Role-based restrictions
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }

    // Protect user-specific routes, though admins might be allowed (adjust if strict user-only is required)
    if (pathname.startsWith("/user") && role !== "user") {
      // If admins shouldn't access employee dashboard:
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error("JWT Verification failed:", error)
    // Invalid token
    return NextResponse.redirect(new URL("/login", request.url))
  }
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
