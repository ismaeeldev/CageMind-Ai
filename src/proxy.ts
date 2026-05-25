import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isPremiumRoute = 
      req.nextUrl.pathname.startsWith('/betting') || 
      req.nextUrl.pathname.startsWith('/predictions') || 
      req.nextUrl.pathname.startsWith('/matchup-lab');

    if (isPremiumRoute) {
      if (!req.nextauth.token?.isPremium) {
        return NextResponse.redirect(new URL("/pricing", req.url));
      }
    }
  },
  {
    pages: {
      signIn: "/login",
    },
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/betting/:path*",
    "/predictions/:path*",
    "/matchup-lab/:path*"
  ],
};
