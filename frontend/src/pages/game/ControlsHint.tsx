import { useEffect, useState } from 'react';
import { ArrowBigDown, ArrowBigLeft, ArrowBigRight, ArrowBigUp, Hand } from 'lucide-react';

/** Pista de controles que aparece al empezar cada partida y se desvanece sola. */
export function ControlsHint({ en, touch }: { en: boolean; touch: boolean }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const id = window.setTimeout(() => setVisible(false), 3200);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-[18%] z-20 flex justify-center px-4 transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="flex items-center gap-3 rounded-2xl bg-black/35 px-4 py-2.5 text-white/90 backdrop-blur-sm border border-white/10">
        {touch && <Hand size={20} className="animate-pulse text-orange-300" />}
        <span className="flex items-center gap-1">
          <ArrowBigLeft size={18} /><ArrowBigUp size={18} /><ArrowBigDown size={18} /><ArrowBigRight size={18} />
        </span>
        <span className="text-xs sm:text-sm font-medium">
          {touch
            ? (en ? 'Swipe ← → to dodge · ↑ or tap to jump · ↓ to slide under drones' : 'Desliza ← → para esquivar · ↑ o toca para saltar · ↓ para pasar bajo los drones')
            : (en ? '← → to dodge · Space / ↑ to jump · ↓ to slide under drones' : '← → para esquivar · Espacio / ↑ para saltar · ↓ para pasar bajo los drones')}
        </span>
      </div>
    </div>
  );
}
