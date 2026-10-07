import { LANES, ROBOT_Z } from './config';

// Reglas del juego (física, dificultad y colisión), separadas de la escena.
export type Difficulty = 'easy' | 'medium' | 'hard';

/** 'low' = barrera en el suelo (saltar o esquivar); 'high' = dron a la altura de la cabeza (deslizarse o esquivar). */
export type ObstacleKind = 'low' | 'high';
export interface Obstacle { lane: number; z: number; active: boolean; kind: ObstacleKind; }

export const SPAWN_Z = -48;
export const DESPAWN_Z = 9;
export const POOL = 8;
export const JUMP_V0 = 9.6;      // más impulso = más tiempo en el aire
export const GRAVITY = 20;       // gravedad suave = salto indulgente
export const FAST_FALL = 16;     // deslizar en el aire = caer rápido (estilo Subway Surfers)
export const SLIDE_TIME = 0.75;  // s agachado
export const JUMP_BUFFER = 0.15; // s: un salto pedido justo antes de aterrizar se ejecuta al tocar suelo
export const DRONES_FROM = 60;   // m: los drones aparecen tras aprender a saltar

const CLEAR_Y = 0.9;   // si los pies pasan esta altura, libra la barrera
const HIT_Z = 0.6;     // ventana de colisión en Z (ajustada al obstáculo)
const HIT_X = 0.95;    // choque solo si el robot (posición visible) está realmente dentro del carril

export const DIFFICULTY: Record<Difficulty, { speed: number; ramp: number; cap: number; gap: number; high: number }> = {
  easy: { speed: 10, ramp: 0.4, cap: 23, gap: 11, high: 0.2 },
  medium: { speed: 14, ramp: 0.7, cap: 32, gap: 9, high: 0.3 },
  hard: { speed: 18, ramp: 1.0, cap: 40, gap: 7.5, high: 0.35 },
};

export const createPool = () =>
  Array.from({ length: POOL }, (): Obstacle => ({ lane: 0, z: SPAWN_Z, active: false, kind: 'low' }));

/**
 * ¿El robot (X visible, altura de los pies, agachado o no) toca el obstáculo?
 * - Barrera: se libra si los pies van por encima de CLEAR_Y.
 * - Dron: se libra solo agachado (de pie o saltando la cabeza lo golpea).
 */
export function hitsObstacle(o: Obstacle, x: number, y: number, sliding: boolean) {
  if (Math.abs(LANES[o.lane] - x) >= HIT_X || Math.abs(o.z - ROBOT_Z) >= HIT_Z) return false;
  return o.kind === 'low' ? y < CLEAR_Y : !sliding;
}
