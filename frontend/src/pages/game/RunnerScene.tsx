import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RunnerRobot, type RobotState } from './RunnerRobot';
import { RunnerWorld } from './RunnerWorld';
import { RunnerTrack } from './RunnerTrack';
import { ObstacleField } from './ObstacleField';
import { SpeedParticles } from './SpeedParticles';
import { CameraRig } from './CameraRig';
import { LANES, ROBOT_Z, type Quality, type WorldFx } from './config';

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
  quality: Quality;
}

const SPAWN_Z = -48;
const DESPAWN_Z = 9;
const POOL = 8;
const JUMP_V0 = 9.6;   // más impulso = más tiempo en el aire
const GRAVITY = 20;    // gravedad suave = salto indulgente
const CLEAR_Y = 0.9;   // si los pies pasan esta altura, libra el obstáculo
const HIT_Z = 0.6;     // ventana de colisión en Z (ajustada al cubo)
const JUMP_BUFFER = 0.15; // s: un salto pedido justo antes de aterrizar se ejecuta al tocar suelo

const DIFFICULTY: Record<Difficulty, { speed: number; ramp: number; cap: number; gap: number }> = {
  easy: { speed: 10, ramp: 0.4, cap: 23, gap: 11 },
  medium: { speed: 14, ramp: 0.7, cap: 32, gap: 9 },
  hard: { speed: 18, ramp: 1.0, cap: 40, gap: 7.5 },
};

interface Obstacle { lane: number; z: number; active: boolean; }
const createPool = () => Array.from({ length: POOL }, (): Obstacle => ({ lane: 0, z: SPAWN_Z, active: false }));

export const RunnerScene = forwardRef<RunnerHandle, Props>(({ onScore, onGameOver, quality }, ref) => {
  const robotState = useRef<RobotState>({ x: 0, y: 0, mode: 'run' });
  const fx = useRef<WorldFx>({ speed: 14 });
  const [obstacles] = useState(createPool);

  const g = useRef({
    playing: false,
    lane: 1,
    vy: 0,
    jumping: false,
    jumpBuffer: 0,
    speed: 14,
    distance: 0,
    sinceSpawn: 0,
    gap: 9,
    cfg: DIFFICULTY.medium,
    obstacles,
  });

  const resetState = () => {
    const s = g.current;
    s.playing = false;
    s.lane = 1; s.vy = 0; s.jumping = false; s.jumpBuffer = 0;
    s.speed = s.cfg.speed; s.distance = 0; s.sinceSpawn = 0; s.gap = s.cfg.gap;
    s.obstacles.forEach((o) => { o.active = false; o.z = SPAWN_Z; });
    robotState.current.x = 0;
    robotState.current.y = 0;
    robotState.current.mode = 'run';
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
      if (!s.playing) return;
      if (s.jumping) { s.jumpBuffer = JUMP_BUFFER; return; }
      s.jumping = true; s.vy = JUMP_V0; robotState.current.mode = 'jump';
    },
    move: (dir) => {
      const s = g.current;
      s.lane = Math.max(0, Math.min(2, s.lane + dir));
    },
  }), []);

  useFrame((_, rawDt) => {
    const s = g.current;
    const dt = Math.min(0.05, rawDt);
    const dead = robotState.current.mode === 'dead';
    fx.current.speed = dead ? fx.current.speed * Math.max(0, 1 - dt * 3) : s.speed;
    robotState.current.x = LANES[s.lane];

    if (s.playing) {
      if (s.jumping) {
        s.vy -= GRAVITY * dt;
        robotState.current.y += s.vy * dt;
        if (robotState.current.y <= 0) {
          robotState.current.y = 0; s.jumping = false; s.vy = 0; robotState.current.mode = 'run';
          if (s.jumpBuffer > 0) { s.jumpBuffer = 0; s.jumping = true; s.vy = JUMP_V0; robotState.current.mode = 'jump'; }
        }
        s.jumpBuffer = Math.max(0, s.jumpBuffer - dt);
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

    s.obstacles.forEach((o) => {
      if (o.active && s.playing) {
        o.z += s.speed * dt;
        if (o.z > DESPAWN_Z) o.active = false;
        if (o.active && o.lane === s.lane && Math.abs(o.z - ROBOT_Z) < HIT_Z && robotState.current.y < CLEAR_Y) {
          s.playing = false;
          robotState.current.mode = 'dead';
          onGameOver(Math.floor(s.distance));
        }
      }
    });
  });

  return (
    <>
      <CameraRig stateRef={robotState} />
      <RunnerWorld quality={quality} />
      <RunnerTrack fx={fx} quality={quality} />
      <SpeedParticles fx={fx} quality={quality} />
      <RunnerRobot stateRef={robotState} shadows={quality === 'high'} />
      <ObstacleField obstacles={obstacles} quality={quality} />
    </>
  );
});

RunnerScene.displayName = 'RunnerScene';
