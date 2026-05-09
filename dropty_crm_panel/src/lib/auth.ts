import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";
import { z } from "zod";
import type { UserRole } from "@/lib/roles";
import { loginAdminWithApi } from "@/lib/api/adminAuth";

const credentialsSchema = z.object({
  login: z.string().min(1),
  password: z.string().min(1),
});

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        login: { label: "Login", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { login, password } = parsed.data;
        try {
          const { user, accessToken, permissions } = await loginAdminWithApi({ login, password });

          return {
            id: user.id,
            name: user.email,
            email: user.email,
            role: user.role,
            accessToken,
            permissions,
          } as any;
        } catch (err) {
          console.error("Credentials login failed:", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = (user as any).accessToken;
        token.permissions = (user as any).permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.role = (token.role as UserRole) ?? "agent";
      }
      // Don't expose upstream API tokens to the browser session object.
      (session as any).permissions = (token as any).permissions;
      return session;
    },
  },
};

export const nextAuthHandler = NextAuth(authOptions);

export async function getServerAuthSession() {
  // return getServerSession(authOptions);
  const session =await getServerSession(authOptions);
  

  return session;
}
