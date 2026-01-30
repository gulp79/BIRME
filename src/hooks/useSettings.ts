import { useState, useEffect, useCallback } from 'react';
import { ProcessingSettings, DEFAULT_SETTINGS } from '@/types/image';

const STORAGE_KEY = 'birme-personal-settings';

export function useSettings() {
  const [settings, setSettings] = useState<ProcessingSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
        } catch {
          return DEFAULT_SETTINGS;
        }
      }
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof ProcessingSettings>(
    key: K,
    value: ProcessingSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { settings, updateSetting, resetSettings, setSettings };
}
