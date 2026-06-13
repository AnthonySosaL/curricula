import { useI18n } from '@/lib/i18n';
import { usePortfolioData } from '@/data/portfolio';
import { ImmersiveBackdrop } from '@/components/ui/ImmersiveBackdrop';

const STEPS = [
  { at: 0,  key: 'boot.core' },
  { at: 30, key: 'boot.videos' },
  { at: 55, key: 'boot.robot' },
  { at: 80, key: 'boot.ui' },
] as const;

const RING_R = 56;
const RING_C = 2 * Math.PI * RING_R;

export function BootLoadingScreen({ progress }: { progress: number }) {
  const { t } = useI18n();
  const { profile } = usePortfolioData();
  const initials = profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2);
  const offset = RING_C * (1 - Math.min(100, progress) / 100);
  const done = progress >= 100;

  return (
    <div
      className={`fixed inset-0 z-[200] overflow-hidden bg-[radial-gradient(circle_at_15%_20%,#b91c1c_0%,#1c0808_38%,#0a0203_100%)] flex items-center justify-center px-6 transition-opacity duration-500 ${done ? 'opacity-0' : 'opacity-100'}`}
    >
      <ImmersiveBackdrop />

      <div className="relative flex flex-col items-center w-full max-w-sm">
        {/* Nucleo central con anillo de progreso y orbitas */}
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 mb-8">
          <svg viewBox="0 0 128 128" className="absolute inset-0 w-full h-full -rotate-90">
            <defs>
              <linearGradient id="boot-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="55%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
            </defs>
            <circle cx="64" cy="64" r={RING_R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
            <circle
              cx="64" cy="64" r={RING_R} fill="none"
              stroke="url(#boot-ring-grad)" strokeWidth="3.5" strokeLinecap="round"
              strokeDasharray={RING_C} strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.25s ease' }}
            />
          </svg>

          <div className="absolute inset-2 boot-orbit">
            <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-400 shadow-[0_0_12px_#f87171]" />
          </div>
          <div className="absolute inset-6 boot-orbit-rev">
            <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_10px_#fcd34d]" />
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center boot-core">
            <span className="text-4xl sm:text-5xl font-bold bg-gradient-to-br from-amber-200 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-lg">
              {initials}
            </span>
            <span className="mt-1 text-lg font-semibold text-white/90 tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        <h2 className="text-white text-xl sm:text-2xl font-bold mb-1">{t('portfolio.loadingTitle')}</h2>
        <p className="text-xs uppercase tracking-[0.24em] text-red-200/85 mb-6">{t('boot.title')}</p>

        {/* Log de arranque progresivo */}
        <div className="w-full font-mono text-[11px] sm:text-xs space-y-1.5">
          {STEPS.filter((s) => progress >= s.at).map((s, i) => {
            const next = STEPS[i + 1];
            const stepDone = done || (next ? progress >= next.at : false);
            return (
              <p key={s.key} className="boot-line flex items-center gap-2 text-white/75">
                <span className={stepDone ? 'text-green-400' : 'text-amber-300 animate-pulse'}>
                  {stepDone ? '✓' : '▸'}
                </span>
                {t(s.key)}
              </p>
            );
          })}
          {done && (
            <p className="boot-line flex items-center gap-2 text-green-300 font-semibold">
              <span>{'✓'}</span>
              {t('boot.ready')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
