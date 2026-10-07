// Constantes compartidas entre la lógica (RunnerScene) y los visuales.
export const LANES = [-2.2, 0, 2.2];
export const ROBOT_Z = 3;
export const OBS_H = 1.2; // alto del obstáculo

export type Quality = 'high' | 'low';

/** Velocidad visual del mundo (se frena suavemente al morir). */
export interface WorldFx {
  speed: number;
}

export const COLORS = {
  fog: '#2a0809',
  horizon: '#ff5a2a',
  sky: '#070103',
  neon: '#ff3b30',
  amber: '#ff8a3d',
};
