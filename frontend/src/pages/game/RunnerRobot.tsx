import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import * as THREE from 'three';
import { radialTexture } from './textures';

const MODEL_URL = '/models/RobotExpressive.glb';
const AIR_TIME = 0.96; // 2 * JUMP_V0 / GRAVITY (ver RunnerScene)

export type RobotMode = 'run' | 'jump' | 'dead';

export interface RobotState {
  x: number;
  y: number;
  mode: RobotMode;
}

// Ajuste PBR por material del GLB (CC0, Quaternius/Tomás Laulhé, 180 KB)
const PBR: Record<string, Partial<THREE.MeshStandardMaterial>> = {
  Main: { metalness: 0.45, roughness: 0.38 },
  Grey: { metalness: 0.9, roughness: 0.28 },
  Black: { metalness: 0.3, roughness: 0.55 },
};

type Actions = Record<string, THREE.AnimationAction | null>;

/** Cambia de clip con crossfade; el salto se ajusta al tiempo real en el aire. */
function playMode(actions: Actions, mode: RobotMode) {
  const name = mode === 'jump' ? 'Jump' : mode === 'dead' ? 'Death' : 'Running';
  const next = actions[name] ?? actions.Running;
  if (!next) return;
  Object.values(actions).forEach((a) => { if (a && a !== next) a.fadeOut(0.15); });
  next.reset();
  if (mode === 'run') {
    next.setLoop(THREE.LoopRepeat, Infinity);
    next.setEffectiveTimeScale(1.15);
  } else {
    next.setLoop(THREE.LoopOnce, 1);
    next.clampWhenFinished = true;
    next.setEffectiveTimeScale(mode === 'jump' ? next.getClip().duration / AIR_TIME : 1);
  }
  next.fadeIn(mode === 'dead' ? 0.1 : 0.15).play();
}

/**
 * Robot jugable: clona el GLB (con materiales propios para no tocar el avatar
 * del hero), mezcla correr/saltar/caer según stateRef.mode y sigue la
 * posición (carril X + salto Y) que escribe el simulador.
 */
export function RunnerRobot({ stateRef, shadows }: { stateRef: RefObject<RobotState>; shadows: boolean }) {
  const group = useRef<THREE.Group>(null);
  const blob = useRef<THREE.Mesh>(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, group);
  const shown = useRef<RobotMode | null>(null);
  const blobZ = useRef<number | null>(null);
  const blobTex = useMemo(() => radialTexture('rgba(0,0,0,0.75)'), []);

  const cloned = useMemo(() => {
    const c = cloneSkinned(scene);
    c.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.castShadow = true;
      const mat = (m.material as THREE.MeshStandardMaterial).clone();
      Object.assign(mat, PBR[mat.name] ?? {});
      mat.envMapIntensity = 1.2;
      m.material = mat;
    });
    return c;
  }, [scene]);

  useEffect(() => () => {
    blobTex.dispose();
    cloned.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) (m.material as THREE.Material).dispose(); });
  }, [cloned, blobTex]);

  useEffect(() => {
    cloned.traverse((o) => { if ((o as THREE.Mesh).isMesh) o.castShadow = shadows; });
  }, [cloned, shadows]);

  useFrame((_, dt) => {
    const g = group.current;
    const s = stateRef.current;
    if (!g || !s) return;
    if (shown.current !== s.mode) { shown.current = s.mode; playMode(actions, s.mode); }
    const k = Math.min(1, dt * 12);
    const dx = s.x - g.position.x;
    g.position.x += dx * k;
    g.position.y = s.y;
    // Se inclina hacia el carril al que se mueve
    const lean = THREE.MathUtils.clamp(-dx * 0.08, -0.12, 0.12);
    g.rotation.z += (lean - g.rotation.z) * Math.min(1, dt * 10);
    if (blob.current) {
      if (blobZ.current === null) {
        g.updateWorldMatrix(true, true);
        blobZ.current = new THREE.Box3().setFromObject(cloned).getCenter(new THREE.Vector3()).z;
        blob.current.position.z = blobZ.current;
      }
      const sc = Math.max(0.35, 1 - s.y * 0.25);
      blob.current.position.x = g.position.x;
      blob.current.scale.setScalar(sc);
    }
  });

  return (
    <>
      <group ref={group} rotation={[0, Math.PI, 0]} scale={0.5}>
        <primitive object={cloned} />
      </group>
      <mesh ref={blob} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <planeGeometry args={[1.6, 1.6]} />
        <meshBasicMaterial map={blobTex} transparent depthWrite={false} />
      </mesh>
    </>
  );
}

useGLTF.preload(MODEL_URL);
