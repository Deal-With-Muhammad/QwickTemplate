import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * AsyncStorage wrapper for non-sensitive JSON prefs. Use `secureStorage` from
 * `./secure-storage` for credentials and tokens.
 */
export const storage = {
  async get<T>(key: string): Promise<T | null> {
    const raw = await AsyncStorage.getItem(key);

    if (raw == null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },
};

export const STORAGE_KEYS = {
  appSettings: 'qwuik.settings.v1',
} as const;
