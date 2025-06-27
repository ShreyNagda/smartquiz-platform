// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET, // or NEXTAUTH_SECRET if using that
    cookieName:
      process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
  });

  if (!token?.id) {
    // Not authenticated, redirect to sign-in or error page
    return NextResponse.redirect(new URL("/error/not-signed-in", request.url));
  }

  // Authenticated, allow access
  return NextResponse.next();
}

// Protect all dashboard routes
export const config = {
  matcher: ["/dashboard/:path*"],
};
