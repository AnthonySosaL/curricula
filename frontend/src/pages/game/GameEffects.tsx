import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

/**
 * Postprocesado barato: bloom con mipmap blur (solo brillan los neones,
 * umbral alto) + viñeta. El MSAA del composer hace de antialias.
 * Se carga en un chunk aparte y solo en escritorio.
 */
export default function GameEffects() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.85} luminanceSmoothing={0.2} radius={0.6} />
      <Vignette offset={0.3} darkness={0.65} />
    </EffectComposer>
  );
}
