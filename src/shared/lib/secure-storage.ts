import * as SecureStore from 'expo-secure-store';

/**
 * Thin wrapper around expo-secure-store. On simulators / environments where
 * the secure enclave is unavailable, SecureStore falls back to its own
 * encrypted keychain emulation, so reads/writes still work.
 *
 * Wrapped in try/catch so the app keeps booting in environments where the
 * native module isn't compiled in (e.g. Expo Go) — auth flows will fail at
 * use-time with a sensible error instead of taking down the provider tree
 * during startup.
 */
export const secureStorage = {
  async get(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      console.warn(`[secureStorage] get(${key}) unavailable:`, err);

      return null;
    }
  },

  async set(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.warn(`[secureStorage] set(${key}) unavailable:`, err);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (err) {
      console.warn(`[secureStorage] remove(${key}) unavailable:`, err);
    }
  },
};

export const SECURE_KEYS = {
  authEmail: 'qwuik.auth.email',
  authPassword: 'qwuik.auth.password',
} as const;
