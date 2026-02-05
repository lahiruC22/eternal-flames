import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import { verifyUserCredentials } from "@/lib/auth-helpers";

export const authConfig = {
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        passcode: { label: "Passcode", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        const name =
          typeof credentials?.name === "string"
            ? credentials.name.trim()
            : null;
        const passcode =
          typeof credentials?.passcode === "string"
            ? credentials.passcode.trim()
            : null;

        if (!name || !passcode) {
          return null;
        }

        // Verify against database
        const user = await verifyUserCredentials(name, passcode);

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: null,
        } as User;
      },
    }),
  ],
  pages: {
    signIn: "/login", // Custom login page
    error: "/login", // Redirect to login on error
  },
  session: {
    strategy: "jwt", // Use JSON Web Tokens
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }): Promise<JWT> {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      if (session.user) {
        session.user.id = token.sub || "";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
export const { GET, POST } = handlers;
