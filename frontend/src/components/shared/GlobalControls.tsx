import { Languages, Moon, Sun } from 'lucide-react';
import { useUiPreferences } from '@/contexts/ui-preferences';
import { useI18n } from '@/lib/i18n';

export function GlobalControls() {
  const { language, theme, toggleLanguage, toggleTheme } = useUiPreferences();
  const { t } = useI18n();

  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-2 py-1">
      <button
        type="button"
        onClick={toggleLanguage}
        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-soft)] transition-colors"
        aria-label={t('global.toggleLanguage')}
      >
        <Languages size={14} />
        <span>{language.toUpperCase()}</span>
      </button>
      <button
        type="button"
        onClick={toggleTheme}
        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-soft)] transition-colors"
        aria-label={t('global.toggleTheme')}
      >
        {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        <span>{theme === 'dark' ? t('global.themeLight') : t('global.themeDark')}</span>
      </button>
    </div>
  );
}
