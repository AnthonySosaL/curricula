import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import * as THREE from 'three';

const MODEL_URL = '/models/RobotExpressive.glb';

export interface RobotState {
  x: number;
  y: number;
}

/**
 * Robot jugable: clona el GLB (para no interferir con el avatar del hero),
 * reproduce la animación de correr y sigue la posición (lane X + salto Y)
 * que el simulador escribe en stateRef.
 */
export function RunnerRobot({ stateRef }: { stateRef: RefObject<RobotState> }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const cloned = useMemo(() => cloneSkinned(scene), [scene]);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const run = actions.Running ?? actions.Walking ?? Object.values(actions)[0] ?? null;
    run?.reset().fadeIn(0.3).play();
    return () => { run?.fadeOut(0.2); };
  }, [actions]);

  useFrame((_, dt) => {
    const g = group.current;
    const s = stateRef.current;
    if (!g || !s) return;
    const k = Math.min(1, dt * 12);
    g.position.x += (s.x - g.position.x) * k;
    g.position.y = s.y;
  });

  return (
    <group ref={group} rotation={[0, Math.PI, 0]} scale={0.5}>
      <primitive object={cloned} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);
