import { useEffect, type RefObject } from 'react';
import type { RunnerHandle } from './RunnerScene';

const SWIPE_PX = 28; // distancia mínima para considerar un gesto

const buzz = (ms: number) => {
  try { navigator.vibrate?.(ms); } catch { /* sin soporte: nada */ }
};

/**
 * Controles estilo "endless runner":
 * - Teclado: ← → / A D cambian de carril, ↑ / W / Espacio saltan, ↓ / S se desliza
 *   (sin autorrepetición).
 * - Táctil: deslizar en cualquier parte de la pantalla. El gesto se dispara en
 *   cuanto supera el umbral (no al soltar el dedo) → respuesta inmediata.
 *   Un toque corto sin desplazamiento también salta.
 */
export function useGameControls(game: RefObject<RunnerHandle | null>, surface: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement | null)?.closest?.('input, textarea')) return; // escribir el nombre
      const k = e.key.toLowerCase();
      const isJump = k === ' ' || k === 'arrowup' || k === 'w';
      if (isJump) e.preventDefault();
      if (e.repeat) return;
      if (k === 'arrowleft' || k === 'a') game.current?.move(-1);
      else if (k === 'arrowright' || k === 'd') game.current?.move(1);
      else if (isJump) game.current?.jump();
      else if (k === 'arrowdown' || k === 's') { e.preventDefault(); game.current?.slide(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [game]);

  useEffect(() => {
    const el = surface.current;
    if (!el || !active) return;
    let x0 = 0, y0 = 0, used = true;

    const start = (e: TouchEvent) => {
      const t = e.touches[0];
      x0 = t.clientX; y0 = t.clientY; used = false;
    };
    const move = (e: TouchEvent) => {
      e.preventDefault(); // evita scroll / pull-to-refresh mientras se juega
      if (used) return;
      const t = e.touches[0];
      const dx = t.clientX - x0, dy = t.clientY - y0;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_PX) return;
      used = true;
      if (Math.abs(dx) > Math.abs(dy)) { game.current?.move(dx > 0 ? 1 : -1); buzz(8); }
      else if (dy < 0) game.current?.jump();
      else game.current?.slide();
    };
    const end = () => {
      if (!used) game.current?.jump(); // toque corto = saltar
      used = true;
    };

    el.addEventListener('touchstart', start, { passive: true });
    el.addEventListener('touchmove', move, { passive: false });
    el.addEventListener('touchend', end);
    return () => {
      el.removeEventListener('touchstart', start);
      el.removeEventListener('touchmove', move);
      el.removeEventListener('touchend', end);
    };
  }, [game, surface, active]);
}

export { buzz };
