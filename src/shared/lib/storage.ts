import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * AsyncStorage wrapper for non-sensitive JSON prefs. Use `secureStorage` from
 * `./secure-storage` for credentials and tokens.
 *
 * Every call is wrapped in a try/catch so that the app boots even when the
 * native module isn't available (e.g. running inside Expo Go, which doesn't
 * ship AsyncStorage). In that case reads return null and writes are no-ops —
 * so settings fall back to defaults instead of unmounting the tree.
 */
export const storage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);

      if (raw == null) return null;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return null;
      }
    } catch (err) {
      console.warn(`[storage] get(${key}) unavailable:`, err);

      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`[storage] set(${key}) unavailable:`, err);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (err) {
      console.warn(`[storage] remove(${key}) unavailable:`, err);
    }
  },
};

export const STORAGE_KEYS = {
  appSettings: 'qwuik.settings.v1',
} as const;
