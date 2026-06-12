import { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUp } from 'lucide-react';
import { usePortfolioData } from '@/data/portfolio';
import { ScrollVideoSection } from './sections/ScrollVideoSection';
import { VideoSectionGroup } from './sections/VideoSectionGroup';
import { SkillsSection } from './sections/SkillsSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { EducationSection } from './sections/EducationSection';
import { ContactSection } from './sections/ContactSection';
import { CertificatesSection } from './sections/CertificatesSection';
import { ChatWidget } from './sections/ChatWidget';
import { BootLoadingScreen } from './sections/BootLoadingScreen';
import { AuthModal } from '@/components/shared/AuthModal';
import { GlobalControls } from '@/components/shared/GlobalControls';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';
import { recordMetric } from '@/lib/analytics';
import { useUiPreferences } from '@/contexts/ui-preferences';

const DESKTOP_BOOT_VIDEOS = [
  '/scroll-video-web.mp4',
  '/scroll-video2-web.mp4',
  '/scroll-video3-web.mp4',
];

const MOBILE_BOOT_VIDEOS = [
  '/scroll-video-web-720.mp4',
  '/scroll-video2-web-720.mp4',
  '/scroll-video3-web-720.mp4',
];

const ROBOT_MODEL_URL = '/models/RobotExpressive.glb';

// Chorros de pintura bajo la navbar: anchos/largos variados = borde derretido organico
const PAINT_DRIPS = [
  { left: '4%',  w: 7,  h: 22, dur: 6.5, delay: 0 },
  { left: '12%', w: 10, h: 30, dur: 7.5, delay: 0.8 },
  { left: '23%', w: 6,  h: 16, dur: 5.6, delay: 1.6 },
  { left: '34%', w: 12, h: 34, dur: 8.2, delay: 0.4 },
  { left: '47%', w: 7,  h: 20, dur: 6.0, delay: 2.1 },
  { left: '58%', w: 9,  h: 26, dur: 7.0, delay: 1.2 },
  { left: '69%', w: 6,  h: 15, dur: 5.2, delay: 2.8 },
  { left: '80%', w: 11, h: 32, dur: 8.8, delay: 0.2 },
  { left: '91%', w: 8,  h: 24, dur: 6.8, delay: 1.9 },
];

const NAV_LINKS = [
  { href: '#inicio',        label: 'Inicio',         id: 'inicio' },
  { href: '#habilidades',   label: 'Habilidades',    id: 'habilidades' },
  { href: '#experiencia',   label: 'Experiencia',    id: 'experiencia' },
  { href: '#proyectos',     label: 'Proyectos',      id: 'proyectos' },
  { href: '#certificados',  label: 'Certificados',   id: 'certificados' },
  { href: '#educacion',     label: 'Educación',      id: 'educacion' },
  { href: '#contacto',      label: 'Contacto',       id: 'contacto' },
];

function useActiveSection() {
  const [active, setActive] = useState('inicio');
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: '-40% 0px -55% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);
  return active;
}

function Navbar({ onDashboardLoginClick, entered }: { onDashboardLoginClick: () => void; entered: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection();
  const { t, language } = useI18n();
  const { theme } = useUiPreferences();
  const { profile } = usePortfolioData();
  const isDark = theme === 'dark';

  const navLinks = [
    { href: '#inicio', label: t('nav.home'), id: 'inicio' },
    { href: '#habilidades', label: t('nav.skills'), id: 'habilidades' },
    { href: '#experiencia', label: t('nav.experience'), id: 'experiencia' },
    { href: '#proyectos', label: t('nav.projects'), id: 'proyectos' },
    { href: '#certificados', label: t('nav.certificates'), id: 'certificados' },
    { href: '#educacion', label: t('nav.education'), id: 'educacion' },
    { href: '#contacto', label: t('nav.contact'), id: 'contacto' },
  ];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50',
        isDark
          ? 'bg-[#1a0808]/85 backdrop-blur-md border-b border-red-900/60'
          : 'bg-[#fff8f6]/90 backdrop-blur-md border-b border-red-200/80',
        scrolled ? 'shadow-[var(--shadow-md)]' : 'shadow-[var(--shadow-sm)]',
      )}
      style={{
        // Entrada lenta desde arriba cuando termina el boot loader
        transform: entered ? 'translateY(0)' : 'translateY(-110%)',
        transition: 'transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.25s, background-color 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      {/* Borde fundido: gradiente fluyendo + pintura derritiendose + gotitas que caen */}
      <div className="nav-flow-border" aria-hidden="true" />
      {PAINT_DRIPS.map((d) => (
        <span
          key={d.left}
          className="nav-paint-drip"
          style={{
            left: d.left,
            width: `${d.w}px`,
            height: `${d.h}px`,
            animationDuration: `${d.dur}s`,
            animationDelay: `${d.delay}s`,
          }}
          aria-hidden="true"
        />
      ))}
      {/* Gotitas desprendiendose de los chorros mas largos */}
      <span className="nav-drip" style={{ left: 'calc(34% + 4px)', top: 'calc(100% + 26px)', animationDelay: '0.9s' }} aria-hidden="true" />
      <span className="nav-drip" style={{ left: 'calc(80% + 3px)', top: 'calc(100% + 24px)', animationDelay: '2.2s', animationDuration: '4.1s' }} aria-hidden="true" />
      <span className="nav-drip" style={{ left: 'calc(12% + 3px)', top: 'calc(100% + 22px)', animationDelay: '3.1s', animationDuration: '3.8s' }} aria-hidden="true" />
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <span className="font-bold text-lg tracking-tight text-[var(--color-primary)]">
          {profile.name.split(' ')[0]}
          <span className="font-normal text-[var(--color-text-muted)]">.</span>
        </span>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-0.5 xl:gap-1">
          {navLinks.map(({ href, label, id }) => (
            <li key={href}>
              <a
                href={href}
                className={cn(
                  'relative px-2.5 xl:px-3 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-colors whitespace-nowrap',
                  active === id
                    ? (isDark ? 'text-red-300 bg-slate-800/90' : 'text-[var(--color-primary)] bg-red-50')
                    : (isDark
                      ? 'text-slate-300 hover:text-red-300 hover:bg-slate-800/75'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-red-50'),
                )}
              >
                {label}
                {active === id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--color-primary)]" />
                )}
              </a>
            </li>
          ))}
          <li className="ml-2">
            <button
              onClick={onDashboardLoginClick}
              className="px-3 xl:px-4 py-1.5 rounded-lg text-xs xl:text-sm bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors whitespace-nowrap"
            >
              {t('brand.dashboardLogin')}
            </button>
          </li>
          <li className="ml-2">
            <GlobalControls />
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className={cn(
            'lg:hidden p-2 rounded-lg transition-colors',
            isDark ? 'text-slate-200 hover:bg-slate-800/80' : 'hover:bg-slate-100',
          )}
          onClick={() => setOpen(!open)}
          aria-label={language === 'en' ? 'Menu' : 'Menu'}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          className={cn(
            'lg:hidden px-4 pb-4 border-b',
            isDark ? 'bg-[#1a0808]/95 border-red-900/60' : 'bg-[var(--color-card)] border-[var(--color-border)]',
          )}
        >
          <ul className="space-y-1">
            {navLinks.map(({ href, label, id }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    active === id
                      ? (isDark ? 'text-red-300 bg-slate-800/90' : 'text-[var(--color-primary)] bg-red-50')
                      : (isDark
                        ? 'text-slate-300 hover:text-red-300 hover:bg-slate-800/75'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-red-50'),
                  )}
                >
                  {label}
                </a>
              </li>
            ))}
            <li>
              <button
                onClick={() => { setOpen(false); onDashboardLoginClick(); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-primary)] hover:bg-red-50 transition-colors"
              >
                {t('brand.dashboardLogin')}
              </button>
            </li>
            <li className="pt-2">
              <GlobalControls />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

function SideScrollProgress() {
  const fillRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fn = () => {
      const total = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(100, Math.round((window.scrollY / total) * 100)));
      if (fillRef.current) fillRef.current.style.height = `${progress}%`;
      if (pctRef.current) pctRef.current.textContent = `${progress}%`;
    };

    window.addEventListener('scroll', fn, { passive: true });
    window.addEventListener('resize', fn, { passive: true });
    fn();

    return () => {
      window.removeEventListener('scroll', fn);
      window.removeEventListener('resize', fn);
    };
  }, []);

  return (
    <div className="fixed right-2 sm:right-3 top-1/2 -translate-y-1/2 z-[70] pointer-events-none">
      <div className="flex flex-col items-center gap-2">
        <div className="h-36 sm:h-48 w-1 rounded-full bg-black/20 backdrop-blur-sm overflow-hidden border border-white/25">
          <div
            ref={fillRef}
            className="w-full bg-gradient-to-t from-red-600 to-amber-300 transition-[height] duration-150"
            style={{ height: '0%' }}
          />
        </div>
        <span ref={pctRef} className="text-[10px] font-semibold text-white/80 bg-black/40 px-1.5 py-0.5 rounded-md">0%</span>
      </div>
    </div>
  );
}

function usePortfolioBootLoader() {
  const [progress, setProgress] = useState(4);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.body.style.overflow = ready ? '' : 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [ready]);

  useEffect(() => {
    const MIN_LOADING_MS = 2800;
    const isMobile = window.matchMedia('(max-width: 900px), (pointer: coarse)').matches;
    const sources = isMobile ? MOBILE_BOOT_VIDEOS : DESKTOP_BOOT_VIDEOS;

    let cancelled = false;
    let loaded = 0;
    let target = 8;
    let display = 4;
    let raf = 0;
    const startAt = performance.now();

    const canFinish = () => performance.now() - startAt >= MIN_LOADING_MS;

    const sync = () => {
      if (cancelled) return;
      const effectiveTarget = canFinish() ? target : Math.min(target, 94);
      display += (effectiveTarget - display) * 0.18;
      if (Math.abs(effectiveTarget - display) < 0.2) display = effectiveTarget;
      setProgress(Math.min(100, Math.round(display)));

      if (display >= 100 && canFinish()) {
        // 600ms da tiempo al fade-out del boot loader antes de desmontarlo
        window.setTimeout(() => {
          if (!cancelled) setReady(true);
        }, 600);
        return;
      }

      raf = requestAnimationFrame(sync);
    };

    const totalResources = sources.length + 1; // videos + modelo 3D del robot

    const markDone = () => {
      loaded += 1;
      target = Math.round((loaded / totalResources) * 100);
      if (loaded >= totalResources) target = 100;
    };

    // Precarga el GLB del robot para que el avatar 3D aparezca al instante
    fetch(ROBOT_MODEL_URL)
      .then((r) => (r.ok ? r.arrayBuffer() : null))
      .catch(() => null)
      .then(() => { if (!cancelled) markDone(); });

    const videos: HTMLVideoElement[] = [];
    sources.forEach((src) => {
      const v = document.createElement('video');
      let completed = false;
      const done = () => {
        if (completed) return;
        completed = true;
        markDone();
      };

      v.preload = 'auto';
      v.muted = true;
      v.playsInline = true;
      v.src = src;
      v.addEventListener('loadeddata', done, { once: true });
      v.addEventListener('canplaythrough', done, { once: true });
      v.addEventListener('error', done, { once: true });
      v.load();
      videos.push(v);
    });

    const fallback = window.setTimeout(() => {
      target = 100;
    }, 9000);

    raf = requestAnimationFrame(sync);

    return () => {
      cancelled = true;
      clearTimeout(fallback);
      if (raf) cancelAnimationFrame(raf);
      videos.forEach((v) => {
        v.src = '';
      });
    };
  }, []);

  return { ready, progress };
}

function BackToTop() {
  const { t } = useI18n();
  const btnRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    let last = false;
    const fn = () => {
      const show = window.scrollY > 600;
      if (show !== last) {
        last = show;
        if (btnRef.current) {
          btnRef.current.style.opacity      = show ? '1' : '0';
          btnRef.current.style.transform    = show ? 'scale(1)' : 'scale(0.75)';
          btnRef.current.style.pointerEvents = show ? 'auto' : 'none';
        }
      }
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <button
      ref={btnRef}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-[var(--shadow-lg)] hover:bg-[var(--color-primary-dark)] hover:-translate-y-1 transition-all duration-300"
      style={{ opacity: 0, transform: 'scale(0.75)', pointerEvents: 'none' }}
      aria-label={t('portfolio.backToTop')}
    >
      <ArrowUp size={18} />
    </button>
  );
}

function Footer() {
  const { t } = useI18n();
  const { profile } = usePortfolioData();

  return (
    <footer className="bg-[var(--color-card)] border-t border-[var(--color-border)] py-10 px-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-bold text-lg text-[var(--color-text)]">{profile.name}</p>
          <p className="text-[var(--color-text-secondary)] text-sm">{profile.title}</p>
        </div>
        <div className="text-center sm:text-right">
          <p className="text-[var(--color-text-secondary)] text-sm">
            © {new Date().getFullYear()} · {t('portfolio.footerBuilt')}
          </p>
          <p className="text-[var(--color-text-muted)] text-xs mt-1">{profile.email}</p>
        </div>
      </div>
    </footer>
  );
}

export default function PortfolioPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const { ready: bootReady, progress: bootProgress } = usePortfolioBootLoader();
  const { theme } = useUiPreferences();

  const videoSectionOverlay = theme === 'dark'
    ? 'bg-black/55 backdrop-blur-md'
    : 'bg-white/30 backdrop-blur-md';

  useEffect(() => {
    recordMetric('PORTFOLIO_VISIT');
  }, []);

  const handleDashboardLoginClick = () => {
    recordMetric('AUTH_ENTRY_OPEN');
    setAuthOpen(true);
  };

  return (
    <div className="bg-[var(--color-bg)] min-h-screen">
      {!bootReady && <BootLoadingScreen progress={bootProgress} />}
      <Navbar onDashboardLoginClick={handleDashboardLoginClick} entered={bootReady} />
      <ScrollVideoSection started={bootReady} />
      <VideoSectionGroup
        videoSrc="/scroll-video2-web.mp4"
        mobileVideoSrc="/scroll-video2-web-720.mp4"
        overlay="bg-black/30"
      >
        <SkillsSection className={videoSectionOverlay} />
      </VideoSectionGroup>
      <VideoSectionGroup
        videoSrc="/scroll-video3-web.mp4"
        mobileVideoSrc="/scroll-video3-web-720.mp4"
        overlay="bg-black/30"
      >
        <ExperienceSection className={videoSectionOverlay} />
      </VideoSectionGroup>
      <VideoSectionGroup
        videoSrc="/scroll-video4-web.mp4"
        mobileVideoSrc="/scroll-video4-web-720.mp4"
        overlay="bg-black/30"
      >
        <ProjectsSection className={videoSectionOverlay} />
        <CertificatesSection className={videoSectionOverlay} />
      </VideoSectionGroup>
      <VideoSectionGroup
        videoSrc="/scroll-video5-web.mp4"
        mobileVideoSrc="/scroll-video5-web-720.mp4"
        overlay="bg-black/30"
      >
        <EducationSection className={videoSectionOverlay} />
        <ContactSection className={videoSectionOverlay} />
      </VideoSectionGroup>
      <div className="relative z-10">
        <Footer />
      </div>
      <BackToTop />
      <SideScrollProgress />
      <ChatWidget />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
