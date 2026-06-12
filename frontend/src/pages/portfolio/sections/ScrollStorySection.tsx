import { useEffect, useRef, useState, type ReactNode } from 'react';

export interface StoryPhase {
  title: string;
  subtitle?: string;
  content: ReactNode;
}

interface Props {
  id: string;
  badge: string;
  phases: StoryPhase[];
  className?: string;
  /** Altura del area de contenido en modo sticky (desktop) */
  contentMinHeight?: string;
}

/**
 * Replica el patron scroll-driven de SkillsSection para cualquier seccion:
 * en desktop la seccion es alta, el contenido queda pineado (sticky) y las
 * fases van apareciendo conforme el usuario desliza. En mobile se apilan.
 */
export function ScrollStorySection({
  id, badge, phases, className = '', contentMinHeight = 'min(56vh, 540px)',
}: Props) {
  const sectionRef    = useRef<HTMLElement>(null);
  const topRef        = useRef(0);
  const scrollableRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);
  const titleRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pillRefs    = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 900px), (pointer: coarse)');
    const onChange = () => setIsMobile(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const cachePos = () => {
      const el = sectionRef.current;
      if (!el) return;
      topRef.current        = el.getBoundingClientRect().top + window.scrollY;
      scrollableRef.current = el.offsetHeight - window.innerHeight;
    };
    cachePos();
    window.addEventListener('resize', cachePos, { passive: true });

    let rafId = 0;
    let lastPhase = -1;

    const applyPhase = (phase: number) => {
      const place = (el: HTMLElement | null, i: number, dist: number) => {
        if (!el) return;
        el.style.opacity       = i === phase ? '1' : '0';
        el.style.transform     = i === phase
          ? 'translateY(0)'
          : `translateY(${i < phase ? -dist : dist}px)`;
        el.style.pointerEvents = i === phase ? 'auto' : 'none';
      };
      titleRefs.current.forEach((el, i) => place(el, i, 14));
      contentRefs.current.forEach((el, i) => place(el, i, 28));
      pillRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.width      = i === phase ? '28px' : '8px';
        el.style.background = i === phase ? 'var(--color-primary)' : 'rgba(255,255,255,0.35)';
      });
    };

    const tick = () => {
      const scrollable = scrollableRef.current;
      if (scrollable > 0) {
        const p = Math.max(0, Math.min(1, (window.scrollY - topRef.current) / scrollable));
        const phase = Math.min(phases.length - 1, Math.floor(p * phases.length));
        if (phase !== lastPhase) {
          lastPhase = phase;
          applyPhase(phase);
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', cachePos);
    };
  }, [isMobile, phases.length]);

  const badgeEl = (
    <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold uppercase tracking-widest">
      {badge}
    </span>
  );

  // Mobile: fases apiladas sin sticky, mismo criterio que SkillsSection
  if (isMobile) {
    return (
      <section id={id} ref={sectionRef} className={`relative px-4 py-14 ${className}`}>
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-6">{badgeEl}</div>
          <div className="space-y-12">
            {phases.map((ph) => (
              <div key={ph.title}>
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-white drop-shadow-lg">{ph.title}</h2>
                  {ph.subtitle && (
                    <p className="mt-1.5 text-white/75 text-sm max-w-lg mx-auto drop-shadow">{ph.subtitle}</p>
                  )}
                </div>
                {ph.content}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const sectionHeight = `${Math.max(170, phases.length * 110)}vh`;

  return (
    <section id={id} ref={sectionRef} className="relative" style={{ minHeight: sectionHeight }}>
      <div className={`sticky top-0 h-screen overflow-hidden flex flex-col justify-center px-4 ${className}`}>
        <div className="max-w-5xl mx-auto w-full">

          <div className="text-center mb-5">{badgeEl}</div>

          {/* Titulos por fase */}
          <div className="relative text-center mb-7" style={{ minHeight: '64px' }}>
            {phases.map((ph, i) => (
              <div
                key={ph.title}
                ref={(el) => { titleRefs.current[i] = el; }}
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{
                  opacity: i === 0 ? 1 : 0,
                  transform: i === 0 ? 'translateY(0)' : 'translateY(14px)',
                  transition: 'opacity 0.45s ease, transform 0.45s ease',
                  pointerEvents: i === 0 ? 'auto' : 'none',
                  willChange: 'opacity, transform',
                }}
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">{ph.title}</h2>
                {ph.subtitle && (
                  <p className="mt-1.5 text-white/75 text-sm max-w-lg drop-shadow">{ph.subtitle}</p>
                )}
              </div>
            ))}
          </div>

          {/* Contenido por fase */}
          <div className="relative" style={{ minHeight: contentMinHeight }}>
            {phases.map((ph, i) => (
              <div
                key={ph.title}
                ref={(el) => { contentRefs.current[i] = el; }}
                className="absolute inset-0"
                style={{
                  opacity: i === 0 ? 1 : 0,
                  transform: i === 0 ? 'translateY(0)' : 'translateY(28px)',
                  transition: 'opacity 0.5s ease, transform 0.5s ease',
                  pointerEvents: i === 0 ? 'auto' : 'none',
                  willChange: 'opacity, transform',
                }}
              >
                {ph.content}
              </div>
            ))}
          </div>

          {/* Pills de progreso */}
          {phases.length > 1 && (
            <div className="mt-7 flex items-center justify-center gap-2">
              {phases.map((ph, i) => (
                <span
                  key={ph.title}
                  ref={(el) => { pillRefs.current[i] = el; }}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === 0 ? '28px' : '8px',
                    background: i === 0 ? 'var(--color-primary)' : 'rgba(255,255,255,0.35)',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
