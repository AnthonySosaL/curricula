import { useEffect, useRef } from 'react';

/** Destello rojo + texto "¡CHOQUE!" al chocar (Web Animations API, sin CSS global). */
export function CrashFlash({ en }: { en: boolean }) {
  const flash = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    flash.current?.animate(
      [{ opacity: 0.85 }, { opacity: 0.25, offset: 0.25 }, { opacity: 0 }],
      { duration: 900, easing: 'ease-out', fill: 'forwards' },
    );
    label.current?.animate(
      [
        { opacity: 0, transform: 'scale(2.2)' },
        { opacity: 1, transform: 'scale(1)', offset: 0.18 },
        { opacity: 1, transform: 'scale(1.05)', offset: 0.75 },
        { opacity: 0, transform: 'scale(1.1)' },
      ],
      { duration: 1300, easing: 'cubic-bezier(.2,.9,.3,1.2)', fill: 'forwards' },
    );
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      <div
        ref={flash}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(255,120,60,0.55)_0%,rgba(220,20,20,0.5)_45%,rgba(80,0,0,0.75)_100%)]"
      />
      <p
        ref={label}
        className="relative text-5xl sm:text-7xl font-black italic tracking-tight text-white [text-shadow:0_0_24px_rgba(255,60,30,0.9),0_4px_0_rgba(120,0,0,0.9)]"
      >
        {en ? 'CRASH!' : '¡CHOQUE!'}
      </p>
    </div>
  );
}
