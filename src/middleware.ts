import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

const ADMIN_ROLES = ["SUPER_ADMIN", "REGISTRAR", "ADMISSIONS_OFFICER"];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = Boolean(req.auth?.user);
  const role = req.auth?.user?.role;

  // Admin area
  if (nextUrl.pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (!role || !ADMIN_ROLES.includes(role)) {
      return NextResponse.redirect(new URL("/portal/dashboard", nextUrl));
    }
  }

  // Student portal
  if (nextUrl.pathname.startsWith("/portal")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
  }

  // Already-authenticated users should not see auth pages
  if (nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register")) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/portal/dashboard", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*", "/login", "/register"],
};
