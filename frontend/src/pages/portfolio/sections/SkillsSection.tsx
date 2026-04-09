import { useEffect, useRef, useState } from 'react';
import { Users, Lightbulb, Zap, Target, GitMerge, MessageSquare } from 'lucide-react';
import { skills } from '@/data/portfolio';

const SOFT_SKILLS = [
  { name: 'Liderazgo', icon: Target, level: 88, desc: 'Coordiné equipos en proyectos gubernamentales', color: 'text-blue-600 bg-blue-50' },
  { name: 'Trabajo en equipo', icon: Users, level: 95, desc: 'Colaboración efectiva en entornos remotos e híbridos', color: 'text-green-600 bg-green-50' },
  { name: 'Resolución de problemas', icon: Lightbulb, level: 90, desc: 'Diagnóstico y solución de problemas técnicos complejos', color: 'text-amber-600 bg-amber-50' },
  { name: 'Adaptabilidad', icon: Zap, level: 92, desc: 'Me adapto rápido a nuevas tecnologías y entornos', color: 'text-violet-600 bg-violet-50' },
  { name: 'Proactividad', icon: GitMerge, level: 87, desc: 'Propongo mejoras antes de que sean solicitadas', color: 'text-rose-600 bg-rose-50' },
  { name: 'Comunicación', icon: MessageSquare, level: 85, desc: 'Reportes técnicos claros para equipos y clientes', color: 'text-cyan-600 bg-cyan-50' },
];

const CATEGORY_COLORS: Record<string, { badge: string; icon: string }> = {
  Frontend:               { badge: 'bg-violet-50 text-violet-700 border-violet-200', icon: 'bg-violet-100 text-violet-600' },
  Backend:                { badge: 'bg-blue-50 text-blue-700 border-blue-200',       icon: 'bg-blue-100 text-blue-600' },
  'Bases de datos & ORM': { badge: 'bg-green-50 text-green-700 border-green-200',    icon: 'bg-green-100 text-green-600' },
  'Cloud & DevOps':       { badge: 'bg-amber-50 text-amber-700 border-amber-200',    icon: 'bg-amber-100 text-amber-600' },
  'IA & Datos':           { badge: 'bg-rose-50 text-rose-700 border-rose-200',       icon: 'bg-rose-100 text-rose-600' },
  Automatización:         { badge: 'bg-slate-50 text-slate-700 border-slate-200',    icon: 'bg-slate-100 text-slate-600' },
};

const CATEGORY_EMOJI: Record<string, string> = {
  Frontend: '🎨', Backend: '⚙️', 'Bases de datos & ORM': '🗄️',
  'Cloud & DevOps': '☁️', 'IA & Datos': '🤖', Automatización: '⚡',
};

const PHASES = [
  { title: 'Stack Tecnológico',  subtitle: 'Tecnologías y herramientas con las que trabajo a diario' },
  { title: 'Habilidades Blandas', subtitle: 'Cualidades que complementan mi perfil técnico' },
];

export function SkillsSection({ className = 'bg-white' }: { className?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);

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
            setPhase(p < 0.5 ? 0 : 1);
          }
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section id="habilidades" ref={sectionRef} className="relative" style={{ minHeight: '220vh' }}>
      <div className={`sticky top-0 h-screen overflow-hidden flex flex-col justify-center px-4 ${className}`}>
        <div className="max-w-5xl mx-auto w-full">

          {/* Badge siempre visible */}
          <div className="text-center mb-5">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold uppercase tracking-widest">
              Habilidades
            </span>
          </div>

          {/* Títulos animados por fase */}
          <div className="relative text-center mb-7" style={{ minHeight: '64px' }}>
            {PHASES.map((p, i) => (
              <div
                key={i}
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{
                  opacity: phase === i ? 1 : 0,
                  transform: phase === i ? 'translateY(0)' : phase > i ? 'translateY(-14px)' : 'translateY(14px)',
                  transition: 'opacity 0.45s ease, transform 0.45s ease',
                  pointerEvents: phase === i ? 'auto' : 'none',
                }}
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">{p.title}</h2>
                <p className="mt-1.5 text-white/75 text-sm max-w-lg drop-shadow">{p.subtitle}</p>
              </div>
            ))}
          </div>

          {/* Contenido de fases */}
          <div className="relative" style={{ minHeight: '360px' }}>

            {/* Fase 0 — Stack Tecnológico */}
            <div
              className="absolute inset-0"
              style={{
                opacity: phase === 0 ? 1 : 0,
                transform: phase === 0 ? 'translateY(0)' : 'translateY(-28px)',
                transition: 'opacity 0.45s ease, transform 0.45s ease',
                pointerEvents: phase === 0 ? 'auto' : 'none',
              }}
            >
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map(({ category, items }) => {
                  const colors = CATEGORY_COLORS[category] ?? { badge: 'bg-slate-50 text-slate-600 border-slate-200', icon: 'bg-slate-100 text-slate-500' };
                  return (
                    <div key={category} className="bg-[var(--color-bg)] rounded-2xl p-5 border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 hover:shadow-[var(--shadow-md)] transition-all">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${colors.icon}`}>
                          {CATEGORY_EMOJI[category] ?? '🔧'}
                        </span>
                        <h3 className="font-semibold text-[var(--color-text)] text-xs uppercase tracking-wide flex-1">{category}</h3>
                        <span className="text-xs text-[var(--color-text-muted)] bg-white border border-[var(--color-border)] px-2 py-0.5 rounded-full">{items.length}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {items.map(skill => (
                          <span key={skill} className={`px-2.5 py-0.5 rounded-full text-xs font-medium border cursor-default ${colors.badge}`}>{skill}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fase 1 — Habilidades Blandas */}
            <div
              className="absolute inset-0"
              style={{
                opacity: phase === 1 ? 1 : 0,
                transform: phase === 1 ? 'translateY(0)' : 'translateY(28px)',
                transition: 'opacity 0.45s ease, transform 0.45s ease',
                pointerEvents: phase === 1 ? 'auto' : 'none',
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SOFT_SKILLS.map(({ name, icon: Icon, level, desc, color }) => (
                  <div key={name} className="bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border)] p-4 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                        <Icon size={16} />
                      </span>
                      <p className="font-semibold text-[var(--color-text)] text-sm flex-1">{name}</p>
                      <span className="text-xs font-bold text-[var(--color-primary)]">{level}%</span>
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] mb-2.5 leading-snug">{desc}</p>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-blue-400"
                        style={{
                          width: phase === 1 ? `${level}%` : '0%',
                          transition: 'width 1s cubic-bezier(0.22, 1, 0.36, 1)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Indicador de fase (pills) */}
          <div className="flex justify-center gap-2 mt-5">
            {PHASES.map((_, i) => (
              <div
                key={i}
                className="h-1 rounded-full transition-all duration-400"
                style={{
                  width: phase === i ? '28px' : '8px',
                  background: phase === i ? 'var(--color-primary)' : 'var(--color-border)',
                }}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

// Reutilizable en otras secciones
export function SectionHeader({
  label, title, subtitle, inView = true,
}: { label: string; title: string; subtitle?: string; inView?: boolean }) {
  return (
    <div className="text-center">
      <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[var(--color-primary)] text-xs font-semibold uppercase tracking-widest mb-3"
        style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}>
        {label}
      </span>
      <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)]"
        style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.5s ease 80ms, transform 0.5s ease 80ms' }}>
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-[var(--color-text-secondary)] text-base max-w-xl mx-auto"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.5s ease 160ms, transform 0.5s ease 160ms' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
