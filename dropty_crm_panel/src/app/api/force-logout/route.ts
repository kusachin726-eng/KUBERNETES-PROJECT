import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // const response = NextResponse.redirect(
  //   new URL("/login", req.url)
  // );
  // const response = NextResponse.redirect(
  //   new URL("/login", req.nextUrl.origin)
  // );
 
  // const url = req.nextUrl.clone();
  // url.pathname = "/login";
  // url.search = ""; // optional: remove query params
  const baseUrl =
    process.env.NEXTAUTH_URL ||
    `https://${req.headers.get("host")}`;

  const redirectUrl = new URL("/login", baseUrl);
  const response = NextResponse.redirect(redirectUrl);


  // Delete all possible NextAuth cookies
  response.cookies.delete("next-auth.session-token");
  response.cookies.delete("__Secure-next-auth.session-token");
  response.cookies.delete("__Host-next-auth.session-token");

  return response;
}

