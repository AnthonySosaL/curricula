import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS, type Quality, type WorldFx } from './config';
import { floorTextures, gridTexture, windowsTexture } from './textures';

const TRACK_W = 6.6;
const TRACK_LEN = 140;
const TRACK_Z = -40; // centro: va de z=30 a z=-110 (se pierde en la niebla)
const TILE = 1.8;    // largo de cada baldosa de carril (unidades de mundo)
const ARCH_GAP = 14;
const ARCHES = 8;
const BUILDINGS = 28;
const FAR_Z = -110;
const NEAR_Z = 14;

const tmp = new THREE.Object3D();

interface Tower { x: number; z: number; w: number; h: number; }
const makeLayout = () => ({
  arches: Array.from({ length: ARCHES }, (_, i) => -i * ARCH_GAP - 6),
  towers: Array.from({ length: BUILDINGS }, (_, i): Tower => ({
    x: (i % 2 ? 1 : -1) * (12 + Math.random() * 16),
    z: FAR_Z + (i / BUILDINGS) * (TOWER_NEAR - FAR_Z),
    w: 2.5 + Math.random() * 3,
    h: 4 + Math.random() * 16,
  })),
});
const scroll = (mesh: THREE.Mesh | null, dv: number, kind: 'map' | 'emissiveMap') => {
  const t = mesh && (mesh.material as THREE.MeshStandardMaterial)[kind];
  if (t) t.offset.y += dv;
};
const TOWER_NEAR = -4; // los edificios reaparecen al fondo antes de tapar la cámara
const wrap = (z: number, near = NEAR_Z) => (z > near ? z - (near - FAR_Z) : z);

/** Pista, terreno, arcos de neón y edificios. Todo lo repetido va instanciado. */
export function RunnerTrack({ fx, quality }: { fx: RefObject<WorldFx>; quality: Quality }) {
  const high = quality === 'high';
  const tex = useMemo(() => {
    const f = floorTextures();
    f.base.repeat.set(3, TRACK_LEN / TILE);
    f.glow.repeat.set(3, TRACK_LEN / TILE);
    const grid = gridTexture();
    grid.repeat.set(60, 60);
    const windows = windowsTexture();
    return { ...f, grid, windows };
  }, []);
  useEffect(() => () => Object.values(tex).forEach((t) => t.dispose()), [tex]);

  const pillars = useRef<THREE.InstancedMesh>(null);
  const beams = useRef<THREE.InstancedMesh>(null);
  const towers = useRef<THREE.InstancedMesh>(null);

  const floor = useRef<THREE.Mesh>(null);
  const ground = useRef<THREE.Mesh>(null);
  // Estado de scroll de arcos y edificios (X fija, Z avanza); se crea en el 1er frame
  const layoutRef = useRef<ReturnType<typeof makeLayout> | null>(null);

  useFrame((_, rawDt) => {
    const dz = (fx.current?.speed ?? 0) * Math.min(0.05, rawDt);
    // El piso avanza exactamente a la velocidad de los obstáculos
    const dv = dz / TILE;
    scroll(floor.current, dv, 'map');
    scroll(floor.current, dv, 'emissiveMap');
    scroll(ground.current, dz * (60 / 200), 'map');
    const layout = (layoutRef.current ??= makeLayout());

    const p = pillars.current, b = beams.current, t = towers.current;
    if (p && b) {
      layout.arches.forEach((z, i) => {
        const nz = wrap(z + dz);
        layout.arches[i] = nz;
        for (const side of [-1, 1]) {
          tmp.position.set(side * 4.3, 2.9, nz); tmp.scale.set(1, 1, 1); tmp.updateMatrix();
          p.setMatrixAt(i * 2 + (side > 0 ? 1 : 0), tmp.matrix);
        }
        tmp.position.set(0, 5.9, nz); tmp.updateMatrix();
        b.setMatrixAt(i, tmp.matrix);
      });
      p.instanceMatrix.needsUpdate = true;
      b.instanceMatrix.needsUpdate = true;
    }
    if (t) {
      layout.towers.forEach((o, i) => {
        o.z = wrap(o.z + dz * 0.6, TOWER_NEAR); // un poco de parallax
        tmp.position.set(o.x, o.h / 2 - 0.1, o.z); tmp.scale.set(o.w, o.h, o.w); tmp.updateMatrix();
        t.setMatrixAt(i, tmp.matrix);
      });
      t.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Pista de 3 carriles: asfalto metálico + líneas de neón */}
      <mesh ref={floor} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, TRACK_Z]} receiveShadow>
        <planeGeometry args={[TRACK_W, TRACK_LEN]} />
        {high ? (
          <meshStandardMaterial
            map={tex.base}
            emissiveMap={tex.glow}
            emissive={COLORS.neon}
            emissiveIntensity={1.6}
            roughness={0.6}
            metalness={0.25}
            envMapIntensity={0.35}
          />
        ) : (
          <meshLambertMaterial map={tex.base} emissiveMap={tex.glow} emissive={COLORS.neon} emissiveIntensity={1.6} />
        )}
      </mesh>

      {/* Bordes de la pista */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (TRACK_W / 2 + 0.12), 0.1, TRACK_Z]}>
          <boxGeometry args={[0.24, 0.2, TRACK_LEN]} />
          <meshStandardMaterial color="#2a0a0a" emissive={COLORS.amber} emissiveIntensity={2.2} toneMapped={false} />
        </mesh>
      ))}

      {/* Terreno lateral con cuadrícula tenue */}
      <mesh ref={ground} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, -40]}>
        <planeGeometry args={[200, 200]} />
        {/* Sin iluminación: solo líneas de la cuadrícula (muy barato, cubre media pantalla) */}
        <meshBasicMaterial map={tex.grid} color="#6a0f0f" />
      </mesh>

      {/* Arcos de neón sobre la pista */}
      <instancedMesh ref={pillars} args={[undefined, undefined, ARCHES * 2]} frustumCulled={false} castShadow={high}>
        <boxGeometry args={[0.35, 5.8, 0.35]} />
        <meshStandardMaterial color="#1c0b0b" metalness={0.85} roughness={0.3} />
      </instancedMesh>
      <instancedMesh ref={beams} args={[undefined, undefined, ARCHES]} frustumCulled={false}>
        <boxGeometry args={[8.95, 0.22, 0.22]} />
        <meshStandardMaterial color="#300" emissive={COLORS.neon} emissiveIntensity={3} toneMapped={false} />
      </instancedMesh>

      {/* Edificios del horizonte con ventanas encendidas */}
      <instancedMesh ref={towers} args={[undefined, undefined, BUILDINGS]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshLambertMaterial color="#1a0809" emissiveMap={tex.windows} emissive="#ff7a45" emissiveIntensity={1.2} />
      </instancedMesh>
    </>
  );
}
