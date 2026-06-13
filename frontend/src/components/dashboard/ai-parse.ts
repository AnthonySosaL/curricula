// ============================================================
// Parsing del análisis ejecutivo de la IA — funciones puras
// (extraído de BusinessDashboard para mantener el componente liviano)
// ============================================================

export interface ParsedAiResponse {
  resumen: string;
  hallazgos: string[];
  riesgos: string[];
  oportunidades: string[];
  recomendaciones: string[];
  conclusion: string;
}

function parseListBlock(input: string) {
  return input
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-*\d.)\s]+/, '').trim())
    .filter(Boolean);
}

// Limpia markdown residual (negritas, código, asteriscos sueltos)
export function stripMd(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*+/g, '')
    .trim();
}

const TAG_ALIASES: Record<keyof ParsedAiResponse, string[]> = {
  resumen:        ['RESUMEN EJECUTIVO', 'EXECUTIVE SUMMARY', 'RESUMEN', 'SUMMARY'],
  hallazgos:      ['HALLAZGOS', 'FINDINGS'],
  riesgos:        ['RIESGOS', 'RISKS'],
  oportunidades:  ['OPORTUNIDADES', 'OPPORTUNITIES'],
  recomendaciones:['RECOMENDACIONES', 'RECOMMENDATIONS'],
  conclusion:     ['CONCLUSION FINAL', 'CONCLUSION EJECUTIVA', 'CONCLUSIONES', 'CONCLUSION'],
};

const ALIAS_TO_KEY = new Map<string, keyof ParsedAiResponse>();
for (const [key, aliases] of Object.entries(TAG_ALIASES)) {
  for (const alias of aliases) {
    ALIAS_TO_KEY.set(alias.toUpperCase(), key as keyof ParsedAiResponse);
  }
}

// Detecta marcadores de sección en cualquier formato: [TAG] **TAG** ## TAG
const ALL_ALIASES = [...ALIAS_TO_KEY.keys()].join('|');
const TAG_LINE_RE = new RegExp(
  `^\\s*(?:\\[(?:${ALL_ALIASES})\\]|\\*\\*\\s*(?:${ALL_ALIASES})\\s*\\*\\*|#{1,3}\\s*(?:${ALL_ALIASES}))\\s*:?\\s*$`,
  'i',
);

function identifyTag(line: string): keyof ParsedAiResponse | null {
  if (!TAG_LINE_RE.test(line)) return null;
  const clean = line
    .replace(/^\s*#{1,3}\s*/, '')
    .replace(/\*\*/g, '')
    .replace(/[\[\]]/g, '')
    .replace(/:$/, '')
    .trim()
    .toUpperCase();
  return ALIAS_TO_KEY.get(clean) ?? null;
}

// Parser por líneas (inmune al bug de $ multiline en regex)
export function parseAiResponse(text: string): ParsedAiResponse | null {
  const lines = text.replace(/\r\n/g, '\n').split('\n');

  const buckets: Record<keyof ParsedAiResponse, string[]> = {
    resumen: [], hallazgos: [], riesgos: [],
    oportunidades: [], recomendaciones: [], conclusion: [],
  };

  let current: keyof ParsedAiResponse | null = null;
  for (const line of lines) {
    const tag = identifyTag(line);
    if (tag !== null) { current = tag; continue; }
    if (current !== null) buckets[current].push(line);
  }

  const getText = (key: keyof ParsedAiResponse) => stripMd(buckets[key].join('\n').trim());

  const resumen        = getText('resumen');
  const hallazgos      = parseListBlock(getText('hallazgos')).map(stripMd);
  const riesgos        = parseListBlock(getText('riesgos')).map(stripMd);
  const oportunidades  = parseListBlock(getText('oportunidades')).map(stripMd);
  const recomendaciones = parseListBlock(getText('recomendaciones')).map(stripMd);
  const conclusion     = getText('conclusion');

  if (!resumen && !hallazgos.length && !riesgos.length
    && !oportunidades.length && !recomendaciones.length && !conclusion) {
    return null;
  }

  return { resumen, hallazgos, riesgos, oportunidades, recomendaciones, conclusion };
}

export function hasStructuredContent(parsed: ParsedAiResponse | null): parsed is ParsedAiResponse {
  if (!parsed) return false;
  return Boolean(
    parsed.resumen
    || parsed.hallazgos.length
    || parsed.riesgos.length
    || parsed.oportunidades.length
    || parsed.recomendaciones.length
    || parsed.conclusion,
  );
}
