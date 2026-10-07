import { useEffect, useMemo, useRef, useState } from 'react';
import { movingAverage, niceScale } from '@/lib/timeline-stats';
import type { AnalyticsTimelinePoint } from '@/types/api';
import { SERIES_COLORS } from './timeline-colors';

const HEIGHT = 250;
const M = { left: 38, right: 14, top: 14, bottom: 30 };

interface Props {
  points: AnalyticsTimelinePoint[];
  locale: string;
  show: { visits: boolean; avg: boolean; ai: boolean };
  labels: { visits: string; avg: string; ai: string };
}

const asDate = (iso: string) => new Date(`${iso}T00:00:00Z`);
const fmt = (locale: string, iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(locale, { ...opts, timeZone: 'UTC' }).format(asDate(iso));

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, width };
}

export function TimelineChart({ points, locale, show, labels }: Props) {
  const { ref, width } = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);

  const n = points.length;
  const visits = useMemo(() => points.map((p) => p.visits), [points]);
  const ai = useMemo(() => points.map((p) => p.aiRequests), [points]);
  const avg = useMemo(() => movingAverage(visits, 7), [visits]);

  const yMax = Math.max(1, ...(show.visits ? visits : [0]), ...(show.ai ? ai : [0]), ...(show.avg ? avg : [0]));
  const scale = niceScale(yMax);
  const plotW = Math.max(width - M.left - M.right, 10);
  const plotH = HEIGHT - M.top - M.bottom;
  const x = (i: number) => M.left + (n <= 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const y = (v: number) => M.top + plotH - (v / scale.max) * plotH;

  const line = (values: number[]) => values.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const area = `${line(visits)} L${x(n - 1).toFixed(1)},${y(0)} L${x(0).toFixed(1)},${y(0)} Z`;

  const peakIdx = visits.reduce((best, v, i) => (v > visits[best] ? i : best), 0);

  // Etiquetas del eje X: dias para rangos cortos, mes para rangos largos; nunca pegadas
  const xLabels = useMemo(() => {
    const out: { i: number; text: string }[] = [];
    if (n === 0 || width === 0) return out;
    const monthly = n > 45;
    const step = n <= 10 ? 1 : Math.ceil(n / 7);
    for (let i = 0; i < n; i += 1) {
      const date = points[i].date;
      if (monthly) {
        if (i !== 0 && date.slice(8) !== '01') continue;
        out.push({ i, text: fmt(locale, date, { month: 'short', ...(date.slice(5, 7) === '01' || i === 0 ? { year: '2-digit' } : {}) }) });
      } else if (i % step === 0 || i === n - 1) {
        out.push({ i, text: fmt(locale, date, n <= 10 ? { weekday: 'short', day: 'numeric' } : { day: 'numeric', month: 'short' }) });
      }
    }
    const kept: typeof out = [];
    for (const l of out) if (kept.length === 0 || x(l.i) - x(kept[kept.length - 1].i) >= 52) kept.push(l);
    return kept;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, width, locale, n]);

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (n === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const rel = (e.clientX - rect.left - M.left) / plotW;
    setHover(Math.min(n - 1, Math.max(0, Math.round(rel * (n - 1)))));
  };

  const hp = hover !== null ? points[hover] : null;
  const tipLeft = hover !== null ? Math.min(Math.max(x(hover) - 80, 4), Math.max(width - 164, 4)) : 0;

  return (
    <div ref={ref} className="relative w-full select-none" style={{ height: HEIGHT }}>
      {width > 0 && n > 0 && (
        <svg
          width={width}
          height={HEIGHT}
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
          role="img"
          aria-label={labels.visits}
          className="touch-pan-y"
        >
          <defs>
            <linearGradient id="tl-visits-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SERIES_COLORS.visits} stopOpacity="0.35" />
              <stop offset="100%" stopColor={SERIES_COLORS.visits} stopOpacity="0" />
            </linearGradient>
          </defs>

          {Array.from({ length: scale.ticks + 1 }, (_, k) => k * scale.step).map((tick) => (
            <g key={tick}>
              <line x1={M.left} x2={width - M.right} y1={y(tick)} y2={y(tick)} stroke="var(--color-border)" strokeDasharray={tick === 0 ? undefined : '3 4'} />
              <text x={M.left - 8} y={y(tick) + 4} textAnchor="end" fontSize="11" fill="var(--color-text-muted)">{tick}</text>
            </g>
          ))}

          {xLabels.map((l) => (
            <text key={l.i} x={x(l.i)} y={HEIGHT - 9} textAnchor="middle" fontSize="11" fill="var(--color-text-muted)">{l.text}</text>
          ))}

          {show.visits && (
            <>
              <path d={area} fill="url(#tl-visits-grad)" />
              <path d={line(visits)} fill="none" stroke={SERIES_COLORS.visits} strokeWidth="1.6" strokeLinejoin="round" opacity="0.9" />
              {visits[peakIdx] > 0 && (
                <g>
                  <circle cx={x(peakIdx)} cy={y(visits[peakIdx])} r="4.5" fill={SERIES_COLORS.visits} stroke="var(--color-card)" strokeWidth="2" />
                  <text x={Math.min(Math.max(x(peakIdx), M.left + 12), width - M.right - 12)} y={y(visits[peakIdx]) - 9} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--color-text)">{visits[peakIdx]}</text>
                </g>
              )}
            </>
          )}
          {show.ai && <path d={line(ai)} fill="none" stroke={SERIES_COLORS.ai} strokeWidth="1.8" strokeDasharray="5 4" strokeLinejoin="round" />}
          {show.avg && <path d={line(avg)} fill="none" stroke={SERIES_COLORS.avg} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />}

          {hover !== null && (
            <g pointerEvents="none">
              <line x1={x(hover)} x2={x(hover)} y1={M.top} y2={y(0)} stroke="var(--color-text-muted)" strokeDasharray="3 3" />
              {show.visits && <circle cx={x(hover)} cy={y(visits[hover])} r="4" fill={SERIES_COLORS.visits} stroke="var(--color-card)" strokeWidth="2" />}
              {show.avg && <circle cx={x(hover)} cy={y(avg[hover])} r="4" fill={SERIES_COLORS.avg} stroke="var(--color-card)" strokeWidth="2" />}
              {show.ai && <circle cx={x(hover)} cy={y(ai[hover])} r="4" fill={SERIES_COLORS.ai} stroke="var(--color-card)" strokeWidth="2" />}
            </g>
          )}
        </svg>
      )}

      {hp && hover !== null && (
        <div
          className="absolute top-1 pointer-events-none rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-xs shadow-[var(--shadow-md)] w-40"
          style={{ left: tipLeft }}
        >
          <p className="font-semibold text-[var(--color-text)] mb-1 capitalize">{fmt(locale, hp.date, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
          <p className="flex justify-between gap-2 text-[var(--color-text-secondary)]"><span style={{ color: SERIES_COLORS.visits }}>● {labels.visits}</span><b className="text-[var(--color-text)]">{hp.visits}</b></p>
          <p className="flex justify-between gap-2 text-[var(--color-text-secondary)]"><span style={{ color: SERIES_COLORS.avg }}>● {labels.avg}</span><b className="text-[var(--color-text)]">{avg[hover].toFixed(1)}</b></p>
          <p className="flex justify-between gap-2 text-[var(--color-text-secondary)]"><span style={{ color: SERIES_COLORS.ai }}>● {labels.ai}</span><b className="text-[var(--color-text)]">{hp.aiRequests}</b></p>
        </div>
      )}
    </div>
  );
}
