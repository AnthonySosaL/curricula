import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type AppLanguage = 'es' | 'en';
export type AppTheme = 'light' | 'dark';

interface UiPreferencesContextValue {
  language: AppLanguage;
  theme: AppTheme;
  setLanguage: (language: AppLanguage) => void;
  toggleLanguage: () => void;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
}

const UiPreferencesContext = createContext<UiPreferencesContextValue | null>(null);

const STORAGE_KEY = 'curricula-ui-preferences-v1';

function readInitialPreferences(): { language: AppLanguage; theme: AppTheme } {
  if (typeof window === 'undefined') return { language: 'es', theme: 'light' };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { language: 'es', theme: 'light' };

    const parsed = JSON.parse(raw) as Partial<{ language: AppLanguage; theme: AppTheme }>;
    return {
      language: parsed.language === 'en' ? 'en' : 'es',
      theme: parsed.theme === 'dark' ? 'dark' : 'light',
    };
  } catch {
    return { language: 'es', theme: 'light' };
  }
}

export function UiPreferencesProvider({ children }: { children: ReactNode }) {
  const initial = readInitialPreferences();
  const [language, setLanguage] = useState<AppLanguage>(initial.language);
  const [theme, setTheme] = useState<AppTheme>(initial.theme);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ language, theme }));
  }, [language, theme]);

  const value = useMemo<UiPreferencesContextValue>(() => ({
    language,
    theme,
    setLanguage,
    toggleLanguage: () => setLanguage((prev) => (prev === 'es' ? 'en' : 'es')),
    setTheme,
    toggleTheme: () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light')),
  }), [language, theme]);

  return <UiPreferencesContext.Provider value={value}>{children}</UiPreferencesContext.Provider>;
}

export function useUiPreferences() {
  const context = useContext(UiPreferencesContext);
  if (!context) {
    throw new Error('useUiPreferences must be used within UiPreferencesProvider');
  }
  return context;
}
