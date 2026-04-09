import { useEffect, useRef, useState } from 'react';
import { Briefcase, MapPin } from 'lucide-react';
import { experience } from '@/data/portfolio';

export function ExperienceSection({ className = 'bg-[var(--color-bg)]' }: { className?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [jobIndex, setJobIndex] = useState(0);

  useEffect(() => {
    let rafId: number;
    let lastY = -1;
    const tick = () => {
      const el = sectionRef.current;
      if (el) {
        const y = window.scrollY;
        if (y !== lastY) {
          lastY = y;
          const top = el.getBoundingClientRect().top + y;
          const scrollable = el.offsetHeight - window.innerHeight;
          if (scrollable > 0) {
            const p = Math.max(0, Math.min(1, (y - top) / scrollable));
            setJobIndex(Math.min(experience.length - 1, Math.floor(p * experience.length)));
          }
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section id="experiencia" ref={sectionRef} className="relative" style={{ minHeight: `${(experience.length + 1) * 100}vh` }}>
      <div className={`sticky top-0 h-screen overflow-hidden flex flex-col justify-center px-4 ${className}`}>
        <div className="max-w-3xl mx-auto w-full">

          {/* Header */}
          <div className="text-center mb-7">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold uppercase tracking-widest mb-3">
              Experiencia {jobIndex + 1} / {experience.length}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">Trayectoria Profesional</h2>
            <p className="mt-1.5 text-white/75 text-sm drop-shadow">Empresas y roles donde he aportado valor</p>
          </div>

          {/* Tarjetas de trabajo — una por fase */}
          <div className="relative" style={{ minHeight: '280px' }}>
            {experience.map((job, i) => (
              <div
                key={i}
                className="absolute inset-0"
                style={{
                  opacity: jobIndex === i ? 1 : 0,
                  transform: jobIndex === i
                    ? 'translateY(0) scale(1)'
                    : jobIndex > i
                      ? 'translateY(-24px) scale(0.97)'
                      : 'translateY(24px) scale(0.97)',
                  transition: 'opacity 0.45s ease, transform 0.45s ease',
                  pointerEvents: jobIndex === i ? 'auto' : 'none',
                }}
              >
                <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 border-2 border-[var(--color-primary)] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Briefcase size={16} className="text-[var(--color-primary)]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[var(--color-text)] text-lg leading-tight">{job.role}</h3>
                        <p className="text-[var(--color-primary)] font-semibold text-sm">{job.company}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[var(--color-primary)] text-xs font-medium">
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
                      <span key={t} className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200 cursor-default">
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
                className="h-1 rounded-full transition-all duration-400"
                style={{
                  width: jobIndex === i ? '32px' : '8px',
                  background: i <= jobIndex ? 'var(--color-primary)' : 'var(--color-border)',
                }}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
