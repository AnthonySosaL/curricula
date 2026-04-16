import { useEffect, useRef, useState } from 'react';
import { Briefcase, MapPin } from 'lucide-react';
import { usePortfolioData } from '@/data/portfolio';
import { useI18n } from '@/lib/i18n';

export function ExperienceSection({ className = 'bg-[var(--color-bg)]' }: { className?: string }) {
  const { experience } = usePortfolioData();
  const { language } = useI18n();
  const sectionRef    = useRef<HTMLDivElement>(null);
  const topRef        = useRef(0);
  const scrollableRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  // Card refs — one per job
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Dot refs — one per job
  const dotRefs  = useRef<(HTMLDivElement | null)[]>([]);
  // Counter text ref
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 900px), (pointer: coarse)');
    const onChange = () => setIsMobile(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const cachePos = () => {
      const el = sectionRef.current;
      if (!el) return;
      topRef.current        = el.getBoundingClientRect().top + window.scrollY;
      scrollableRef.current = el.offsetHeight - window.innerHeight;
    };
    cachePos();
    window.addEventListener('resize', cachePos, { passive: true });

    let rafId: number;
    let lastJobIndex = -1;

    const tick = () => {
      const scrollable = scrollableRef.current;
      if (scrollable > 0) {
        const y  = window.scrollY;
        const p  = Math.max(0, Math.min(1, (y - topRef.current) / scrollable));
        const ji = Math.min(experience.length - 1, Math.floor(p * experience.length));

        if (ji !== lastJobIndex) {
          const prev = lastJobIndex;
          lastJobIndex = ji;

          // Counter text
          if (counterRef.current) {
            counterRef.current.textContent = `${language === 'en' ? 'Experience' : 'Experiencia'} ${ji + 1} / ${experience.length}`;
          }

          // Cards
          cardRefs.current.forEach((card, i) => {
            if (!card) return;
            if (i === ji) {
              card.style.opacity      = '1';
              card.style.transform    = 'translateY(0) scale(1)';
              card.style.pointerEvents = 'auto';
            } else {
              card.style.opacity      = '0';
              card.style.transform    = i < ji
                ? 'translateY(-24px) scale(0.97)'
                : 'translateY(24px) scale(0.97)';
              card.style.pointerEvents = 'none';
            }
          });

          // Dots
          dotRefs.current.forEach((dot, i) => {
            if (!dot) return;
            dot.style.width      = i === ji ? '32px' : '8px';
            dot.style.background = i <= ji
              ? 'var(--color-primary)'
              : 'var(--color-border)';
          });

          void prev; // suppress unused warning
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', cachePos);
    };
  }, [experience.length, language]);

  const mobileMinHeight = `${Math.max(240, Math.round((experience.length + 0.35) * 72))}vh`;
  const desktopMinHeight = `${(experience.length + 1) * 100}vh`;

  return (
    <section
      id="experiencia"
      ref={sectionRef}
      className="relative"
      style={{ minHeight: isMobile ? mobileMinHeight : desktopMinHeight }}
    >
      <div className={`sticky top-0 h-screen overflow-hidden flex flex-col justify-center px-4 ${className}`}>
        <div className="max-w-3xl mx-auto w-full">

          {/* Header */}
          <div className="text-center mb-7">
            <span
              ref={counterRef}
              className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold uppercase tracking-widest mb-3"
            >
              {language === 'en' ? 'Experience' : 'Experiencia'} 1 / {experience.length}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">{language === 'en' ? 'Professional Journey' : 'Trayectoria Profesional'}</h2>
            <p className="mt-1.5 text-white/75 text-sm drop-shadow">{language === 'en' ? 'Companies and roles where I delivered value' : 'Empresas y roles donde he aportado valor'}</p>
          </div>

          {/* Tarjetas de trabajo — una por fase */}
          <div className="relative" style={{ minHeight: '280px' }}>
            {experience.map((job, i) => (
              <div
                key={i}
                ref={el => { cardRefs.current[i] = el; }}
                className="absolute inset-0"
                style={{
                  opacity: i === 0 ? 1 : 0,
                  transform: i === 0 ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
                  transition: 'opacity 0.45s ease, transform 0.45s ease',
                  pointerEvents: i === 0 ? 'auto' : 'none',
                  willChange: 'opacity, transform',
                }}
              >
                <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-primary-light)] border-2 border-[var(--color-primary)] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Briefcase size={16} className="text-[var(--color-primary)]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[var(--color-text)] text-lg leading-tight">{job.role}</h3>
                        <p className="text-[var(--color-primary)] font-semibold text-sm">{job.company}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="inline-block px-3 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-medium">
                        {job.period}
                      </span>
                      <p className="flex items-center justify-end gap-1 text-xs text-[var(--color-text-muted)] mt-1">
                        <MapPin size={11} />{job.location}
                      </p>
                    </div>
                  </div>

                  <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-4">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {job.techs.map(t => (
                      <span key={t} className="px-2.5 py-0.5 rounded-full bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] text-xs font-medium border border-[var(--color-border)] cursor-default">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicador de progreso */}
          <div className="flex justify-center gap-2 mt-7">
            {experience.map((_, i) => (
              <div
                key={i}
                ref={el => { dotRefs.current[i] = el; }}
                className="h-1 rounded-full"
                style={{
                  width: i === 0 ? '32px' : '8px',
                  background: i === 0 ? 'var(--color-primary)' : 'var(--color-border)',
                  transition: 'width 0.3s ease, background 0.3s ease',
                }}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
