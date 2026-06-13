import { useEffect, useState } from 'react';
import { ChartColumnBig } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { ImmersiveBackdrop } from '@/components/ui/ImmersiveBackdrop';

const STEP_KEYS = ['dashLoad.step1', 'dashLoad.step2', 'dashLoad.step3'] as const;

/**
 * Pantalla de carga a pantalla completa para el dashboard, con el mismo
 * lenguaje visual del boot loader inicial pero indeterminada (espera datos
 * del backend). Avanza los pasos por tiempo y avisa del cold start de Render.
 */
export function DashboardLoadingScreen() {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const stepTimer = window.setInterval(() => {
      setActive((a) => Math.min(STEP_KEYS.length - 1, a + 1));
    }, 1600);
    const hintTimer = window.setTimeout(() => setShowHint(true), 6000);
    return () => { window.clearInterval(stepTimer); window.clearTimeout(hintTimer); };
  }, []);

  return (
    <div className="fixed inset-0 z-[150] overflow-hidden bg-[radial-gradient(circle_at_15%_20%,#b91c1c_0%,#1c0808_38%,#0a0203_100%)] flex items-center justify-center px-6">
      <ImmersiveBackdrop />

      <div className="relative flex flex-col items-center w-full max-w-sm">
        {/* Anillo indeterminado + orbitas + icono central */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 mb-8">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div
            className="absolute inset-0 rounded-full border-t-2 border-r-2 border-[var(--color-primary)] animate-spin"
            style={{ animationDuration: '1.1s' }}
          />
          <div className="absolute inset-3 boot-orbit">
            <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-400 shadow-[0_0_12px_#f87171]" />
          </div>
          <div className="absolute inset-7 boot-orbit-rev">
            <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_10px_#fcd34d]" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center boot-core">
            <ChartColumnBig size={44} className="text-amber-200 drop-shadow-lg" />
          </div>
        </div>

        <p className="text-xs uppercase tracking-[0.24em] text-red-200/85 mb-2">{t('dashLoad.kicker')}</p>
        <h2 className="text-white text-xl sm:text-2xl font-bold mb-1">
          {t('dashLoad.title')}<span className="cursor-blink" />
        </h2>
        <p className="text-sm text-white/60 mb-6">{t('dashLoad.subtitle')}</p>

        {/* Pasos progresivos por tiempo */}
        <div className="w-full font-mono text-[11px] sm:text-xs space-y-1.5">
          {STEP_KEYS.map((key, i) => {
            if (i > active) return null;
            const stepDone = i < active;
            return (
              <p key={key} className="boot-line flex items-center gap-2 text-white/75">
                <span className={stepDone ? 'text-green-400' : 'text-amber-300 animate-pulse'}>
                  {stepDone ? '✓' : '▸'}
                </span>
                {t(key)}
              </p>
            );
          })}
        </div>

        {showHint && (
          <p className="boot-line mt-4 text-xs text-amber-200/80 text-center max-w-xs">
            ⏳ {t('dashboard.loadingHint')}
          </p>
        )}
      </div>
    </div>
  );
}
