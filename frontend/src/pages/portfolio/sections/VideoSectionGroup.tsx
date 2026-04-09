import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
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

export function VideoSectionGroup({
  children,
  videoSrc,
  overlay = 'bg-black/50',
  phases = [],
}: VideoSectionGroupProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId: number;
    let lastY = -1;

    const tick = () => {
      const group = groupRef.current;
      const video = videoRef.current;
      if (group && video) {
        const y = window.scrollY;
        if (y !== lastY) {
          lastY = y;
          const start = group.getBoundingClientRect().top + window.scrollY;
          const scrollable = group.offsetHeight - window.innerHeight;
          const p =
            scrollable > 0
              ? Math.max(0, Math.min(1, (y - start) / scrollable))
              : 0;
          setProgress(p);
          if (video.readyState >= 2 && video.duration) {
            video.currentTime = p * video.duration;
          }
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const firstPhase = phases[0];
  const secondPhase = phases[1];

  const getEntryWindow = (phase: Phase): [number, number] => {
    const [start, end] = phase.range;
    const len = Math.max(end - start, 0.0001);
    const entryStart = Math.min(end - 0.08, start + Math.min(0.04, len * 0.1));
    const entryEnd = Math.min(end - 0.04, entryStart + Math.min(0.2, len * 0.45));
    return [entryStart, entryEnd];
  };

  const isWithinWindow = (value: number, phase: Phase) => {
    const [entryStart, entryEnd] = getEntryWindow(phase);
    return value >= entryStart && value < entryEnd;
  };

  const isFirstPhase = firstPhase ? isWithinWindow(progress, firstPhase) : false;
  const isSecondPhase = secondPhase ? isWithinWindow(progress, secondPhase) : false;

  const fadeIn = (visible: boolean, delay = 0, offset = 18): CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : `translateY(${offset}px)`,
    transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
    pointerEvents: 'none',
  });

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

      {/* Texto de fases */}
      {phases.length > 0 && (
        <div
          className="sticky top-0 pointer-events-none"
          style={{ height: '100vh', marginBottom: '-100vh', zIndex: 2 }}
        >
          {firstPhase && (
            <div className="absolute inset-x-0 top-24 sm:top-28 flex flex-col items-center text-center px-6">
              <span
                className="text-xs uppercase tracking-[0.18em] text-blue-200 font-semibold mb-3 px-3 py-1 rounded-full border border-blue-200/35 bg-black/35 backdrop-blur-sm"
                style={fadeIn(isFirstPhase, 0)}
              >
                {firstPhase.label}
              </span>
              <h3
                className="text-3xl sm:text-5xl font-bold text-white mb-2 leading-tight"
                style={{
                  ...fadeIn(isFirstPhase, 60),
                  textShadow: '0 6px 32px rgba(0,0,0,0.72)',
                }}
              >
                {firstPhase.title}
              </h3>
              <p
                className="text-sm sm:text-lg text-white/85 max-w-3xl"
                style={{
                  ...fadeIn(isFirstPhase, 120, 14),
                  textShadow: '0 2px 18px rgba(0,0,0,0.75)',
                }}
              >
                {firstPhase.subtitle}
              </p>
            </div>
          )}

          {secondPhase && (
            <div className="absolute inset-x-0 top-24 sm:top-28 flex flex-col items-center text-center px-6">
              <span
                className="text-xs uppercase tracking-[0.18em] text-amber-200 font-semibold mb-3 px-3 py-1 rounded-full border border-amber-200/35 bg-black/35 backdrop-blur-sm"
                style={fadeIn(isSecondPhase, 0)}
              >
                {secondPhase.label}
              </span>
              <h3
                className="text-3xl sm:text-5xl font-bold text-white mb-2 leading-tight"
                style={{
                  ...fadeIn(isSecondPhase, 60),
                  textShadow: '0 6px 32px rgba(0,0,0,0.72)',
                }}
              >
                {secondPhase.title}
              </h3>
              <p
                className="text-sm sm:text-lg text-white/85 max-w-3xl"
                style={{
                  ...fadeIn(isSecondPhase, 120, 14),
                  textShadow: '0 2px 18px rgba(0,0,0,0.75)',
                }}
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