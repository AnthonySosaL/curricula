import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS, type Quality, type WorldFx } from './config';
import { radialTexture } from './textures';

const FAR = -70;
const NEAR = 12;

function randomPositions(count: number) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 30;
    pos[i * 3 + 1] = 0.2 + Math.random() * 9;
    pos[i * 3 + 2] = FAR + Math.random() * (NEAR - FAR);
  }
  return pos;
}

/** Brasas que vuelan hacia la cámara: 1 draw call (THREE.Points). */
export function SpeedParticles({ fx, quality }: { fx: RefObject<WorldFx>; quality: Quality }) {
  const count = quality === 'high' ? 260 : 110;
  const points = useRef<THREE.Points>(null);

  const { geo, tex } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(randomPositions(count), 3));
    return { geo: g, tex: radialTexture() };
  }, [count]);
  useEffect(() => () => { geo.dispose(); tex.dispose(); }, [geo, tex]);

  useFrame((state, rawDt) => {
    const p = points.current;
    if (!p) return;
    const dt = Math.min(0.05, rawDt);
    const dz = ((fx.current?.speed ?? 0) * 1.15 + 2) * dt;
    const attr = p.geometry.attributes.position;
    const arr = attr.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const k = i * 3;
      arr[k + 2] += dz;
      arr[k + 1] += Math.sin(t * 1.3 + i) * 0.004;
      if (arr[k + 2] > NEAR) arr[k + 2] = FAR;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points} geometry={geo} frustumCulled={false}>
      <pointsMaterial
        map={tex}
        color={COLORS.amber}
        size={0.16}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}
