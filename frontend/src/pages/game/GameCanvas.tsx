import { lazy, Suspense, useState, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { COLORS, type Quality } from './config';

// El bloom vive en su propio chunk: en móvil nunca se descarga.
const GameEffects = lazy(() => import('./GameEffects'));

const LOW_END_QUERY = '(max-width: 900px), (pointer: coarse)';
const isLowEnd = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia(LOW_END_QUERY).matches || (navigator.hardwareConcurrency ?? 8) < 4);

/**
 * Canvas del juego con calidad automática:
 * - móvil / equipos modestos → calidad baja (sin sombras, sin bloom, materiales
 *   simples en superficies grandes, dpr ≤ 1.5)
 * - PerformanceMonitor baja el dpr y apaga sombras/bloom si caen los FPS,
 *   y los recupera si el equipo va sobrado.
 */
export function GameCanvas({ children }: { children: (quality: Quality) => ReactNode }) {
  const [lowEnd] = useState(isLowEnd);
  // Nunca por encima del dpr real de la pantalla (renderizar de más no se ve)
  const [screenDpr] = useState(() => (typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1));
  const maxDpr = Math.min(screenDpr, lowEnd ? 1.5 : 2);
  const [dpr, setDpr] = useState(() => Math.min(screenDpr, lowEnd ? 1.25 : 1.5));
  const [degraded, setDegraded] = useState(false);
  const quality: Quality = lowEnd || degraded ? 'low' : 'high';

  return (
    <Canvas
      dpr={dpr}
      shadows={{ type: THREE.PCFShadowMap, enabled: !lowEnd }}
      camera={{ position: [0, 4.2, 9], fov: 55, far: 400 }}
      // En escritorio el antialias lo hace el EffectComposer (MSAA en su render target)
      gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}
      onCreated={({ camera }) => camera.lookAt(0, 1, 0)}
    >
      <PerformanceMonitor
        bounds={(fps) => (fps > 90 ? [55, 85] : [40, 55])}
        onDecline={() => {
          setDpr((d) => Math.max(Math.min(1, screenDpr), d - 0.25));
          setDegraded(true);
        }}
        onIncline={() => setDpr((d) => Math.min(maxDpr, d + 0.25))}
        flipflops={3}
        onFallback={() => { setDpr(Math.min(1, screenDpr)); setDegraded(true); }}
      />
      <fog attach="fog" args={[COLORS.fog, 22, 95]} />
      <Suspense fallback={null}>{children(quality)}</Suspense>
      <Suspense fallback={null}>{quality === 'high' && <GameEffects />}</Suspense>
    </Canvas>
  );
}
