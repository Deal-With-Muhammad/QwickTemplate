import * as SecureStore from 'expo-secure-store';

/**
 * Thin wrapper around expo-secure-store. On simulators / environments where
 * the secure enclave is unavailable, SecureStore falls back to its own
 * encrypted keychain emulation, so reads/writes still work.
 */
export const secureStorage = {
  async get(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(key);
  },

  async set(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  },

  async remove(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  },
};

export const SECURE_KEYS = {
  authEmail: 'qwuik.auth.email',
  authPassword: 'qwuik.auth.password',
} as const;
