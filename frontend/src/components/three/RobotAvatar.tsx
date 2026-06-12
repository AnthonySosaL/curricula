import { Suspense, useEffect, useRef, useState, type RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_URL = '/models/RobotExpressive.glb';
const EMOTES = ['Wave', 'ThumbsUp', 'Jump', 'Yes', 'Dance'] as const;

type EmoteRef = RefObject<(() => void) | null>;

interface RobotModelProps {
  isMobile: boolean;
  onReady: () => void;
  emoteRef: EmoteRef;
}

function RobotModel({ isMobile, onReady, emoteRef }: RobotModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions, mixer } = useAnimations(animations, group);
  const emoteIdx = useRef(0);
  const busy = useRef(false);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => { onReady(); }, [onReady]);

  // Animacion base: Idle en loop
  useEffect(() => {
    const idle = actions.Idle;
    idle?.reset().fadeIn(0.4).play();
    return () => { idle?.stop(); };
  }, [actions]);

  // En desktop el robot sigue al cursor por toda la pagina
  useEffect(() => {
    if (isMobile) return;
    const fn = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', fn, { passive: true });
    return () => window.removeEventListener('mousemove', fn);
  }, [isMobile]);

  // Click/tap: reproduce un emote y vuelve a Idle al terminar
  useEffect(() => {
    emoteRef.current = () => {
      if (busy.current) return;
      const name = EMOTES[emoteIdx.current % EMOTES.length];
      emoteIdx.current += 1;
      const action = actions[name];
      const idle = actions.Idle;
      if (!action) return;
      busy.current = true;
      action.reset();
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      idle?.fadeOut(0.25);
      action.fadeIn(0.25).play();
      const onFinished = (e: { action: THREE.AnimationAction }) => {
        if (e.action !== action) return;
        mixer.removeEventListener('finished', onFinished);
        action.fadeOut(0.3);
        idle?.reset().fadeIn(0.3).play();
        busy.current = false;
      };
      mixer.addEventListener('finished', onFinished);
    };
    return () => { emoteRef.current = null; };
  }, [actions, mixer, emoteRef]);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const targetY = isMobile ? Math.sin(t * 0.7) * 0.35 : pointer.current.x * 0.7;
    const targetX = isMobile ? 0 : pointer.current.y * 0.15;
    const k = Math.min(1, dt * 5);
    g.rotation.y += (targetY - g.rotation.y) * k;
    g.rotation.x += (targetX - g.rotation.x) * k;
  });

  return (
    <group
      ref={group}
      position={[0, -2.15, 0]}
      scale={0.88}
      onClick={(e) => { e.stopPropagation(); emoteRef.current?.(); }}
    >
      <primitive object={scene} />
    </group>
  );
}

interface RobotAvatarProps {
  isMobile: boolean;
  onReady: () => void;
  className?: string;
}

export default function RobotAvatar({ isMobile, onReady, className }: RobotAvatarProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const emoteRef: EmoteRef = useRef(null);

  // Pausa el render 3D cuando el avatar sale de pantalla
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className={className}>
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        camera={{ fov: 45, position: [0, 0, 5.5] }}
        gl={{ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' }}
        style={{ touchAction: 'pan-y' }}
        onPointerMissed={() => emoteRef.current?.()}
        onCreated={({ gl }) => {
          // Si el navegador recicla el contexto WebGL (tab en segundo plano),
          // prevenir el default permite que three lo restaure en vez de quedar en negro
          gl.domElement.addEventListener('webglcontextlost', (e) => e.preventDefault(), false);
        }}
      >
        <hemisphereLight intensity={1.15} color="#e0f2fe" groundColor="#1e293b" />
        <directionalLight position={[2.5, 5, 4]} intensity={2.2} />
        <pointLight position={[-3, 1.5, -2.5]} intensity={10} distance={14} color="#f87171" />
        <Suspense fallback={null}>
          <RobotModel isMobile={isMobile} onReady={onReady} emoteRef={emoteRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
