import { useEffect, useRef } from 'react';
import { profile } from '@/data/portfolio';
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons';
import { Mail, Download, ChevronDown } from 'lucide-react';

// phase thresholds
const HERO_END = 0.20;
const MAIN_END = 0.78;

function applyFade(el: HTMLDivElement | null, visible: boolean) {
  if (!el) return;
  el.style.opacity      = visible ? '1' : '0';
  el.style.transform    = visible ? 'translateY(0)' : 'translateY(20px)';
  el.style.pointerEvents = visible ? 'auto' : 'none';
}

export function ScrollVideoSection() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const videoRef    = useRef<HTMLVideoElement>(null);
  const topRef      = useRef(0);
  const scrollableRef = useRef(0);

  // Phase panel refs
  const heroRef    = useRef<HTMLDivElement>(null);
  const mainRef    = useRef<HTMLDivElement>(null);
  const leavingRef = useRef<HTMLDivElement>(null);
  // Progress bar ref
  const barRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cachePos = () => {
      const el = sectionRef.current;
      if (!el) return;
      topRef.current        = el.getBoundingClientRect().top + window.scrollY;
      scrollableRef.current = el.offsetHeight - window.innerHeight;
    };
    cachePos();
    window.addEventListener('resize', cachePos, { passive: true });

    // Set initial state — hero visible
    applyFade(heroRef.current, true);
    applyFade(mainRef.current, false);
    applyFade(leavingRef.current, false);

    let rafId: number;
    let lastPhase = -1; // -1=uninit, 0=hero, 1=main, 2=leaving

    const tick = () => {
      const scrollable = scrollableRef.current;
      if (scrollable > 0) {
        const y = window.scrollY;
        const p = Math.max(0, Math.min(1, (y - topRef.current) / scrollable));

        // Scrub video
        const vid = videoRef.current;
        if (vid && vid.readyState >= 2 && vid.duration) {
          vid.currentTime = 1 + p * (vid.duration - 1);
        }

        // Progress bar — always update (cheap, no layout)
        if (barRef.current) barRef.current.style.width = `${p * 100}%`;

        // Phase transitions — only update DOM on change
        const phase = p < HERO_END ? 0 : p < MAIN_END ? 1 : 2;
        if (phase !== lastPhase) {
          lastPhase = phase;
          applyFade(heroRef.current,    phase === 0);
          applyFade(mainRef.current,    phase === 1);
          applyFade(leavingRef.current, phase === 2);
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', cachePos);
    };
  }, []);

  return (
    <section ref={sectionRef} id="inicio" style={{ height: '500vh' }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Video */}
        <video
          ref={videoRef}
          src="/scroll-video-web.mp4"
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={(e) => { (e.target as HTMLVideoElement).currentTime = 1; }}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/55" />

        {/* FASE HERO — nombre, foto, CTAs */}
        <div
          ref={heroRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          style={{ opacity: 1, transform: 'translateY(0)', transition: 'opacity 0.6s ease, transform 0.6s ease', willChange: 'opacity, transform' }}
        >
          {/* Avatar */}
          <div className="mb-6">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-2xl ring-4 ring-white/20"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center border-4 border-white shadow-2xl">
                <span className="text-3xl font-bold text-white">
                  {profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </span>
              </div>
            )}
          </div>

          {/* Badge */}
          <p className="inline-flex items-center gap-2 text-blue-300 font-semibold text-xs uppercase tracking-widest mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inset-0 rounded-full bg-green-400 opacity-75" />
              <span className="relative rounded-full h-2 w-2 bg-green-400" />
            </span>
            {profile.location} · Disponible para proyectos
          </p>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-3 leading-tight drop-shadow-xl">
            {profile.name}
          </h1>
          <p className="text-xl text-white/85 mb-1">{profile.title}</p>
          <p className="text-sm text-white/55 mb-8 tracking-wide">{profile.subtitle}</p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
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

          {/* Social */}
          <div className="flex items-center gap-3 mb-10">
            <a href={profile.links.github} target="_blank" rel="noreferrer"
              className="p-2.5 rounded-lg border border-white/20 text-white/70 hover:text-white hover:border-white/50 transition-all bg-white/10 backdrop-blur-sm">
              <GithubIcon size={18} />
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer"
              className="p-2.5 rounded-lg border border-white/20 text-white/70 hover:text-white hover:border-white/50 transition-all bg-white/10 backdrop-blur-sm">
              <LinkedinIcon size={18} />
            </a>
          </div>

          {/* Scroll hint */}
          <a href="#habilidades" className="flex flex-col items-center gap-1 text-white/45 hover:text-white/80 transition-colors animate-bounce">
            <ChevronDown size={20} />
            <span className="text-xs uppercase tracking-widest">Scroll</span>
          </a>
        </div>

        {/* FASE MAIN — datos + bio */}
        <div
          ref={mainRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease', pointerEvents: 'none', willChange: 'opacity, transform' }}
        >
          <span className="text-xs uppercase tracking-widest text-orange-300 font-semibold mb-4 px-3 py-1 rounded-full border border-orange-300/40 bg-black/20">
            Full Stack Developer
          </span>

          <h2
            className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5 drop-shadow-xl"
            style={{ textShadow: '0 4px 30px rgba(0,0,0,0.6)' }}
          >
            Transformo ideas<br />en soluciones reales
          </h2>

          <p className="text-base sm:text-lg text-white/80 max-w-xl leading-relaxed mb-8">
            Desarrollo sistemas de impacto en entornos gubernamentales y empresas privadas,
            desde el frontend hasta la infraestructura.
          </p>

          <div className="flex items-center gap-10">
            {[
              { value: '3+', label: 'años exp.' },
              { value: '4', label: 'empresas' },
              { value: '30+', label: 'tecnologías' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-bold text-white drop-shadow">{value}</p>
                <p className="text-xs text-white/55 uppercase tracking-wide mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FASE SALIDA */}
        <div
          ref={leavingRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center"
          style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease', pointerEvents: 'none', willChange: 'opacity, transform' }}
        >
          <p className="text-white/50 text-sm uppercase tracking-[0.25em]">Explorando habilidades</p>
          <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent mx-auto mt-3" />
        </div>

        {/* Barra de progreso */}
        <div className="absolute bottom-0 left-0 h-0.5 bg-white/10 w-full">
          <div ref={barRef} className="h-full bg-orange-400" style={{ width: '0%' }} />
        </div>
      </div>
    </section>
  );
}
