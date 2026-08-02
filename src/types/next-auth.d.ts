import type { DefaultSession } from "next-auth";

// Auth.js v5 (beta) re-exports its types from @auth/core, so the module
// augmentations below target @auth/core to extend User/Session/JWT.

declare module "@auth/core/types" {
  interface User {
    role?: string;
    isVerified?: boolean;
  }
  interface Session {
    user: {
      id: string;
      role?: string;
      isVerified?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: string;
    isVerified?: boolean;
    provider?: string;
  }
}

export {};
