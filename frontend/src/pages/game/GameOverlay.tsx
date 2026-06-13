import { useState } from 'react';
import { Play, RotateCcw, Trophy } from 'lucide-react';
import type { ScoreEntry } from '@/lib/scores';

interface Props {
  mode: 'start' | 'over';
  finalScore: number;
  top: ScoreEntry[];
  submitted: boolean;
  submitting: boolean;
  en: boolean;
  onPlay: () => void;
  onSubmit: (name: string) => void;
}

function Leaderboard({ top, en }: { top: ScoreEntry[]; en: boolean }) {
  return (
    <div className="w-full">
      <p className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-[0.2em] text-amber-300/90 mb-2">
        <Trophy size={13} /> {en ? 'Top scores' : 'Mejores puntajes'}
      </p>
      {top.length === 0 ? (
        <p className="text-center text-white/40 text-xs">{en ? 'Be the first!' : '¡Sé el primero!'}</p>
      ) : (
        <ol className="space-y-1">
          {top.slice(0, 5).map((e, i) => (
            <li key={`${e.name}-${e.createdAt}`} className="flex items-center justify-between text-sm bg-white/5 rounded-lg px-3 py-1.5">
              <span className="flex items-center gap-2 text-white/85 truncate">
                <span className={`w-5 text-center font-bold ${i === 0 ? 'text-amber-300' : 'text-white/40'}`}>{i + 1}</span>
                <span className="truncate">{e.name}</span>
              </span>
              <span className="font-bold tabular-nums text-white">{e.score}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export function GameOverlay({ mode, finalScore, top, submitted, submitting, en, onPlay, onSubmit }: Props) {
  const [name, setName] = useState(() => localStorage.getItem('runner_name') ?? '');
  const isHighEnough = top.length < 5 || finalScore > (top[top.length - 1]?.score ?? 0);

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center px-4 bg-black/55 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-red-500/30 bg-[#160707]/95 p-6 text-center shadow-2xl">
        {mode === 'start' ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-1">Robot Runner</h2>
            <p className="text-sm text-white/60 mb-4">
              {en
                ? 'Dodge or jump the red barriers. It gets faster!'
                : 'Esquiva o salta las barreras rojas. ¡Cada vez más rápido!'}
            </p>
            <p className="text-[11px] text-white/45 mb-5">
              {en ? '← → / A D to move · Space / ↑ / tap to jump' : '← → / A D para moverte · Espacio / ↑ / toca para saltar'}
            </p>
          </>
        ) : (
          <>
            <p className="text-xs uppercase tracking-[0.2em] text-red-300/80 mb-1">{en ? 'Game over' : 'Fin del juego'}</p>
            <p className="text-5xl font-bold text-white tabular-nums mb-1">{finalScore}</p>
            <p className="text-xs text-white/50 mb-4">{en ? 'points' : 'puntos'}</p>

            {!submitted && isHighEnough && (
              <div className="flex gap-2 mb-4">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={16}
                  placeholder={en ? 'Your name' : 'Tu nombre'}
                  className="flex-1 min-w-0 text-sm px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:border-red-400"
                />
                <button
                  onClick={() => onSubmit(name)}
                  disabled={submitting || !name.trim()}
                  className="px-3 py-2 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-40 whitespace-nowrap"
                >
                  {submitting ? '...' : (en ? 'Save' : 'Guardar')}
                </button>
              </div>
            )}
            {submitted && (
              <p className="text-sm text-green-300 mb-4">{en ? 'Score saved! 🎉' : '¡Puntaje guardado! 🎉'}</p>
            )}
          </>
        )}

        <div className="mb-5"><Leaderboard top={top} en={en} /></div>

        <button
          onClick={onPlay}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold hover:brightness-110 transition-all"
        >
          {mode === 'start' ? <Play size={18} /> : <RotateCcw size={18} />}
          {mode === 'start' ? (en ? 'Play' : 'Jugar') : (en ? 'Play again' : 'Jugar de nuevo')}
        </button>
      </div>
    </div>
  );
}
