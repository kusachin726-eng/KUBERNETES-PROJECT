import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import type { UserRole } from "@/lib/roles";

function isAllowed(pathname: string, role: UserRole) {
  if (pathname.startsWith("/dashboard/users")) {
    return role === "admin";
  }
  if (pathname.startsWith("/dashboard/customers")) {
    return role === "admin" || role === "manager";
  }
  return true;
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (pathname === "/login") {
    if (token) {
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = `callbackUrl=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  const role = (token.role as UserRole) ?? "agent";
  if (!isAllowed(pathname, role)) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "forbidden=1";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
