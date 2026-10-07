// Constantes compartidas entre la lógica (RunnerScene) y los visuales.
export const LANES = [-2.2, 0, 2.2];
export const ROBOT_Z = 0; // z donde se DIBUJA el robot (antes 3: el choque no coincidía con lo visible)
export const OBS_H = 1.2; // alto del obstáculo

export type Quality = 'high' | 'low';

/** Velocidad visual del mundo (se frena suavemente al morir). */
export interface WorldFx {
  speed: number;
}

/** Momento y lugar del último choque (t < 0 = ninguno), para los efectos. */
export interface Impact { t: number; x: number; z: number; }

export const COLORS = {
  fog: '#2a0809',
  horizon: '#ff5a2a',
  sky: '#070103',
  neon: '#ff3b30',
  amber: '#ff8a3d',
};
