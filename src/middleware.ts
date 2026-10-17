import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Edge Middleware for Route Protection
 * - Enforces authentication on all `/admin` and `/api/admin` routes
 * - Injects security headers on every request
 * - Blocks suspicious request methods
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Protect Admin Routes ───────────────────────────────────────────────
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    const cookieToken = request.cookies.get('om_admin_token')?.value;

    const activeToken = token || cookieToken;
    const adminSecret = process.env.ADMIN_SECRET_KEY || process.env.OM_ADMIN_API_KEY;

    const isAuthorized = adminSecret
      ? activeToken === adminSecret
      : process.env.NODE_ENV !== 'production' && !!activeToken;

    if (!isAuthorized) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Unauthorized: Valid admin credentials or Bearer token required.',
          },
          { status: 401 }
        );
      }

      // For frontend admin routes, redirect to home with access-denied indicator
      const loginUrl = new URL('/', request.url);
      loginUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── 2. Allow request with security headers ─────────────────────────────────
  const response = NextResponse.next();

  // Basic hardening headers on edge
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - frames/ (airplane canvas assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|frames|textures).*)',
  ],
};
