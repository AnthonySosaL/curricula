import { lazy, Suspense, useEffect, useState } from 'react';
import { usePortfolioData } from '@/data/portfolio';

// El stack three.js se carga en un chunk aparte para no engordar el bundle inicial
const RobotAvatar = lazy(() => import('./RobotAvatar'));

export function Avatar3D() {
  const { profile } = usePortfolioData();
  const [isMobile, setIsMobile] = useState(false);
  const [robotReady, setRobotReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 900px), (pointer: coarse)');
    const onChange = () => setIsMobile(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return (
    <div
      role="img"
      aria-label={`Asistente 3D de ${profile.name}`}
      className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 border-white/70 ring-4 ring-red-400/40 overflow-hidden bg-gradient-to-b from-slate-950 via-red-950 to-slate-950 avatar-halo cursor-pointer select-none"
    >
      {/* Foto como fallback mientras el robot carga */}
      {profile.avatar && (
        <img
          src={profile.avatar}
          alt={profile.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${robotReady ? 'opacity-0' : 'opacity-100'}`}
        />
      )}
      <Suspense fallback={null}>
        <RobotAvatar
          isMobile={isMobile}
          onReady={() => setRobotReady(true)}
          className="absolute inset-0"
        />
      </Suspense>
      {robotReady && (
        <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-[0.2em] text-red-200/75 pointer-events-none boot-line">
          tap
        </span>
      )}
    </div>
  );
}
