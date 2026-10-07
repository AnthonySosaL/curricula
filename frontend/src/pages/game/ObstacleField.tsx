import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { COLORS, LANES, OBS_H, type Quality } from './config';
import { hazardTexture, radialTexture } from './textures';

export interface ObstacleView { lane: number; z: number; active: boolean; }

const tmp = new THREE.Object3D();
const HIDDEN = new THREE.Matrix4().makeScale(0, 0, 0);

/**
 * Dibuja el pool de obstáculos con 2 InstancedMesh (barrera + charco de luz):
 * 2 draw calls en total sin importar cuántos haya. Solo lee el estado; la
 * colisión sigue en RunnerScene.
 */
export function ObstacleField({ obstacles, quality }: { obstacles: ObstacleView[]; quality: Quality }) {
  const body = useRef<THREE.InstancedMesh>(null);
  const glow = useRef<THREE.InstancedMesh>(null);
  const count = obstacles.length;

  const res = useMemo(() => ({
    geo: new RoundedBoxGeometry(1.4, OBS_H, 1.1, 2, 0.12),
    hazard: hazardTexture(),
    halo: radialTexture('rgba(255,90,60,0.9)'),
  }), []);
  useEffect(() => () => { res.geo.dispose(); res.hazard.dispose(); res.halo.dispose(); }, [res]);

  useFrame((state) => {
    const b = body.current, g = glow.current;
    if (!b || !g) return;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 6) * 0.08;
    obstacles.forEach((o, i) => {
      if (!o.active) {
        b.setMatrixAt(i, HIDDEN);
        g.setMatrixAt(i, HIDDEN);
        return;
      }
      const x = LANES[o.lane];
      tmp.position.set(x, OBS_H / 2, o.z);
      tmp.rotation.set(0, 0, 0);
      tmp.scale.set(1, 1, 1);
      tmp.updateMatrix();
      b.setMatrixAt(i, tmp.matrix);
      tmp.position.set(x, 0.02, o.z);
      tmp.rotation.set(-Math.PI / 2, 0, 0);
      tmp.scale.set(pulse, pulse, 1);
      tmp.updateMatrix();
      g.setMatrixAt(i, tmp.matrix);
    });
    b.instanceMatrix.needsUpdate = true;
    g.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh
        ref={body}
        args={[res.geo, undefined, count]}
        frustumCulled={false}
        castShadow={quality === 'high'}
      >
        <meshStandardMaterial
          color="#3a0b0d"
          metalness={0.75}
          roughness={0.32}
          emissiveMap={res.hazard}
          emissive={COLORS.neon}
          emissiveIntensity={2.4}
        />
      </instancedMesh>
      <instancedMesh ref={glow} args={[undefined, undefined, count]} frustumCulled={false}>
        <planeGeometry args={[3, 2.6]} />
        <meshBasicMaterial
          map={res.halo}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </instancedMesh>
    </>
  );
}
