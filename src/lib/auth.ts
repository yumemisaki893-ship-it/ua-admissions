import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

/**
 * Note: Auth.js requires at least one provider. Google OAuth is always
 * registered; when GOOGLE_CLIENT_ID is empty, it is effectively disabled
 * (users may still sign in with email/password credentials).
 */
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
