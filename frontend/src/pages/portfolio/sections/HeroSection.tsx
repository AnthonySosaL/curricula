import { useEffect, useState } from 'react';
import { Mail, Download, ChevronDown } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons';
import { profile } from '@/data/portfolio';
import { useCounter } from '@/hooks/useCounter';

// Stat item with animated counter
function StatCard({ numericValue, suffix, label, delay, started }: {
  numericValue: number; suffix: string; label: string; delay: number; started: boolean;
}) {
  const count = useCounter(numericValue, 1400, started);
  return (
    <div
      className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-4 text-center hover:bg-white/20 hover:-translate-y-0.5 transition-all"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <p className="text-2xl font-bold text-white tabular-nums">
        {started ? count : 0}{suffix}
      </p>
      <p className="text-xs text-white/60 mt-0.5 leading-snug">{label}</p>
    </div>
  );
}

const STATS = [
  { numericValue: 3,  suffix: '+',  label: 'Años de experiencia' },
  { numericValue: 4,  suffix: '',   label: 'Empresas' },
  { numericValue: 30, suffix: '+',  label: 'Tecnologías' },
  { numericValue: 8,  suffix: 'vo', label: 'Semestre PUCE' },
];

export function HeroSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const cls = (delay: string) =>
    `transition-all duration-700 ${delay} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`;

  return (
    <section
      id="inicio"
      className="min-h-screen flex flex-col items-center justify-center relative px-4 py-20 overflow-hidden"
    >
      {/* Avatar */}
      <div className={`mb-8 ${cls('delay-[0ms]')}`}>
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-2xl ring-4 ring-white/20"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center shadow-2xl border-4 border-white ring-4 ring-white/20">
            <span className="text-4xl font-bold text-white">
              {profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </span>
          </div>
        )}
      </div>

      <div className="text-center max-w-2xl">
        {/* Badge disponible */}
        <p className={`inline-flex items-center gap-2 text-blue-300 font-semibold text-sm uppercase tracking-widest mb-3 ${cls('delay-[80ms]')}`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          {profile.location} · Disponible para proyectos
        </p>

        {/* Nombre */}
        <h1 className={`text-5xl sm:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-xl ${cls('delay-[160ms]')}`}>
          {profile.name}
          <span className="cursor-blink" />
        </h1>

        {/* Título */}
        <p className={`text-xl sm:text-2xl font-medium text-white/90 mb-1 ${cls('delay-[200ms]')}`}>
          {profile.title}
        </p>
        <p className={`text-sm text-white/60 mb-6 tracking-wide ${cls('delay-[220ms]')}`}>
          {profile.subtitle}
        </p>

        {/* Bio */}
        <p className={`text-white/80 leading-relaxed text-base sm:text-lg mb-10 ${cls('delay-[260ms]')}`}>
          Estudiante de Ingeniería de Sistemas con experiencia real en desarrollo Full Stack,
          análisis de datos e inteligencia artificial. He trabajado en entornos gubernamentales
          y empresas privadas, liderando proyectos de impacto en producción.
        </p>

        {/* CTAs */}
        <div className={`flex flex-wrap items-center justify-center gap-3 mb-8 ${cls('delay-[320ms]')}`}>
          <a
            href="#contacto"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-500 transition-all hover:-translate-y-0.5 shadow-lg"
          >
            <Mail size={16} />
            Contáctame
          </a>
          <a
            href={profile.links.cv}
            download
            className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-xl font-medium text-sm hover:bg-white/20 transition-all hover:-translate-y-0.5"
          >
            <Download size={16} />
            Descargar CV
          </a>
        </div>

        {/* Redes sociales */}
        <div className={`flex items-center justify-center gap-4 mb-12 ${cls('delay-[360ms]')}`}>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-lg border border-white/20 text-white/70 hover:text-white hover:border-white/60 hover:-translate-y-0.5 transition-all bg-white/10 backdrop-blur-sm"
            aria-label="GitHub"
          >
            <GithubIcon size={20} />
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-lg border border-white/20 text-white/70 hover:text-white hover:border-white/60 hover:-translate-y-0.5 transition-all bg-white/10 backdrop-blur-sm"
            aria-label="LinkedIn"
          >
            <LinkedinIcon size={20} />
          </a>
        </div>

        {/* Stats con contador animado */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto ${cls('delay-[420ms]')}`}>
          {STATS.map(({ numericValue, suffix, label }, i) => (
            <StatCard
              key={label}
              numericValue={numericValue}
              suffix={suffix}
              label={label}
              delay={i * 80}
              started={visible}
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#habilidades"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50 hover:text-white transition-colors animate-bounce"
      >
        <span className="text-xs">Scroll</span>
        <ChevronDown size={18} />
      </a>
    </section>
  );
}
