import { useEffect, useRef, useState } from 'react';
import { Users, Lightbulb, Zap, Target, GitMerge, MessageSquare } from 'lucide-react';
import { usePortfolioData } from '@/data/portfolio';
import { useI18n } from '@/lib/i18n';

const CATEGORY_COLORS: Record<string, { badge: string; icon: string }> = {
  Frontend:               { badge: 'bg-violet-50 text-violet-700 border-violet-200', icon: 'bg-violet-100 text-violet-600' },
  Backend:                { badge: 'bg-blue-50 text-blue-700 border-blue-200',       icon: 'bg-blue-100 text-blue-600' },
  'Bases de datos & ORM': { badge: 'bg-green-50 text-green-700 border-green-200',    icon: 'bg-green-100 text-green-600' },
  'Databases & ORM':      { badge: 'bg-green-50 text-green-700 border-green-200',    icon: 'bg-green-100 text-green-600' },
  'Cloud & DevOps':       { badge: 'bg-amber-50 text-amber-700 border-amber-200',    icon: 'bg-amber-100 text-amber-600' },
  'IA & Datos':           { badge: 'bg-rose-50 text-rose-700 border-rose-200',       icon: 'bg-rose-100 text-rose-600' },
  'AI & Data':            { badge: 'bg-rose-50 text-rose-700 border-rose-200',       icon: 'bg-rose-100 text-rose-600' },
  Automatizacion:         { badge: 'bg-slate-50 text-slate-700 border-slate-200',    icon: 'bg-slate-100 text-slate-600' },
  Automation:             { badge: 'bg-slate-50 text-slate-700 border-slate-200',    icon: 'bg-slate-100 text-slate-600' },
};

const CATEGORY_EMOJI: Record<string, string> = {
  Frontend: '🎨', Backend: '⚙️', 'Bases de datos & ORM': '🗄️', 'Databases & ORM': '🗄️',
  'Cloud & DevOps': '☁️', 'IA & Datos': '🤖', 'AI & Data': '🤖', Automatizacion: '⚡', Automation: '⚡',
};

export function SkillsSection({ className = 'bg-white' }: { className?: string }) {
  const sectionRef    = useRef<HTMLDivElement>(null);
  const { skills } = usePortfolioData();
  const { language } = useI18n();
  const softSkills = language === 'en'
    ? [
      { name: 'Leadership', icon: Target, level: 88, desc: 'Led teams in government projects', color: 'text-blue-600 bg-blue-50' },
      { name: 'Teamwork', icon: Users, level: 95, desc: 'Effective collaboration in remote and hybrid teams', color: 'text-green-600 bg-green-50' },
      { name: 'Problem solving', icon: Lightbulb, level: 90, desc: 'Diagnosis and resolution of complex technical problems', color: 'text-amber-600 bg-amber-50' },
      { name: 'Adaptability', icon: Zap, level: 92, desc: 'Fast adaptation to new technologies and environments', color: 'text-violet-600 bg-violet-50' },
      { name: 'Proactivity', icon: GitMerge, level: 87, desc: 'Proposes improvements before they are requested', color: 'text-rose-600 bg-rose-50' },
      { name: 'Communication', icon: MessageSquare, level: 85, desc: 'Clear technical reporting for teams and clients', color: 'text-cyan-600 bg-cyan-50' },
    ]
    : [
      { name: 'Liderazgo', icon: Target, level: 88, desc: 'Coordine equipos en proyectos gubernamentales', color: 'text-blue-600 bg-blue-50' },
      { name: 'Trabajo en equipo', icon: Users, level: 95, desc: 'Colaboracion efectiva en entornos remotos e hibridos', color: 'text-green-600 bg-green-50' },
      { name: 'Resolucion de problemas', icon: Lightbulb, level: 90, desc: 'Diagnostico y solucion de problemas tecnicos complejos', color: 'text-amber-600 bg-amber-50' },
      { name: 'Adaptabilidad', icon: Zap, level: 92, desc: 'Me adapto rapido a nuevas tecnologias y entornos', color: 'text-violet-600 bg-violet-50' },
      { name: 'Proactividad', icon: GitMerge, level: 87, desc: 'Propongo mejoras antes de que sean solicitadas', color: 'text-rose-600 bg-rose-50' },
      { name: 'Comunicacion', icon: MessageSquare, level: 85, desc: 'Reportes tecnicos claros para equipos y clientes', color: 'text-cyan-600 bg-cyan-50' },
    ];
  const phases = language === 'en'
    ? [
      { title: 'Technology Stack', subtitle: 'Technologies and tools I use daily' },
      { title: 'Soft Skills', subtitle: 'Qualities that complement my technical profile' },
    ]
    : [
      { title: 'Stack Tecnologico', subtitle: 'Tecnologias y herramientas con las que trabajo a diario' },
      { title: 'Habilidades Blandas', subtitle: 'Cualidades que complementan mi perfil tecnico' },
    ];
  const topRef        = useRef(0);
  const scrollableRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  // Phase title refs
  const title0Ref = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLDivElement>(null);
  // Phase content refs
  const content0Ref = useRef<HTMLDivElement>(null);
  const content1Ref = useRef<HTMLDivElement>(null);
  // Progress bar refs
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barsAnimated = useRef(false);
  // Pill refs
  const pill0Ref = useRef<HTMLDivElement>(null);
  const pill1Ref = useRef<HTMLDivElement>(null);

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

    let rafId: number;
    let lastPhase = -1;

    const tick = () => {
      const scrollable = scrollableRef.current;
      if (scrollable > 0) {
        const y = window.scrollY;
        const p = Math.max(0, Math.min(1, (y - topRef.current) / scrollable));
        const phase = p < 0.5 ? 0 : 1;

        if (phase !== lastPhase) {
          lastPhase = phase;

          // Titles
          if (title0Ref.current) {
            title0Ref.current.style.opacity   = phase === 0 ? '1' : '0';
            title0Ref.current.style.transform = phase === 0 ? 'translateY(0)' : 'translateY(-14px)';
            title0Ref.current.style.pointerEvents = phase === 0 ? 'auto' : 'none';
          }
          if (title1Ref.current) {
            title1Ref.current.style.opacity   = phase === 1 ? '1' : '0';
            title1Ref.current.style.transform = phase === 1 ? 'translateY(0)' : 'translateY(14px)';
            title1Ref.current.style.pointerEvents = phase === 1 ? 'auto' : 'none';
          }

          // Content panels
          if (content0Ref.current) {
            content0Ref.current.style.opacity   = phase === 0 ? '1' : '0';
            content0Ref.current.style.transform = phase === 0 ? 'translateY(0)' : 'translateY(-28px)';
            content0Ref.current.style.pointerEvents = phase === 0 ? 'auto' : 'none';
          }
          if (content1Ref.current) {
            content1Ref.current.style.opacity   = phase === 1 ? '1' : '0';
            content1Ref.current.style.transform = phase === 1 ? 'translateY(0)' : 'translateY(28px)';
            content1Ref.current.style.pointerEvents = phase === 1 ? 'auto' : 'none';
          }

          // Pills
          if (pill0Ref.current) {
            pill0Ref.current.style.width      = phase === 0 ? '28px' : '8px';
            pill0Ref.current.style.background = phase === 0 ? 'var(--color-primary)' : 'var(--color-border)';
          }
          if (pill1Ref.current) {
            pill1Ref.current.style.width      = phase === 1 ? '28px' : '8px';
            pill1Ref.current.style.background = phase === 1 ? 'var(--color-primary)' : 'var(--color-border)';
          }

          // Progress bars (animate in when entering phase 1, reset on phase 0)
          if (phase === 1 && !barsAnimated.current) {
            barsAnimated.current = true;
            barRefs.current.forEach((bar, i) => {
              if (bar) bar.style.width = `${softSkills[i].level}%`;
            });
          } else if (phase === 0 && barsAnimated.current) {
            barsAnimated.current = false;
            barRefs.current.forEach(bar => { if (bar) bar.style.width = '0%'; });
          }
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', cachePos);
    };
  }, [isMobile]);

  if (isMobile) {
    return (
      <section id="habilidades" ref={sectionRef} className={`relative px-4 py-14 ${className}`}>
        <div className="max-w-5xl mx-auto w-full">

          <div className="text-center mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold uppercase tracking-widest">
              {language === 'en' ? 'Skills' : 'Habilidades'}
            </span>
            <h2 className="mt-3 text-3xl font-bold text-white drop-shadow-lg">{phases[0].title}</h2>
            <p className="mt-1.5 text-white/75 text-sm max-w-lg mx-auto drop-shadow">{phases[0].subtitle}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-9">
            {skills.map(({ category, items }) => {
              const colors = CATEGORY_COLORS[category] ?? { badge: 'bg-slate-50 text-slate-600 border-slate-200', icon: 'bg-slate-100 text-slate-500' };
              return (
                <div key={category} className="bg-[var(--color-bg)] rounded-2xl p-5 border border-[var(--color-border)]">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${colors.icon}`}>
                      {CATEGORY_EMOJI[category] ?? '🔧'}
                    </span>
                    <h3 className="font-semibold text-[var(--color-text)] text-xs uppercase tracking-wide flex-1">{category}</h3>
                    <span className="text-xs text-[var(--color-text-muted)] bg-[var(--color-card)] border border-[var(--color-border)] px-2 py-0.5 rounded-full">{items.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map(skill => (
                      <span key={skill} className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors.badge}`}>{skill}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">{language === 'en' ? 'Soft Skills' : 'Habilidades Blandas'}</h2>
            <p className="mt-1.5 text-white/75 text-sm max-w-lg mx-auto drop-shadow">{phases[1].subtitle}</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {softSkills.map(({ name, icon: Icon, level, desc, color }) => (
              <div key={name} className="bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border)] p-4">
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
                    style={{ width: `${level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="habilidades" ref={sectionRef} className="relative" style={{ minHeight: '220vh' }}>
      <div className={`sticky top-0 h-screen overflow-hidden flex flex-col justify-center px-4 ${className}`}>
        <div className="max-w-5xl mx-auto w-full">

          {/* Badge */}
          <div className="text-center mb-5">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold uppercase tracking-widest">
              {language === 'en' ? 'Skills' : 'Habilidades'}
            </span>
          </div>

          {/* Títulos por fase */}
          <div className="relative text-center mb-7" style={{ minHeight: '64px' }}>
            <div
              ref={title0Ref}
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ opacity: 1, transform: 'translateY(0)', transition: 'opacity 0.45s ease, transform 0.45s ease', willChange: 'opacity, transform' }}
            >
                <h2 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">{phases[0].title}</h2>
                <p className="mt-1.5 text-white/75 text-sm max-w-lg drop-shadow">{phases[0].subtitle}</p>
            </div>
            <div
              ref={title1Ref}
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ opacity: 0, transform: 'translateY(14px)', transition: 'opacity 0.45s ease, transform 0.45s ease', pointerEvents: 'none', willChange: 'opacity, transform' }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">{phases[1].title}</h2>
              <p className="mt-1.5 text-white/75 text-sm max-w-lg drop-shadow">{phases[1].subtitle}</p>
            </div>
          </div>

          {/* Contenido de fases */}
          <div className="relative" style={{ minHeight: '360px' }}>

            {/* Fase 0 — Stack Tecnológico */}
            <div
              ref={content0Ref}
              className="absolute inset-0"
              style={{ opacity: 1, transform: 'translateY(0)', transition: 'opacity 0.45s ease, transform 0.45s ease', willChange: 'opacity, transform' }}
            >
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map(({ category, items }) => {
                  const colors = CATEGORY_COLORS[category] ?? { badge: 'bg-slate-50 text-slate-600 border-slate-200', icon: 'bg-slate-100 text-slate-500' };
                  return (
                    <div key={category} className="bg-[var(--color-bg)] rounded-2xl p-5 border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 hover:shadow-[var(--shadow-md)] transition-shadow">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${colors.icon}`}>
                          {CATEGORY_EMOJI[category] ?? '🔧'}
                        </span>
                        <h3 className="font-semibold text-[var(--color-text)] text-xs uppercase tracking-wide flex-1">{category}</h3>
                        <span className="text-xs text-[var(--color-text-muted)] bg-[var(--color-card)] border border-[var(--color-border)] px-2 py-0.5 rounded-full">{items.length}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {items.map(skill => (
                          <span key={skill} className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors.badge}`}>{skill}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fase 1 — Habilidades Blandas */}
            <div
              ref={content1Ref}
              className="absolute inset-0"
              style={{ opacity: 0, transform: 'translateY(28px)', transition: 'opacity 0.45s ease, transform 0.45s ease', pointerEvents: 'none', willChange: 'opacity, transform' }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {softSkills.map(({ name, icon: Icon, level, desc, color }, i) => (
                  <div key={name} className="bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border)] p-4 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 transition-shadow">
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
                        ref={el => { barRefs.current[i] = el; }}
                        className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-blue-400"
                        style={{ width: '0%', transition: 'width 1s cubic-bezier(0.22, 1, 0.36, 1)' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pills */}
          <div className="flex justify-center gap-2 mt-5">
            <div ref={pill0Ref} className="h-1 rounded-full" style={{ width: '28px', background: 'var(--color-primary)', transition: 'width 0.3s ease, background 0.3s ease' }} />
            <div ref={pill1Ref} className="h-1 rounded-full" style={{ width: '8px', background: 'var(--color-border)', transition: 'width 0.3s ease, background 0.3s ease' }} />
          </div>

        </div>
      </div>
    </section>
  );
}

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
