import { useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { RobotState } from './RunnerRobot';

const BASE = { y: 4.2, z: 9, fov: 55 };

/**
 * Cámara de "endless runner": sigue al robot en X con retardo suave (más en
 * pantallas verticales, donde los carriles laterales se salían de cuadro),
 * abre el FOV en vertical y tiembla un instante al chocar.
 */
export function CameraRig({ stateRef }: { stateRef: RefObject<RobotState> }) {
  const deadFor = useRef(0);

  useFrame((state, rawDt) => {
    const s = stateRef.current;
    const camera = state.camera as THREE.PerspectiveCamera;
    if (!s) return;
    const dt = Math.min(0.05, rawDt);
    const k = Math.min(1, dt * 5);
    const portrait = state.size.width / state.size.height < 0.9;
    const follow = portrait ? 0.75 : 0.3;
    const fov = portrait ? 66 : BASE.fov;

    deadFor.current = s.mode === 'dead' ? deadFor.current + dt : 0;
    const shake = s.mode === 'dead' ? Math.max(0, 0.35 - deadFor.current) * 0.5 : 0;

    camera.position.x += (s.x * follow - camera.position.x) * k + (Math.random() - 0.5) * shake;
    camera.position.y += (BASE.y + s.y * 0.15 - camera.position.y) * k;
    camera.position.z = BASE.z;
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov += (fov - camera.fov) * k;
      camera.updateProjectionMatrix();
    }
    camera.lookAt(camera.position.x * 0.5, 1, 0);
  });

  return null;
}
