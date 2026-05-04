import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';

import { authService } from '../services/auth-service';
import type { LoginCredentials, RetailerUser } from '../types';

/**
 * Auth lifecycle states the app can be in. Each maps to a different routing
 * decision (see `(home)/index.tsx`).
 */
export type AuthStatus =
  | 'loading' // initial check on app start
  | 'signed-out' // no stored credentials → /login
  | 'locked' // has stored credentials but no live session → /unlock
  | 'authenticated'; // session active → /app-ui-{variant}/dashboard

interface AuthContextValue {
  status: AuthStatus;
  user: RetailerUser | null;
  /** Email pre-fill for the unlock screen when biometric is unavailable. */
  storedEmail: string | null;
  signIn: (credentials: LoginCredentials) => Promise<RetailerUser>;
  /** Use stored credentials to re-establish a session. */
  unlock: () => Promise<RetailerUser | null>;
  signOut: () => Promise<void>;
  lock: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<RetailerUser | null>(null);
  const [storedEmail, setStoredEmail] = useState<string | null>(null);

  // Initial bootstrap: figure out what state the app should land in.
  useEffect(() => {
    let active = true;

    (async () => {
      const [session, hasStored, savedEmail] = await Promise.all([
        authService.getCurrentSession(),
        authService.hasStoredCredentials(),
        authService.getStoredEmail(),
      ]);

      if (!active) return;
      setStoredEmail(savedEmail);

      if (session) {
        const profile = await authService.getProfile(session.$id, session.email);

        if (!active) return;
        if (profile) {
          setUser(profile);
          setStatus('authenticated');

          return;
        }
      }

      setStatus(hasStored ? 'locked' : 'signed-out');
    })();

    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async (credentials: LoginCredentials) => {
    const profile = await authService.login(credentials);

    setUser(profile);
    setStoredEmail(credentials.email);
    setStatus('authenticated');

    return profile;
  }, []);

  const unlock = useCallback(async () => {
    const profile = await authService.loginWithStoredCredentials();

    if (profile) {
      setUser(profile);
      setStatus('authenticated');
    }

    return profile;
  }, []);

  const signOut = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setStoredEmail(null);
    setStatus('signed-out');
  }, []);

  const lock = useCallback(async () => {
    await authService.lock();
    setUser(null);
    setStatus('locked');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, storedEmail, signIn, unlock, signOut, lock }),
    [status, user, storedEmail, signIn, unlock, signOut, lock]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return ctx;
}
