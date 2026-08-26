import { useEffect } from 'react';
import { getBoundaryPoints, getSettledPoints } from '@/lib/scrollSnap';

/**
 * Completa el scroll cuando el usuario queda "a medio camino" entre dos
 * fases pineadas (o entre dos secciones), en vez de dejarlo ahi mismo.
 * Solo actua en desktop (en mobile cada fase es su propio panel de scroll
 * natural, ahi no hace falta) y respeta prefers-reduced-motion.
 */
export function ScrollSnapController() {
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 900px), (pointer: coarse)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isMobile || reduceMotion) return;

    let debounceTimer = 0;
    let snapping = false;

    const trySnap = () => {
      if (snapping) return;
      const y = window.scrollY;
      const buffer = window.innerHeight * 0.12;
      const boundaries = getBoundaryPoints();
      const inRiskZone = boundaries.some((b) => Math.abs(y - b) <= buffer);
      if (!inRiskZone) return;

      const settled = getSettledPoints();
      if (!settled.length) return;
      let nearest = settled[0];
      let minDist = Math.abs(y - nearest);
      for (const p of settled) {
        const d = Math.abs(y - p);
        if (d < minDist) { minDist = d; nearest = p; }
      }
      if (Math.abs(nearest - y) < 2) return;

      snapping = true;
      window.scrollTo({ top: nearest, behavior: 'smooth' });
      window.setTimeout(() => { snapping = false; }, 600);
    };

    const onScroll = () => {
      if (snapping) return;
      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(trySnap, 140);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(debounceTimer);
    };
  }, []);

  return null;
}
