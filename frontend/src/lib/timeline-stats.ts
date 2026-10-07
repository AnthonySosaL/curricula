export interface DayPoint {
  date: string; // YYYY-MM-DD
  visits: number;
}

// Descarta los dias anteriores al primer evento: antes de empezar a medir no es "cero visitas"
export function trimToHistory<T extends DayPoint>(points: T[], firstEventDate: string | null): T[] {
  if (!firstEventDate) return points;
  const start = points.findIndex((p) => p.date >= firstEventDate);
  return start === -1 ? points : points.slice(start);
}

// Promedio movil "hacia atras": cada dia promedia los ultimos `window` dias disponibles
export function movingAverage(values: number[], window = 7): number[] {
  return values.map((_, i) => {
    const slice = values.slice(Math.max(0, i - window + 1), i + 1);
    return slice.reduce((a, b) => a + b, 0) / slice.length;
  });
}

// Escala del eje Y: el paso "redondo" (1, 2, 2.5, 5, 10 x potencia de 10) mas chico que cubre el
// maximo con a lo sumo `maxTicks` divisiones; los conteos son enteros, asi que el paso minimo es 1
export function niceScale(maxValue: number, maxTicks = 5): { step: number; max: number; ticks: number } {
  const m = Math.max(maxValue, 1);
  const pow = Math.pow(10, Math.floor(Math.log10(m / maxTicks)));
  for (const mult of [1, 2, 2.5, 5, 10]) {
    const step = Math.max(1, mult * pow);
    const ticks = Math.ceil(m / step);
    if (ticks <= maxTicks) return { step, max: step * ticks, ticks };
  }
  const step = 10 * pow;
  return { step, max: step * maxTicks, ticks: maxTicks };
}

export interface TimelineStats {
  total: number;
  avgPerDay: number;
  peak: { date: string; visits: number } | null;
  bestWeek: { from: string; to: string; visits: number } | null;
  bestMonth: { month: string; visits: number } | null; // YYYY-MM
  // % de cambio de la segunda mitad del periodo contra la primera; Infinity si antes no habia visitas
  trendPct: number | null;
}

export function computeStats(points: DayPoint[]): TimelineStats {
  const n = points.length;
  const total = points.reduce((a, p) => a + p.visits, 0);
  const peak = points.reduce<TimelineStats['peak']>(
    (best, p) => (p.visits > (best?.visits ?? 0) ? { date: p.date, visits: p.visits } : best),
    null,
  );

  let bestWeek: TimelineStats['bestWeek'] = null;
  if (n >= 7) {
    let window = points.slice(0, 7).reduce((a, p) => a + p.visits, 0);
    bestWeek = { from: points[0].date, to: points[6].date, visits: window };
    for (let i = 7; i < n; i += 1) {
      window += points[i].visits - points[i - 7].visits;
      if (window > bestWeek.visits) bestWeek = { from: points[i - 6].date, to: points[i].date, visits: window };
    }
    if (bestWeek.visits === 0) bestWeek = null;
  }

  const byMonth = new Map<string, number>();
  for (const p of points) byMonth.set(p.date.slice(0, 7), (byMonth.get(p.date.slice(0, 7)) ?? 0) + p.visits);
  const topMonth = [...byMonth.entries()].sort((a, b) => b[1] - a[1])[0];
  const bestMonth = topMonth && topMonth[1] > 0 ? { month: topMonth[0], visits: topMonth[1] } : null;

  const half = Math.floor(n / 2);
  let trendPct: number | null = null;
  if (half >= 2) {
    const first = points.slice(0, half).reduce((a, p) => a + p.visits, 0);
    const last = points.slice(n - half).reduce((a, p) => a + p.visits, 0);
    trendPct = first === 0 ? (last > 0 ? Infinity : 0) : ((last - first) / first) * 100;
  }

  return { total, avgPerDay: n > 0 ? total / n : 0, peak, bestWeek, bestMonth, trendPct };
}
