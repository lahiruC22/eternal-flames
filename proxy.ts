import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * NextAuth v5 Request Middleware
 *
 * Simple request matcher for NextAuth v5.
 * Session validation happens at the component level via useSession()
 * and SessionProvider. This middleware only ensures proper request routing.
 */
export function proxy(_request: NextRequest) {
  // Middleware processes requests but delegates session validation
  // to component level via useSession() hook
  // No explicit auth checks needed here - component checks will redirect to /login
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - /login (public login page)
     * - /api/auth/* (NextAuth API routes)
     * - /_next/* (Next.js internals)
     * - /favicon.ico, /robots.txt (static files)
     */
    "/((?!login|api/auth|_next|favicon.ico|robots.txt).*)",
  ],
};
