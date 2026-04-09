import { useState, useEffect } from 'react';
import { Menu, X, ArrowUp } from 'lucide-react';
import { profile } from '@/data/portfolio';
import { ScrollVideoSection } from './sections/ScrollVideoSection';
import { VideoSectionGroup } from './sections/VideoSectionGroup';
import { SkillsSection } from './sections/SkillsSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { EducationSection } from './sections/EducationSection';
import { ContactSection } from './sections/ContactSection';
import { CertificatesSection } from './sections/CertificatesSection';
import { ChatWidget } from './sections/ChatWidget';
import { AuthModal } from '@/components/shared/AuthModal';
import { cn } from '@/lib/utils';

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

function Navbar({ onAdminClick }: { onAdminClick: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        'bg-white/90 backdrop-blur-md border-b border-[var(--color-border)]',
        scrolled ? 'shadow-[var(--shadow-md)]' : 'shadow-[var(--shadow-sm)]',
      )}
    >
      <nav className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <span className="font-bold text-lg tracking-tight text-[var(--color-primary)]">
          {profile.name.split(' ')[0]}
          <span className="font-normal text-[var(--color-text-muted)]">.</span>
        </span>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, id }) => (
            <li key={href}>
              <a
                href={href}
                className={cn(
                  'relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  active === id
                    ? 'text-[var(--color-primary)] bg-blue-50'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-blue-50',
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
              onClick={onAdminClick}
              className="px-4 py-1.5 rounded-lg text-sm bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              Admin
            </button>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-b border-[var(--color-border)] px-4 pb-4">
          <ul className="space-y-1">
            {NAV_LINKS.map(({ href, label, id }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    active === id
                      ? 'text-[var(--color-primary)] bg-blue-50'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-blue-50',
                  )}
                >
                  {label}
                </a>
              </li>
            ))}
            <li>
              <button
                onClick={() => { setOpen(false); onAdminClick(); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-primary)] hover:bg-blue-50 transition-colors"
              >
                Admin
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const fn = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-[var(--color-primary)] to-blue-400"
        style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
      />
    </div>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn(
        'fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-[var(--shadow-lg)] hover:bg-[var(--color-primary-dark)] hover:-translate-y-1 transition-all duration-300',
        show ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none',
      )}
      aria-label="Volver al inicio"
    >
      <ArrowUp size={18} />
    </button>
  );
}

function Footer() {
  return (
    <footer className="bg-[var(--color-text)] text-white py-10 px-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-bold text-lg">{profile.name}</p>
          <p className="text-slate-400 text-sm">{profile.title}</p>
        </div>
        <div className="text-center sm:text-right">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} · Hecho con React + NestJS + Neon
          </p>
          <p className="text-slate-500 text-xs mt-1">{profile.email}</p>
        </div>
      </div>
    </footer>
  );
}

export default function PortfolioPage() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="bg-[var(--color-bg)] min-h-screen">
      <Navbar onAdminClick={() => setAuthOpen(true)} />
      <ScrollVideoSection />
      <VideoSectionGroup videoSrc="/scroll-video2-web.mp4" overlay="bg-black/30">
        <SkillsSection className="bg-white/30 backdrop-blur-md" />
      </VideoSectionGroup>
      <VideoSectionGroup videoSrc="/scroll-video3-web.mp4" overlay="bg-black/30">
        <ExperienceSection className="bg-white/30 backdrop-blur-md" />
      </VideoSectionGroup>
      <div className="relative z-10 bg-[var(--color-bg)]">
        <ProjectsSection />
        <CertificatesSection />
        <EducationSection />
        <ContactSection />
        <Footer />
      </div>
      <BackToTop />
      <ScrollProgress />
      <ChatWidget />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
