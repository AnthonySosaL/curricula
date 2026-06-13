import { Suspense, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { ArrowLeft, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { getTopScores, submitScore, type ScoreEntry } from '@/lib/scores';
import { RunnerScene, type RunnerHandle } from './RunnerScene';
import { GameOverlay } from './GameOverlay';

type Status = 'start' | 'playing' | 'over';

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

  useEffect(() => {
    const m = window.matchMedia('(max-width: 900px), (pointer: coarse)');
    const fn = () => setIsMobile(m.matches);
    fn(); m.addEventListener('change', fn);
    return () => m.removeEventListener('change', fn);
  }, []);

  const refreshTop = () => { void getTopScores(5).then(setTop); };
  useEffect(refreshTop, []);

  // Controles de teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowleft' || k === 'a') game.current?.move(-1);
      else if (k === 'arrowright' || k === 'd') game.current?.move(1);
      else if (k === ' ' || k === 'arrowup' || k === 'w') { e.preventDefault(); game.current?.jump(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const play = () => { setSubmitted(false); setStatus('playing'); game.current?.start(); };

  const handleGameOver = (score: number) => {
    setFinalScore(score);
    setStatus('over');
    refreshTop();
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
    <div className="fixed inset-0 overflow-hidden bg-[radial-gradient(circle_at_50%_20%,#3b0a0a_0%,#160707_45%,#080203_100%)]">
      <Canvas
        dpr={[1, isMobile ? 1.5 : 2]}
        camera={{ position: [0, 4.2, 9], fov: 55 }}
        gl={{ antialias: !isMobile, powerPreference: 'high-performance' }}
        onCreated={({ camera }) => camera.lookAt(0, 1, 0)}
      >
        <Suspense fallback={null}>
          <RunnerScene
            ref={game}
            onScore={(n) => { if (scoreRef.current) scoreRef.current.textContent = String(n); }}
            onGameOver={handleGameOver}
          />
        </Suspense>
      </Canvas>

      {/* Top bar: volver + score */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between p-4 pointer-events-none">
        <Link
          to="/"
          className="pointer-events-auto flex items-center gap-1.5 text-sm text-white/80 hover:text-white bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/15"
        >
          <ArrowLeft size={15} /> {en ? 'Back' : 'Volver'}
        </Link>
        {status === 'playing' && (
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-white/50">{en ? 'Score' : 'Puntaje'}</p>
            <span ref={scoreRef} className="text-3xl font-bold text-white tabular-nums drop-shadow-lg">0</span>
          </div>
        )}
      </div>

      {/* Controles táctiles */}
      {status === 'playing' && isMobile && (
        <div className="absolute bottom-6 inset-x-0 flex items-center justify-center gap-4 px-6">
          <button onClick={() => game.current?.move(-1)} className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white active:bg-white/25">
            <ChevronLeft size={28} />
          </button>
          <button onClick={() => game.current?.jump()} className="flex-1 max-w-[180px] h-16 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 flex items-center justify-center text-white font-bold gap-1 active:brightness-110">
            <ChevronUp size={24} /> {en ? 'JUMP' : 'SALTA'}
          </button>
          <button onClick={() => game.current?.move(1)} className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white active:bg-white/25">
            <ChevronRight size={28} />
          </button>
        </div>
      )}

      {status !== 'playing' && (
        <GameOverlay
          mode={status === 'start' ? 'start' : 'over'}
          finalScore={finalScore}
          top={top}
          submitted={submitted}
          submitting={submitting}
          en={en}
          onPlay={play}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
