import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's id. */
      id: string;
      /** The user's subscription plan. */
      plan?: string;
      /** Whether the user is new. */
      new?: boolean;
      // Add any other custom properties you want to include
      // customField?: string;
    } & DefaultSession['user'];
  }

  // Extend the built-in User type
  interface User {
    /** The user's subscription plan. */
    plan?: string;
    /** Whether the user is new. */
    new?: boolean;
    // Add any other custom properties you want to include
    // customField?: string;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** The user's id. */
    id?: string;
    /** The user's subscription plan. */
    plan?: string;
    /** Whether the user is new. */
    new?: boolean;
    // Add any other custom properties you want to include
    // customField?: string;
  }
}
