/**
 * Registro global de "fases pineadas" (Skills, Experience, ScrollStorySection).
 * Cada seccion registra su rango de scroll (top absoluto + alto scrolleable +
 * cantidad de fases) para que un unico controlador (ScrollSnapController)
 * pueda saber, en cualquier punto del documento, si el usuario quedo
 * "a medio camino" entre dos fases o dos secciones — y en ese caso, cuando
 * deja de scrollear, completar el desplazamiento hacia el lado mas cercano
 * en vez de dejarlo ahi.
 */

export interface SnapSpan {
  top: number;
  scrollable: number;
  phaseCount: number;
}

type SpanGetter = () => SnapSpan | null;

const registry = new Map<string, SpanGetter>();

export function registerSnapSpan(id: string, getter: SpanGetter): () => void {
  registry.set(id, getter);
  return () => {
    if (registry.get(id) === getter) registry.delete(id);
  };
}

function getSpans(): SnapSpan[] {
  const spans: SnapSpan[] = [];
  registry.forEach((getter) => {
    const span = getter();
    if (span && span.scrollable > 0 && span.phaseCount > 0) spans.push(span);
  });
  return spans.sort((a, b) => a.top - b.top);
}

/** Puntos "asentados": el centro de cada fase, donde su contenido esta 100% visible. */
export function getSettledPoints(): number[] {
  const points: number[] = [];
  for (const { top, scrollable, phaseCount } of getSpans()) {
    for (let i = 0; i < phaseCount; i++) {
      points.push(top + ((i + 0.5) / phaseCount) * scrollable);
    }
  }
  return points;
}

/** Puntos "de transicion": limites entre fases y entre secciones contiguas. */
export function getBoundaryPoints(): number[] {
  const spans = getSpans();
  const points: number[] = [];
  for (const { top, scrollable, phaseCount } of spans) {
    for (let i = 1; i < phaseCount; i++) {
      points.push(top + (i / phaseCount) * scrollable);
    }
  }
  for (let i = 0; i < spans.length - 1; i++) {
    const end = spans[i].top + spans[i].scrollable;
    // Las secciones son contiguas en el flujo normal del documento, asi que
    // el final de una coincide (o casi) con el inicio de la siguiente.
    points.push((end + spans[i + 1].top) / 2);
  }
  return points;
}
