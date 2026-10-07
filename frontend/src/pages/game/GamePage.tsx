import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { getTopScores, submitScore, type ScoreEntry } from '@/lib/scores';
import { RunnerScene, type RunnerHandle, type Difficulty } from './RunnerScene';
import { GameOverlay } from './GameOverlay';
import { GameCanvas } from './GameCanvas';
import { ControlsHint } from './ControlsHint';
import { CrashFlash } from './CrashFlash';
import { useGameControls, buzz } from './useGameControls';

// 'crashed': animación del choque antes de mostrar el menú de fin de partida
type Status = 'start' | 'playing' | 'crashed' | 'over';
const CRASH_MS = 1300;

export default function GamePage() {
  const { language } = useI18n();
  const en = language === 'en';
  const game = useRef<RunnerHandle>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const [status, setStatus] = useState<Status>('start');
  const [finalScore, setFinalScore] = useState(0);
  const [top, setTop] = useState<ScoreEntry[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  useEffect(() => {
    const m = window.matchMedia('(max-width: 900px), (pointer: coarse)');
    const fn = () => setIsMobile(m.matches);
    fn(); m.addEventListener('change', fn);
    return () => m.removeEventListener('change', fn);
  }, []);

  const refreshTop = () => { void getTopScores(5).then(setTop); };
  useEffect(refreshTop, []);

  // Teclado + gestos táctiles (deslizar) sobre toda la pantalla
  const surface = useRef<HTMLDivElement>(null);
  const [runId, setRunId] = useState(0);
  useGameControls(game, surface, status === 'playing');

  const play = () => {
    setSubmitted(false); setStatus('playing'); setRunId((n) => n + 1);
    game.current?.start(difficulty);
  };

  const crashTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(crashTimer.current), []);

  const handleGameOver = (score: number) => {
    buzz(60);
    setFinalScore(score);
    setStatus('crashed');
    refreshTop();
    crashTimer.current = window.setTimeout(() => setStatus('over'), CRASH_MS);
  };

  const handleSubmit = async (name: string) => {
    setSubmitting(true);
    try {
      localStorage.setItem('runner_name', name.trim());
      await submitScore(name.trim(), finalScore);
      setSubmitted(true);
      refreshTop();
    } catch {
      setSubmitted(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      ref={surface}
      className={`fixed inset-0 overflow-hidden overscroll-none bg-[radial-gradient(circle_at_50%_20%,#3b0a0a_0%,#160707_45%,#080203_100%)] ${status === 'playing' ? 'touch-none select-none' : ''}`}
    >
      <GameCanvas>
        {(quality) => (
          <RunnerScene
            ref={game}
            quality={quality}
            onScore={(n) => { if (scoreRef.current) scoreRef.current.textContent = String(n); }}
            onGameOver={handleGameOver}
          />
        )}
      </GameCanvas>

      {/* Top bar: volver + score (z-30 para quedar SOBRE el overlay) */}
      <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between p-4 pointer-events-none">
        <Link
          to="/"
          className="pointer-events-auto flex items-center gap-1.5 text-sm text-white/80 hover:text-white bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/15"
        >
          <ArrowLeft size={15} /> {en ? 'Back' : 'Volver'}
        </Link>
        {(status === 'playing' || status === 'crashed') && (
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-white/50">{en ? 'Score' : 'Puntaje'}</p>
            <span ref={scoreRef} className="text-3xl font-bold text-white tabular-nums drop-shadow-lg">0</span>
          </div>
        )}
      </div>

      {status === 'playing' && <ControlsHint key={runId} en={en} touch={isMobile} />}

      {status === 'crashed' && <CrashFlash en={en} />}

      {(status === 'start' || status === 'over') && (
        <GameOverlay
          mode={status === 'start' ? 'start' : 'over'}
          finalScore={finalScore}
          top={top}
          submitted={submitted}
          submitting={submitting}
          en={en}
          difficulty={difficulty}
          onDifficulty={setDifficulty}
          onPlay={play}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
