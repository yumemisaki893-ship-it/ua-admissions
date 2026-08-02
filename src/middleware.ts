import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";
import { ADMIN_ROLES as ADMIN_ROLE_SET, ICTU_ROLES as ICTU_ROLE_SET } from "@/lib/roles";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = Boolean(req.auth?.user);
  const role = req.auth?.user?.role;

  // Admin area
  if (nextUrl.pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (!role || !ADMIN_ROLE_SET.includes(role as typeof ADMIN_ROLE_SET[number])) {
      return NextResponse.redirect(new URL("/portal/dashboard", nextUrl));
    }
  }

  // ICTU oversight area
  if (nextUrl.pathname.startsWith("/admin/ictu")) {
    if (!role || !ICTU_ROLE_SET.includes(role as typeof ICTU_ROLE_SET[number])) {
      return NextResponse.redirect(new URL("/admin", nextUrl));
    }
  }

  // Teacher area
  if (nextUrl.pathname.startsWith("/teacher")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (role !== "TEACHER") {
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
      const dest = role === "STUDENT" ? "/portal/dashboard" : role === "TEACHER" ? "/teacher/dashboard" : role && ADMIN_ROLE_SET.includes(role as typeof ADMIN_ROLE_SET[number]) ? "/admin" : "/portal/dashboard";
      return NextResponse.redirect(new URL(dest, nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/teacher/:path*", "/portal/:path*", "/login", "/register"],
};
