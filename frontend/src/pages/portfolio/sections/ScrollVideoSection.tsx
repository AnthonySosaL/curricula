import { useEffect, useRef, useState } from 'react';
import { usePortfolioData } from '@/data/portfolio';
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons';
import { Mail, Download, ChevronDown } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

// phase thresholds
const HERO_END = 0.25;
const MAIN_END = 0.70;

const DESKTOP_HEIGHT = '250vh';
const MOBILE_HEIGHT = '230vh';
const MOBILE_LOW_END_HEIGHT = '260vh';
function applyFade(el: HTMLDivElement | null, visible: boolean) {
  if (!el) return;
  el.style.opacity      = visible ? '1' : '0';
  el.style.transform    = visible ? 'translateY(0)' : 'translateY(20px)';
  el.style.pointerEvents = visible ? 'auto' : 'none';
}

export function ScrollVideoSection() {
  const { profile } = usePortfolioData();
  const { language } = useI18n();
  const sectionRef  = useRef<HTMLDivElement>(null);
  const videoRef    = useRef<HTMLVideoElement>(null);
  const topRef      = useRef(0);
  const scrollableRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);

  // Phase panel refs
  const heroRef    = useRef<HTMLDivElement>(null);
  const mainRef    = useRef<HTMLDivElement>(null);
  const leavingRef = useRef<HTMLDivElement>(null);
  // Progress bar ref
  const barRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 900px), (pointer: coarse)');
    const onChange = () => setIsMobile(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const cpuCores = navigator.hardwareConcurrency ?? 4;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
    setIsLowEndDevice(cpuCores <= 4 || memory <= 4);
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

    // Set initial state — hero visible
    applyFade(heroRef.current, true);
    applyFade(mainRef.current, false);
    applyFade(leavingRef.current, false);

    const seekThrottle = isMobile ? (isLowEndDevice ? 150 : 110) : 55;
    const seekEpsilon = isMobile ? (isLowEndDevice ? 0.28 : 0.20) : 0.10;
    const smoothFactor = isMobile ? 1 : 0.24;
    const sensitivity = isMobile ? (isLowEndDevice ? 1.25 : 1.15) : 1;
    const playbackVelocityThreshold = isMobile ? 0.0013 : 0.0018;
    const maxPlaybackRate = isMobile ? (isLowEndDevice ? 1.6 : 1.95) : 2.2;

    let rafId = 0;
    let running = false;
    let lastPhase = -1; // -1=uninit, 0=hero, 1=main, 2=leaving
    let lastSeekTime = 0;
    let lastY = window.scrollY;
    let targetP = 0;
    let displayP = 0;
    let lastP = 0;
    let lastTime = performance.now();
    let playbackMode = false;
    let lastScrollAt = performance.now();

    const readTargetProgress = () => {
      const scrollable = scrollableRef.current;
      if (scrollable <= 0) return;
      const raw = (window.scrollY - topRef.current) / scrollable;
      targetP = Math.max(0, Math.min(1, raw * sensitivity));
    };

    const stopPlayback = () => {
      const vid = videoRef.current;
      if (!vid) return;
      if (!vid.paused) vid.pause();
      vid.playbackRate = 1;
      playbackMode = false;
    };

    const runFrame = () => {
      const now = performance.now();
      const y = window.scrollY;
      const dt = Math.max(1, now - lastTime);

      displayP += (targetP - displayP) * smoothFactor;
      if (Math.abs(targetP - displayP) < 0.001) displayP = targetP;

      const vid = videoRef.current;
      if (vid && vid.readyState >= 2 && vid.duration) {
        const dp = displayP - lastP;
        const dy = y - lastY;
        const velocity = Math.abs(dp) / dt;

        if (isMobile) {
          // En mobile el video queda fijo para eliminar lag de decode/seek.
          if (playbackMode || !vid.paused || vid.playbackRate !== 1) {
            stopPlayback();
          }
        } else {
          const targetTime = 1 + displayP * (vid.duration - 1);
          const deltaTime = targetTime - vid.currentTime;
          const canSeek = now - lastSeekTime >= seekThrottle;

          // Desktop mantiene seek sincronizado.
          if (dy > 0 && velocity > playbackVelocityThreshold) {
            const nextRate = Math.min(maxPlaybackRate, Math.max(0.85, velocity * 1300));
            vid.playbackRate = nextRate;
            if (vid.paused) {
              void vid.play().catch(() => {
                playbackMode = false;
              });
            }
            playbackMode = true;
          } else {
            if (playbackMode) stopPlayback();
            if (canSeek && Math.abs(deltaTime) > seekEpsilon) {
              vid.currentTime = targetTime;
              lastSeekTime = now;
            }
          }
        }
      }

      // Progress bar — always update (cheap, no layout)
      if (barRef.current) barRef.current.style.width = `${displayP * 100}%`;

      // Phase transitions — only update DOM on change
      const phase = displayP < HERO_END ? 0 : displayP < MAIN_END ? 1 : 2;
      if (phase !== lastPhase) {
        lastPhase = phase;
        applyFade(heroRef.current,    phase === 0);
        applyFade(mainRef.current,    phase === 1);
        applyFade(leavingRef.current, phase === 2);
      }

      lastP = displayP;
      lastY = y;
      lastTime = now;

      const recentlyScrolled = now - lastScrollAt < 180;
      const needsSmoothing = Math.abs(targetP - displayP) > 0.001;
      const shouldKeepRunning = recentlyScrolled || needsSmoothing;

      if (shouldKeepRunning) {
        rafId = requestAnimationFrame(runFrame);
      } else {
        running = false;
        stopPlayback();
      }
    };

    const startLoop = () => {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(runFrame);
    };

    const onScroll = () => {
      lastScrollAt = performance.now();
      readTargetProgress();
      startLoop();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    readTargetProgress();
    displayP = targetP;
    startLoop();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', cachePos);

      stopPlayback();
    };
  }, [isMobile, isLowEndDevice]);

  const sectionHeight = isMobile
    ? (isLowEndDevice ? MOBILE_LOW_END_HEIGHT : MOBILE_HEIGHT)
    : DESKTOP_HEIGHT;
  const videoSrc = isMobile ? '/scroll-video-web-720.mp4' : '/scroll-video-web.mp4';

  return (
    <section
      ref={sectionRef}
      id="inicio"
      style={{ height: sectionHeight, touchAction: 'pan-y' }}
      className="relative"
    >
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Video */}
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          preload={isMobile ? 'metadata' : 'auto'}
          onLoadedMetadata={(e) => {
            const v = e.target as HTMLVideoElement;
            if (isMobile) {
              const previewTime = Math.max(0, Math.min(3, v.duration - 0.05));
              v.currentTime = Number.isFinite(previewTime) ? previewTime : 0;
            } else {
              v.currentTime = 1;
            }
            if (isMobile) v.pause();
          }}
          onSeeked={(e) => {
            if (!isMobile) return;
            const v = e.target as HTMLVideoElement;
            v.pause();
          }}
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
            {profile.location} · {language === 'en' ? 'Available for projects' : 'Disponible para proyectos'}
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
              {language === 'en' ? 'Contact me' : 'Contactame'}
            </a>
            <a
              href={profile.links.cv}
              download
              className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-xl font-medium text-sm hover:bg-white/20 transition-all hover:-translate-y-0.5"
            >
              <Download size={16} />
              {language === 'en' ? 'Download CV' : 'Descargar CV'}
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
            <span className="text-xs uppercase tracking-widest">{language === 'en' ? 'Scroll' : 'Scroll'}</span>
          </a>
        </div>

        {/* FASE MAIN — datos + bio */}
        <div
          ref={mainRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease', pointerEvents: 'none', willChange: 'opacity, transform' }}
        >
          <span className="text-xs uppercase tracking-widest text-orange-300 font-semibold mb-4 px-3 py-1 rounded-full border border-orange-300/40 bg-black/20">
            {profile.title}
          </span>

          <h2
            className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5 drop-shadow-xl"
            style={{ textShadow: '0 4px 30px rgba(0,0,0,0.6)' }}
          >
            {language === 'en' ? 'I turn ideas' : 'Transformo ideas'}<br />{language === 'en' ? 'into real solutions' : 'en soluciones reales'}
          </h2>

          <p className="text-base sm:text-lg text-white/80 max-w-xl leading-relaxed mb-8">
            {language === 'en'
              ? 'I build impactful systems for government and private companies, from frontend to infrastructure.'
              : 'Desarrollo sistemas de impacto en entornos gubernamentales y empresas privadas, desde el frontend hasta la infraestructura.'}
          </p>

          <div className="flex items-center gap-10">
            {[
              { value: '3+', label: language === 'en' ? 'years exp.' : 'anos exp.' },
              { value: '4', label: language === 'en' ? 'companies' : 'empresas' },
              { value: '30+', label: language === 'en' ? 'technologies' : 'tecnologias' },
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
          <p className="text-white/50 text-sm uppercase tracking-[0.25em]">{language === 'en' ? 'Exploring skills' : 'Explorando habilidades'}</p>
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
