import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RunnerRobot, type RobotState } from './RunnerRobot';
import { RunnerWorld } from './RunnerWorld';
import { RunnerTrack } from './RunnerTrack';
import { ObstacleField } from './ObstacleField';
import { DroneField } from './DroneField';
import { SpeedParticles } from './SpeedParticles';
import { CameraRig } from './CameraRig';
import { ImpactBurst } from './ImpactBurst';
import { LANES, ROBOT_Z, type Impact, type Quality, type WorldFx } from './config';
import {
  DIFFICULTY, DRONES_FROM, FAST_FALL, GRAVITY, JUMP_BUFFER, JUMP_V0, SLIDE_TIME, SPAWN_Z, DESPAWN_Z,
  createPool, hitsObstacle, type Difficulty,
} from './rules';

export type { Difficulty };

export interface RunnerHandle {
  start: (difficulty: Difficulty) => void;
  reset: () => void;
  jump: () => void;
  slide: () => void;
  move: (dir: -1 | 1) => void;
}

interface Props {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  quality: Quality;
}

export const RunnerScene = forwardRef<RunnerHandle, Props>(({ onScore, onGameOver, quality }, ref) => {
  const robotState = useRef<RobotState>({ x: 0, y: 0, mode: 'run' });
  const fx = useRef<WorldFx>({ speed: 14 });
  const impact = useRef<Impact>({ t: -1, x: 0, z: 0 });
  const [obstacles] = useState(createPool);

  const g = useRef({
    playing: false,
    lane: 1,
    x: 0, // X visible del robot (se desliza hacia el carril)
    vy: 0,
    jumping: false,
    jumpBuffer: 0,
    slideT: 0,          // s que le quedan agachado
    slideQueued: false, // pidió deslizarse en el aire: se agacha al aterrizar
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
    s.lane = 1; s.x = LANES[1]; s.vy = 0; s.jumping = false; s.jumpBuffer = 0; s.slideT = 0; s.slideQueued = false;
    s.speed = s.cfg.speed; s.distance = 0; s.sinceSpawn = 0; s.gap = s.cfg.gap;
    s.obstacles.forEach((o) => { o.active = false; o.z = SPAWN_Z; });
    robotState.current.x = 0;
    robotState.current.y = 0;
    robotState.current.mode = 'run';
    impact.current = { t: -1, x: 0, z: 0 };
    onScore(0);
  };

  const spawn = () => {
    const s = g.current;
    const free = s.obstacles.find((o) => !o.active);
    if (!free) return;
    free.lane = Math.floor(Math.random() * 3);
    free.kind = s.distance > DRONES_FROM && Math.random() < s.cfg.high ? 'high' : 'low';
    free.z = SPAWN_Z;
    free.active = true;
  };

  useImperativeHandle(ref, () => ({
    start: (difficulty) => { g.current.cfg = DIFFICULTY[difficulty]; resetState(); g.current.playing = true; },
    reset: resetState,
    jump: () => {
      const s = g.current;
      if (!s.playing) return;
      if (s.jumping) { s.jumpBuffer = JUMP_BUFFER; s.slideQueued = false; return; }
      s.slideT = 0; // saltar cancela el deslizamiento
      s.jumping = true; s.vy = JUMP_V0; robotState.current.mode = 'jump';
    },
    slide: () => {
      const s = g.current;
      if (!s.playing) return;
      if (s.jumping) { s.vy = Math.min(s.vy, -FAST_FALL); s.slideQueued = true; s.jumpBuffer = 0; return; }
      s.slideT = SLIDE_TIME; robotState.current.mode = 'slide';
    },
    move: (dir) => {
      const s = g.current;
      s.lane = Math.max(0, Math.min(2, s.lane + dir));
    },
  }), []);

  useFrame((state, rawDt) => {
    const s = g.current;
    const dt = Math.min(0.05, rawDt);
    const dead = robotState.current.mode === 'dead';
    fx.current.speed = dead ? fx.current.speed * Math.max(0, 1 - dt * 3) : s.speed;
    s.x += (LANES[s.lane] - s.x) * Math.min(1, dt * 12);
    robotState.current.x = s.x;

    if (s.playing) {
      if (s.jumping) {
        s.vy -= GRAVITY * dt;
        robotState.current.y += s.vy * dt;
        if (robotState.current.y <= 0) {
          robotState.current.y = 0; s.jumping = false; s.vy = 0; robotState.current.mode = 'run';
          if (s.jumpBuffer > 0) { s.jumpBuffer = 0; s.jumping = true; s.vy = JUMP_V0; robotState.current.mode = 'jump'; }
          else if (s.slideQueued) { s.slideT = SLIDE_TIME; robotState.current.mode = 'slide'; }
          s.slideQueued = false;
        }
        s.jumpBuffer = Math.max(0, s.jumpBuffer - dt);
      } else if (s.slideT > 0) {
        s.slideT -= dt;
        if (s.slideT <= 0) { s.slideT = 0; robotState.current.mode = 'run'; }
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
        if (o.active && s.playing && hitsObstacle(o, s.x, robotState.current.y, s.slideT > 0)) {
          s.playing = false;
          robotState.current.mode = 'dead';
          impact.current = { t: state.clock.elapsedTime, x: (s.x + LANES[o.lane]) / 2, z: ROBOT_Z - 0.4 };
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
      <DroneField obstacles={obstacles} quality={quality} />
      <ImpactBurst impact={impact} />
    </>
  );
});

RunnerScene.displayName = 'RunnerScene';
