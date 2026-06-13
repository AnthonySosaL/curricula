import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RunnerRobot, type RobotState } from './RunnerRobot';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface RunnerHandle {
  start: (difficulty: Difficulty) => void;
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
const JUMP_V0 = 9.6;   // más impulso = más tiempo en el aire
const GRAVITY = 20;    // gravedad suave = salto indulgente
const CLEAR_Y = 0.9;   // si los pies pasan esta altura, libra el obstáculo
const HIT_Z = 0.6;     // ventana de colisión en Z (ajustada al cubo)
const OBS_H = 1.2;     // alto del obstáculo

const DIFFICULTY: Record<Difficulty, { speed: number; ramp: number; cap: number; gap: number }> = {
  easy: { speed: 10, ramp: 0.4, cap: 23, gap: 11 },
  medium: { speed: 14, ramp: 0.7, cap: 32, gap: 9 },
  hard: { speed: 18, ramp: 1.0, cap: 40, gap: 7.5 },
};

interface Obstacle { lane: number; z: number; active: boolean; }

export const RunnerScene = forwardRef<RunnerHandle, Props>(({ onScore, onGameOver }, ref) => {
  const robotState = useRef<RobotState>({ x: 0, y: 0 });
  const obstacleRefs = useRef<(THREE.Mesh | null)[]>([]);

  const g = useRef({
    playing: false,
    lane: 1,
    vy: 0,
    jumping: false,
    speed: 14,
    distance: 0,
    sinceSpawn: 0,
    gap: 9,
    cfg: DIFFICULTY.medium,
    obstacles: Array.from({ length: POOL }, (): Obstacle => ({ lane: 0, z: SPAWN_Z, active: false })),
  });

  // Grid del piso: 3 columnas = 3 carriles, se desplaza para dar velocidad
  const floorTex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#170707';
    ctx.fillRect(0, 0, 128, 128);
    ctx.strokeStyle = 'rgba(248,113,113,0.5)';
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(3, 50);
    return t;
  }, []);

  const resetState = () => {
    const s = g.current;
    s.playing = false;
    s.lane = 1; s.vy = 0; s.jumping = false;
    s.speed = s.cfg.speed; s.distance = 0; s.sinceSpawn = 0; s.gap = s.cfg.gap;
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
    start: (difficulty) => { g.current.cfg = DIFFICULTY[difficulty]; resetState(); g.current.playing = true; },
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
    const dt = Math.min(0.05, rawDt);
    floorTex.offset.y -= s.speed * dt * 0.06;
    robotState.current.x = LANES[s.lane];

    if (s.playing) {
      if (s.jumping) {
        s.vy -= GRAVITY * dt;
        robotState.current.y += s.vy * dt;
        if (robotState.current.y <= 0) { robotState.current.y = 0; s.jumping = false; s.vy = 0; }
      }
      s.distance += s.speed * dt;
      s.speed = Math.min(s.cfg.cap, s.speed + dt * s.cfg.ramp);
      onScore(Math.floor(s.distance));

      s.sinceSpawn += s.speed * dt;
      if (s.sinceSpawn >= s.gap) {
        s.sinceSpawn = 0;
        s.gap = s.cfg.gap * (0.85 + Math.random() * 0.4);
        spawn();
      }
    }

    s.obstacles.forEach((o, i) => {
      const mesh = obstacleRefs.current[i];
      if (!mesh) return;
      if (o.active && s.playing) {
        o.z += s.speed * dt;
        if (o.z > DESPAWN_Z) o.active = false;
        if (o.active && o.lane === s.lane && Math.abs(o.z - ROBOT_Z) < HIT_Z && robotState.current.y < CLEAR_Y) {
          s.playing = false;
          onGameOver(Math.floor(s.distance));
        }
      }
      mesh.visible = o.active;
      mesh.position.set(LANES[o.lane], OBS_H / 2, o.z);
    });
  });

  return (
    <>
      <hemisphereLight intensity={1.1} color="#fee2e2" groundColor="#1a0606" />
      <directionalLight position={[3, 8, 5]} intensity={2.2} />
      <pointLight position={[0, 4, 6]} intensity={20} distance={25} color="#f87171" />

      <RunnerRobot stateRef={robotState} />

      {/* Piso 3 carriles con grid en movimiento */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -15]}>
        <planeGeometry args={[6.6, 90]} />
        <meshStandardMaterial map={floorTex} />
      </mesh>

      {/* Pool de obstáculos (cubos a ras de piso) */}
      {Array.from({ length: POOL }).map((_, i) => (
        <mesh key={i} ref={(m) => { obstacleRefs.current[i] = m; }} visible={false}>
          <boxGeometry args={[1.4, OBS_H, 1.1]} />
          <meshStandardMaterial color="#dc2626" emissive="#7f1d1d" emissiveIntensity={0.6} />
        </mesh>
      ))}
    </>
  );
});

RunnerScene.displayName = 'RunnerScene';
