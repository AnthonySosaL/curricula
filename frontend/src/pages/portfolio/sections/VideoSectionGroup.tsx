import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

interface Phase {
  label: string;
  title: string;
  subtitle: string;
  range: [number, number];
}

interface VideoSectionGroupProps {
  children: ReactNode;
  videoSrc: string;
  overlay?: string;
  phases?: Phase[];
}

function getEntryWindow(phase: Phase): [number, number] {
  const [start, end] = phase.range;
  const len = Math.max(end - start, 0.0001);
  const entryStart = Math.min(end - 0.08, start + Math.min(0.04, len * 0.1));
  const entryEnd = Math.min(end - 0.04, entryStart + Math.min(0.2, len * 0.45));
  return [entryStart, entryEnd];
}

function setFade(el: HTMLElement | null, visible: boolean, delay = 0) {
  if (!el) return;
  el.style.opacity = visible ? '1' : '0';
  el.style.transform = visible ? 'translateY(0)' : 'translateY(18px)';
  el.style.transition = `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`;
}

export function VideoSectionGroup({
  children,
  videoSrc,
  overlay = 'bg-black/50',
  phases = [],
}: VideoSectionGroupProps) {
  const groupRef   = useRef<HTMLDivElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);
  const groupTopRef        = useRef(0);
  const groupScrollableRef = useRef(0);

  // Phase 1 element refs
  const p1Label = useRef<HTMLSpanElement>(null);
  const p1Title = useRef<HTMLHeadingElement>(null);
  const p1Sub   = useRef<HTMLParagraphElement>(null);
  // Phase 2 element refs
  const p2Label = useRef<HTMLSpanElement>(null);
  const p2Title = useRef<HTMLHeadingElement>(null);
  const p2Sub   = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const cachePos = () => {
      const g = groupRef.current;
      if (!g) return;
      groupTopRef.current        = g.getBoundingClientRect().top + window.scrollY;
      groupScrollableRef.current = g.offsetHeight - window.innerHeight;
    };
    cachePos();
    window.addEventListener('resize', cachePos, { passive: true });

    const firstPhase  = phases[0];
    const secondPhase = phases[1];
    let rafId: number;
    let lastY = -1;

    const tick = () => {
      const y = window.scrollY;
      if (y !== lastY) {
        lastY = y;
        const scrollable = groupScrollableRef.current;
        const p = scrollable > 0
          ? Math.max(0, Math.min(1, (y - groupTopRef.current) / scrollable))
          : 0;

        // Scrub video — no setState, direct property
        const vid = videoRef.current;
        if (vid && vid.readyState >= 2 && vid.duration) {
          vid.currentTime = p * vid.duration;
        }

        // Phase text — direct DOM style, no React re-render
        if (firstPhase) {
          const [es, ee] = getEntryWindow(firstPhase);
          const vis = p >= es && p < ee;
          setFade(p1Label.current, vis, 0);
          setFade(p1Title.current, vis, 60);
          setFade(p1Sub.current,   vis, 120);
        }
        if (secondPhase) {
          const [es, ee] = getEntryWindow(secondPhase);
          const vis = p >= es && p < ee;
          setFade(p2Label.current, vis, 0);
          setFade(p2Title.current, vis, 60);
          setFade(p2Sub.current,   vis, 120);
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', cachePos);
    };
  }, [phases]);

  const firstPhase  = phases[0];
  const secondPhase = phases[1];

  return (
    <div ref={groupRef} className="relative">

      {/* Video sticky */}
      <div
        className="sticky top-0 overflow-hidden pointer-events-none"
        style={{ height: '100vh', marginBottom: '-100vh', zIndex: 0 }}
      >
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={(e) => { (e.target as HTMLVideoElement).currentTime = 0; }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className={`absolute inset-0 ${overlay}`} />
      </div>

      {/* Texto de fases — DOM puro, sin re-renders */}
      {phases.length > 0 && (
        <div
          className="sticky top-0 pointer-events-none"
          style={{ height: '100vh', marginBottom: '-100vh', zIndex: 2 }}
        >
          {firstPhase && (
            <div className="absolute inset-x-0 top-24 sm:top-28 flex flex-col items-center text-center px-6">
              <span
                ref={p1Label}
                className="text-xs uppercase tracking-[0.18em] text-blue-200 font-semibold mb-3 px-3 py-1 rounded-full border border-blue-200/35 bg-black/35 backdrop-blur-sm"
                style={{ opacity: 0, transform: 'translateY(18px)', willChange: 'opacity, transform' }}
              >
                {firstPhase.label}
              </span>
              <h3
                ref={p1Title}
                className="text-3xl sm:text-5xl font-bold text-white mb-2 leading-tight"
                style={{ opacity: 0, transform: 'translateY(18px)', textShadow: '0 6px 32px rgba(0,0,0,0.72)', willChange: 'opacity, transform' }}
              >
                {firstPhase.title}
              </h3>
              <p
                ref={p1Sub}
                className="text-sm sm:text-lg text-white/85 max-w-3xl"
                style={{ opacity: 0, transform: 'translateY(18px)', textShadow: '0 2px 18px rgba(0,0,0,0.75)', willChange: 'opacity, transform' }}
              >
                {firstPhase.subtitle}
              </p>
            </div>
          )}

          {secondPhase && (
            <div className="absolute inset-x-0 top-24 sm:top-28 flex flex-col items-center text-center px-6">
              <span
                ref={p2Label}
                className="text-xs uppercase tracking-[0.18em] text-amber-200 font-semibold mb-3 px-3 py-1 rounded-full border border-amber-200/35 bg-black/35 backdrop-blur-sm"
                style={{ opacity: 0, transform: 'translateY(18px)', willChange: 'opacity, transform' }}
              >
                {secondPhase.label}
              </span>
              <h3
                ref={p2Title}
                className="text-3xl sm:text-5xl font-bold text-white mb-2 leading-tight"
                style={{ opacity: 0, transform: 'translateY(18px)', textShadow: '0 6px 32px rgba(0,0,0,0.72)', willChange: 'opacity, transform' }}
              >
                {secondPhase.title}
              </h3>
              <p
                ref={p2Sub}
                className="text-sm sm:text-lg text-white/85 max-w-3xl"
                style={{ opacity: 0, transform: 'translateY(18px)', textShadow: '0 2px 18px rgba(0,0,0,0.75)', willChange: 'opacity, transform' }}
              >
                {secondPhase.subtitle}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Secciones hijas */}
      <div className="relative" style={{ zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
