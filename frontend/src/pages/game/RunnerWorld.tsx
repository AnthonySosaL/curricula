import { useEffect, useMemo, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS, type Quality } from './config';
import { sunTexture } from './textures';

const SKY_VERT = /* glsl */ `
  varying vec3 vPos;
  void main() {
    vPos = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`;
const SKY_FRAG = /* glsl */ `
  uniform vec3 top; uniform vec3 horizon; uniform vec3 bottom;
  varying vec3 vPos;
  void main() {
    float h = vPos.y;
    vec3 c = h > 0.0
      ? mix(horizon, top, pow(smoothstep(0.0, 0.55, h), 0.6))
      : mix(horizon, bottom, smoothstep(0.0, 0.08, -h));
    gl_FragColor = vec4(c, 1.0);
    #include <colorspace_fragment>
  }`;

/** Cúpula de cielo con degradado (1 draw call, sin texturas). */
function SkyDome() {
  const uniforms = useMemo(() => ({
    top: { value: new THREE.Color(COLORS.sky) },
    horizon: { value: new THREE.Color('#7a1414') },
    bottom: { value: new THREE.Color(COLORS.fog) },
  }), []);
  return (
    <mesh renderOrder={-1} frustumCulled={false}>
      <sphereGeometry args={[160, 24, 12]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={SKY_VERT}
        fragmentShader={SKY_FRAG}
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
      />
    </mesh>
  );
}

function Sun() {
  const tex = useMemo(() => sunTexture(), []);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh position={[0, 14, -140]}>
      <planeGeometry args={[60, 60]} />
      <meshBasicMaterial map={tex} transparent fog={false} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

/** Paneles de luz (rect) para el env map: [color, intensidad, x, y, z, ancho, alto]. */
const PANELS: [string, number, number, number, number, number, number][] = [
  ['#ffe2d0', 2.2, 0, 6, 8, 10, 3],
  [COLORS.horizon, 1.6, 0, 1.5, -12, 24, 2],
  [COLORS.neon, 1.2, -8, 2, 0, 1, 4],
  [COLORS.neon, 1.2, 8, 2, 0, 1, 4],
];

/**
 * Env map propio: una mini-escena con paneles emisivos pasada por PMREM una
 * sola vez. Da reflejos a los metales PBR sin descargar HDRs ni cargadores.
 */
function buildEnvironment(gl: THREE.WebGLRenderer) {
  const room = new THREE.Scene();
  room.background = new THREE.Color('#140405');
  const geo = new THREE.PlaneGeometry(1, 1);
  const mats: THREE.Material[] = [];
  for (const [color, k, x, y, z, w, h] of PANELS) {
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide });
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z); m.scale.set(w, h, 1); m.lookAt(0, 1, 0);
    room.add(m); mats.push(mat);
  }
  const pmrem = new THREE.PMREMGenerator(gl);
  const env = pmrem.fromScene(room, 0.04).texture;
  geo.dispose(); mats.forEach((m) => m.dispose()); pmrem.dispose();
  return env;
}

function StudioEnvironment() {
  const gl = useThree((s) => s.gl);
  const env = useMemo(() => buildEnvironment(gl), [gl]);
  useEffect(() => () => env.dispose(), [env]);
  return <primitive object={env} attach="environment" />;
}

/**
 * Iluminación: hemisférica + luz clave con sombras acotadas a la zona de juego
 * + contraluz cálido desde el sol. El environment map se genera con
 * paneles emisivos propios (ver StudioEnvironment).
 */
export function RunnerWorld({ quality }: { quality: Quality }) {
  const key = useRef<THREE.DirectionalLight>(null);
  const high = quality === 'high';

  useEffect(() => {
    const l = key.current;
    if (!l) return;
    l.target.position.set(0, 0, -3);
    l.target.updateMatrixWorld();
    const cam = l.shadow.camera;
    cam.left = -6; cam.right = 6; cam.top = 10; cam.bottom = -10;
    cam.near = 1; cam.far = 30;
    cam.updateProjectionMatrix();
    l.shadow.bias = -0.0005;
    l.shadow.normalBias = 0.02;
    l.shadow.radius = 4;
  }, []);

  return (
    <>
      <StudioEnvironment />
      <SkyDome />
      <Sun />
      <hemisphereLight intensity={0.55} color="#ffd9cc" groundColor="#2a0606" />
      <directionalLight
        ref={key}
        position={[4, 10, 8]}
        intensity={2.4}
        color="#fff1e6"
        castShadow={high}
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[0, 6, -30]} intensity={1.6} color={COLORS.amber} />
    </>
  );
}
