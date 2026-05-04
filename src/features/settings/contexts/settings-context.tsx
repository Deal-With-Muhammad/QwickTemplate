import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';

import { storage, STORAGE_KEYS } from '../../../shared/lib/storage';
import { DEFAULT_SETTINGS } from '../types';
import type { AppSettings } from '../types';

interface SettingsContextValue {
  settings: AppSettings;
  isHydrated: boolean;
  update: (patch: Partial<AppSettings>) => Promise<void>;
  reset: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    storage.get<AppSettings>(STORAGE_KEYS.appSettings).then((saved) => {
      if (!active) return;
      if (saved) setSettings({ ...DEFAULT_SETTINGS, ...saved });
      setIsHydrated(true);
    });

    return () => {
      active = false;
    };
  }, []);

  const update = useCallback(
    async (patch: Partial<AppSettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...patch };

        storage.set(STORAGE_KEYS.appSettings, next);

        return next;
      });
    },
    []
  );

  const reset = useCallback(async () => {
    setSettings(DEFAULT_SETTINGS);
    await storage.remove(STORAGE_KEYS.appSettings);
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({ settings, isHydrated, update, reset }),
    [settings, isHydrated, update, reset]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);

  if (!ctx) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }

  return ctx;
}
