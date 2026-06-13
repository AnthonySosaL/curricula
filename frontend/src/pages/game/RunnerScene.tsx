import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RunnerRobot, type RobotState } from './RunnerRobot';

export interface RunnerHandle {
  start: () => void;
  reset: () => void;
  jump: () => void;
  move: (dir: -1 | 1) => void;
}

interface Props {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
}

const LANES = [-2.2, 0, 2.2];
const ROBOT_Z = 3;
const SPAWN_Z = -48;
const DESPAWN_Z = 9;
const POOL = 8;
const JUMP_V0 = 8.4;
const GRAVITY = 24;
const CLEAR_Y = 1.2;

interface Obstacle { lane: number; z: number; active: boolean; }

export const RunnerScene = forwardRef<RunnerHandle, Props>(({ onScore, onGameOver }, ref) => {
  const robotState = useRef<RobotState>({ x: 0, y: 0 });
  const obstacleRefs = useRef<(THREE.Mesh | null)[]>([]);
  const floorRef = useRef<THREE.Mesh>(null);

  const g = useRef({
    playing: false,
    lane: 1,
    vy: 0,
    jumping: false,
    speed: 14,
    distance: 0,
    sinceSpawn: 0,
    gap: 9,
    obstacles: Array.from({ length: POOL }, (): Obstacle => ({ lane: 0, z: SPAWN_Z, active: false })),
  });

  // Textura de grid que se desplaza para dar sensación de velocidad
  const floorTex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#170707';
    ctx.fillRect(0, 0, 128, 128);
    ctx.strokeStyle = 'rgba(248,113,113,0.45)';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(5, 50);
    return t;
  }, []);

  const resetState = () => {
    const s = g.current;
    s.playing = false;
    s.lane = 1; s.vy = 0; s.jumping = false;
    s.speed = 14; s.distance = 0; s.sinceSpawn = 0; s.gap = 9;
    s.obstacles.forEach((o) => { o.active = false; o.z = SPAWN_Z; });
    robotState.current.x = 0;
    robotState.current.y = 0;
    onScore(0);
  };

  const spawn = () => {
    const s = g.current;
    const free = s.obstacles.find((o) => !o.active);
    if (!free) return;
    free.lane = Math.floor(Math.random() * 3);
    free.z = SPAWN_Z;
    free.active = true;
  };

  useImperativeHandle(ref, () => ({
    start: () => { resetState(); g.current.playing = true; },
    reset: resetState,
    jump: () => {
      const s = g.current;
      if (s.playing && !s.jumping) { s.jumping = true; s.vy = JUMP_V0; }
    },
    move: (dir) => {
      const s = g.current;
      s.lane = Math.max(0, Math.min(2, s.lane + dir));
    },
  }), []);

  useFrame((_, rawDt) => {
    const s = g.current;
    const dt = Math.min(0.05, rawDt); // estabiliza saltos de frame
    floorTex.offset.y -= s.speed * dt * 0.06;

    // Robot lane objetivo (siempre, aunque no juegue, para que se vea centrado)
    robotState.current.x = LANES[s.lane];

    if (s.playing) {
      // Salto
      if (s.jumping) {
        s.vy -= GRAVITY * dt;
        robotState.current.y += s.vy * dt;
        if (robotState.current.y <= 0) { robotState.current.y = 0; s.jumping = false; s.vy = 0; }
      }
      // Avance / score / dificultad
      s.distance += s.speed * dt;
      s.speed = Math.min(34, s.speed + dt * 0.7);
      onScore(Math.floor(s.distance));

      // Spawning
      s.sinceSpawn += s.speed * dt;
      if (s.sinceSpawn >= s.gap) {
        s.sinceSpawn = 0;
        s.gap = 7 + Math.random() * 5;
        spawn();
      }
    }

    // Mover/recyclar obstáculos + colisión
    s.obstacles.forEach((o, i) => {
      const mesh = obstacleRefs.current[i];
      if (!mesh) return;
      if (o.active && s.playing) {
        o.z += s.speed * dt;
        if (o.z > DESPAWN_Z) o.active = false;
        if (o.active && o.lane === s.lane && Math.abs(o.z - ROBOT_Z) < 0.9 && robotState.current.y < CLEAR_Y) {
          s.playing = false;
          onGameOver(Math.floor(s.distance));
        }
      }
      mesh.visible = o.active;
      mesh.position.set(LANES[o.lane], 0.7, o.z);
    });
  });

  return (
    <>
      <hemisphereLight intensity={1.1} color="#fee2e2" groundColor="#1a0606" />
      <directionalLight position={[3, 8, 5]} intensity={2.2} castShadow />
      <pointLight position={[0, 4, 6]} intensity={20} distance={25} color="#f87171" />

      <RunnerRobot stateRef={robotState} />

      {/* Piso con grid en movimiento */}
      <mesh ref={floorRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -15]}>
        <planeGeometry args={[14, 90]} />
        <meshStandardMaterial map={floorTex} />
      </mesh>

      {/* Pool de obstáculos */}
      {Array.from({ length: POOL }).map((_, i) => (
        <mesh key={i} ref={(m) => { obstacleRefs.current[i] = m; }} visible={false} castShadow>
          <boxGeometry args={[1.1, 1.4, 1.1]} />
          <meshStandardMaterial color="#dc2626" emissive="#7f1d1d" emissiveIntensity={0.6} />
        </mesh>
      ))}
    </>
  );
});

RunnerScene.displayName = 'RunnerScene';
