import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { LANES, type Quality } from './config';
import { radialTexture } from './textures';
import type { ObstacleView } from './ObstacleField';

// Dron a la altura de la cabeza: la parte de abajo queda a DRONE_BOTTOM, por
// encima del robot agachado (≈0.8) y por debajo del robot de pie (≈1.5).
const DRONE_Y = 1.6;
const DRONE_BOTTOM = 1.25;
const AMBER = '#ffb020';
const ROTORS = [-0.62, 0.62];

const tmp = new THREE.Object3D();
const HIDDEN = new THREE.Matrix4().makeScale(0, 0, 0);

/**
 * Drones (obstáculo alto): cuerpo + franja de luz + 2 hélices + halo en el
 * suelo, todo instanciado → 4 draw calls para todo el pool.
 */
export function DroneField({ obstacles, quality }: { obstacles: ObstacleView[]; quality: Quality }) {
  const body = useRef<THREE.InstancedMesh>(null);
  const eye = useRef<THREE.InstancedMesh>(null);
  const rotor = useRef<THREE.InstancedMesh>(null);
  const halo = useRef<THREE.InstancedMesh>(null);
  const n = obstacles.length;

  const res = useMemo(() => ({
    geo: new RoundedBoxGeometry(1.5, (DRONE_Y - DRONE_BOTTOM) * 2, 0.8, 2, 0.15),
    halo: radialTexture('rgba(255,176,32,0.8)'),
  }), []);
  useEffect(() => () => { res.geo.dispose(); res.halo.dispose(); }, [res]);

  useFrame((state) => {
    const b = body.current, e = eye.current, r = rotor.current, h = halo.current;
    if (!b || !e || !r || !h) return;
    const t = state.clock.elapsedTime;
    obstacles.forEach((o, i) => {
      if (!o.active || o.kind !== 'high') {
        [b, e, h].forEach((m) => m.setMatrixAt(i, HIDDEN));
        ROTORS.forEach((_, j) => r.setMatrixAt(i * 2 + j, HIDDEN));
        return;
      }
      const x = LANES[o.lane];
      const y = DRONE_Y + Math.sin(t * 3 + i) * 0.05; // flota (nunca baja de DRONE_BOTTOM - 0.05)
      const tilt = Math.sin(t * 2 + i) * 0.06;
      tmp.scale.set(1, 1, 1);
      tmp.position.set(x, y, o.z); tmp.rotation.set(0.12, 0, tilt); tmp.updateMatrix();
      b.setMatrixAt(i, tmp.matrix);
      tmp.position.set(x, y - 0.05, o.z + 0.41); tmp.updateMatrix();
      e.setMatrixAt(i, tmp.matrix);
      ROTORS.forEach((dx, j) => {
        tmp.position.set(x + dx, y + 0.42, o.z); tmp.rotation.set(0, t * 40 + j, 0); tmp.updateMatrix();
        r.setMatrixAt(i * 2 + j, tmp.matrix);
      });
      tmp.position.set(x, 0.03, o.z); tmp.rotation.set(-Math.PI / 2, 0, 0); tmp.scale.set(1.2, 0.9, 1); tmp.updateMatrix();
      h.setMatrixAt(i, tmp.matrix);
    });
    [b, e, r, h].forEach((m) => { m.instanceMatrix.needsUpdate = true; });
  });

  return (
    <>
      <instancedMesh ref={body} args={[res.geo, undefined, n]} frustumCulled={false} castShadow={quality === 'high'}>
        <meshStandardMaterial color="#26282e" metalness={0.85} roughness={0.3} />
      </instancedMesh>
      <instancedMesh ref={eye} args={[undefined, undefined, n]} frustumCulled={false}>
        <boxGeometry args={[1.1, 0.12, 0.04]} />
        <meshBasicMaterial color={AMBER} toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={rotor} args={[undefined, undefined, n * 2]} frustumCulled={false}>
        <boxGeometry args={[0.95, 0.03, 0.12]} />
        <meshStandardMaterial color="#9aa0a8" metalness={0.9} roughness={0.25} />
      </instancedMesh>
      <instancedMesh ref={halo} args={[undefined, undefined, n]} frustumCulled={false}>
        <planeGeometry args={[2.4, 2.4]} />
        <meshBasicMaterial map={res.halo} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </instancedMesh>
    </>
  );
}
