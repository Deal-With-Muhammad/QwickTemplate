import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';

import { useSettings } from '../../settings/contexts/settings-context';
import { authService } from '../services/auth-service';
import type { LoginCredentials, RetailerUser } from '../types';

/**
 * Auth lifecycle states the app can be in. Each maps to a different routing
 * decision (see `(home)/index.tsx`).
 */
export type AuthStatus =
  | 'loading' // initial check on app start
  | 'signed-out' // no stored credentials → /login
  | 'locked' // has stored credentials, awaiting biometric/password → /unlock
  | 'authenticated'; // unlocked → /dashboard

interface AuthContextValue {
  status: AuthStatus;
  user: RetailerUser | null;
  /** Email pre-fill for the unlock screen when biometric is unavailable. */
  storedEmail: string | null;
  signIn: (credentials: LoginCredentials) => Promise<RetailerUser>;
  /** Use stored credentials (or live session) to unlock the app. */
  unlock: () => Promise<RetailerUser | null>;
  signOut: () => Promise<void>;
  lock: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { settings, isHydrated: settingsHydrated } = useSettings();
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<RetailerUser | null>(null);
  const [storedEmail, setStoredEmail] = useState<string | null>(null);

  // Initial bootstrap. We hold off until settings hydrate so we can read
  // `biometricEnabled` and apply the right policy on the very first paint.
  useEffect(() => {
    if (!settingsHydrated) return;

    let active = true;

    (async () => {
      const [hasStored, savedEmail] = await Promise.all([
        authService.hasStoredCredentials(),
        authService.getStoredEmail(),
      ]);

      if (!active) return;
      setStoredEmail(savedEmail);

      if (!hasStored) {
        setStatus('signed-out');

        return;
      }

      // Policy: if biometric unlock is enabled, the app ALWAYS lands on the
      // unlock screen on a fresh launch — even if the Appwrite session is
      // still valid. The unlock flow will reuse the live session after the
      // biometric prompt (no extra network round-trip needed).
      if (settings.biometricEnabled) {
        setStatus('locked');

        return;
      }

      // Biometric off → fast path: try to reuse a live session.
      const session = await authService.getCurrentSession();

      if (!active) return;

      if (session) {
        const profile = await authService.getProfile(
          session.$id,
          session.email
        );

        if (!active) return;
        if (profile) {
          setUser(profile);
          setStatus('authenticated');

          return;
        }
      }

      // No live session — user must re-enter their password.
      setStatus('locked');
    })();

    return () => {
      active = false;
    };
    // We deliberately depend only on settingsHydrated; the policy is sampled
    // once at boot. Toggling biometric afterwards takes effect on the *next*
    // app launch (which matches user expectation for that kind of setting).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsHydrated]);

  const signIn = useCallback(async (credentials: LoginCredentials) => {
    const profile = await authService.login(credentials);

    setUser(profile);
    setStoredEmail(credentials.email);
    setStatus('authenticated');

    return profile;
  }, []);

  const unlock = useCallback(async () => {
    // Fast path: if the Appwrite session is still alive we don't need to
    // re-authenticate at all — just load the profile.
    const session = await authService.getCurrentSession();

    if (session) {
      const profile = await authService.getProfile(session.$id, session.email);

      if (profile) {
        setUser(profile);
        setStatus('authenticated');

        return profile;
      }
    }

    // Session expired or missing → re-auth with stored credentials.
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
