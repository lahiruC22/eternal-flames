"use client";

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import type { ReactNode } from "react";

/**
 * Session Provider Wrapper
 * 
 * This component wraps your app and provides authentication context
 * to all child components. It allows you to use useSession() hook
 * anywhere in your app to check if user is logged in.
 * 
 * Usage in layout.tsx:
 * <SessionProvider>
 *   {children}
 * </SessionProvider>
 */
interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
