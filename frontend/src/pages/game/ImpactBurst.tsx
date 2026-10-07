import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Impact } from './config';
import { radialTexture } from './textures';

const SPARKS = 48;
const LIFE = 1.1; // s
const GRAVITY = 14;

function randomVelocities() {
  const v = new Float32Array(SPARKS * 3);
  for (let i = 0; i < SPARKS; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 2 + Math.random() * 5;
    v[i * 3] = Math.cos(a) * r;
    v[i * 3 + 1] = 2.5 + Math.random() * 6;
    v[i * 3 + 2] = Math.sin(a) * r * 0.6 + 2; // salen hacia la cámara
  }
  return v;
}

/**
 * Explosión de chispas en el punto del choque (el destello va en la UI).
 * Posiciones analíticas (p = p0 + v·t − ½·g·t²): sin estado por partícula.
 */
export function ImpactBurst({ impact }: { impact: RefObject<Impact> }) {
  const points = useRef<THREE.Points>(null);

  const { geo, tex, vel } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(SPARKS * 3), 3));
    return { geo: g, tex: radialTexture(), vel: randomVelocities() };
  }, []);
  useEffect(() => () => { geo.dispose(); tex.dispose(); }, [geo, tex]);

  useFrame((state) => {
    const p = points.current, hit = impact.current;
    if (!p || !hit) return;
    const age = hit.t < 0 ? LIFE : state.clock.elapsedTime - hit.t;
    const alive = age < LIFE;
    p.visible = alive;
    if (!alive) return;
    const attr = p.geometry.attributes.position;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < SPARKS; i++) {
      const k = i * 3;
      arr[k] = hit.x + vel[k] * age;
      arr[k + 1] = Math.max(0.05, 0.7 + vel[k + 1] * age - 0.5 * GRAVITY * age * age);
      arr[k + 2] = hit.z + vel[k + 2] * age;
    }
    attr.needsUpdate = true;
    (p.material as THREE.PointsMaterial).opacity = 1 - age / LIFE;
  });

  return (
    <>
      <points ref={points} geometry={geo} frustumCulled={false} visible={false}>
        <pointsMaterial
          map={tex}
          color="#ffb15c"
          size={0.28}
          sizeAttenuation
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </>
  );
}
