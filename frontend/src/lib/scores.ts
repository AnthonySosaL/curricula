import { api } from './api';

export interface ScoreEntry {
  name: string;
  score: number;
  createdAt: string;
}

export interface SubmitResult {
  rank: number;
  best: number;
}

export async function submitScore(name: string, score: number): Promise<SubmitResult> {
  const res = await api.post<SubmitResult>('/scores', { name, score: Math.floor(score) });
  return res.data;
}

export async function getTopScores(limit = 5): Promise<ScoreEntry[]> {
  const res = await api.get<ScoreEntry[]>(`/scores/top?limit=${limit}`);
  return Array.isArray(res.data) ? res.data : [];
}
