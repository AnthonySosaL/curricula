import { useMemo } from 'react';

// Genera posiciones aleatorias una sola vez: cada punto es una sombra del mismo div
function makeStarField(count: number) {
  return Array.from({ length: count }, () => {
    const x = Math.round(Math.random() * 100);
    const y = Math.round(Math.random() * 130);
    const alpha = (0.25 + Math.random() * 0.65).toFixed(2);
    return `${x}vw ${y}vh 0 rgba(255, 255, 255, ${alpha})`;
  }).join(', ');
}

/**
 * Fondo inmersivo compartido por las pantallas de carga (boot y dashboard):
 * estrellas que derivan, orbes de luz rojos/naranja, grid en perspectiva y vineta.
 */
export function ImmersiveBackdrop() {
  const stars = useMemo(() => ({ small: makeStarField(80), big: makeStarField(24) }), []);

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <span className="boot-stars" style={{ boxShadow: stars.small }} />
      <span className="boot-stars boot-stars--big" style={{ boxShadow: stars.big, animationDelay: '-1.8s' }} />
      <span className="boot-orb w-72 h-72 -top-16 -left-16 bg-red-600/60" />
      <span className="boot-orb w-96 h-96 -bottom-24 -right-20 bg-orange-700/60" style={{ animationDelay: '-4.5s' }} />
      <div className="boot-grid" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_30%,rgba(10,2,3,0.6)_100%)]" />
    </div>
  );
}
