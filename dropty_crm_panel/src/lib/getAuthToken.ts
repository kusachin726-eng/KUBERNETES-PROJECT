// lib/getAuthToken.ts
import "server-only";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";

export async function getAccessToken() {
  const cookieStore = await cookies(); // ✅ await

  // console.log("🍪 cookies visible here:", cookieStore.getAll());

  const token = await getToken({
    req: {
      cookies: cookieStore,
    } as any,
    secret: process.env.NEXTAUTH_SECRET,
  });


  // console.log("🔐 token in getAccessToken:", token?.accessToken);
  return token?.accessToken as string | undefined;
}
