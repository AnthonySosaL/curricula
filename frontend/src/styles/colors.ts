// ============================================================
// Paleta de colores — Psicología del color aplicada
// ============================================================
//
// AZUL PRIMARIO  → Confianza, conocimiento, profesionalismo.
//   Ideal para educación: transmite autoridad académica.
//
// VERDE ESMERALDA → Crecimiento, logro, progreso.
//   Refuerza la sensación de avance en el aprendizaje.
//
// ÁMBAR ACENTO   → Energía, atención, llamado a la acción.
//   Usado en botones CTA y elementos que requieren foco.
//
// ROJO           → Alertas, errores, eliminación.
//   Señal universal de peligro o acción destructiva.
//
// PIZARRA        → Fondos neutros y texto.
//   Proporciona contraste y legibilidad sin saturar.
// ============================================================

export const colors = {
  // ── Marca principal ─────────────────────────────────────
  primary: {
    50:  '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb', // ← base
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },

  // ── Éxito / Progreso ────────────────────────────────────
  success: {
    50:  '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a', // ← base
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // ── Acento / CTA ────────────────────────────────────────
  accent: {
    50:  '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // ← base
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // ── Error / Peligro ─────────────────────────────────────
  danger: {
    50:  '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // ← base
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // ── Advertencia ─────────────────────────────────────────
  warning: {
    400: '#fb923c',
    500: '#f97316', // ← base
    600: '#ea580c',
  },

  // ── Info ────────────────────────────────────────────────
  info: {
    400: '#38bdf8',
    500: '#0ea5e9', // ← base
    600: '#0284c7',
  },

  // ── Neutros (Pizarra) ───────────────────────────────────
  surface: {
    white:  '#ffffff',
    bg:     '#f8fafc', // slate-50 — fondo principal
    card:   '#ffffff', // tarjetas y modales
    border: '#e2e8f0', // slate-200
  },

  text: {
    primary:   '#0f172a', // slate-900 — texto principal
    secondary: '#475569', // slate-600 — texto auxiliar
    muted:     '#94a3b8', // slate-400 — placeholders
    inverse:   '#ffffff', // texto sobre fondos oscuros
  },
} as const;

// Tokens CSS para usar con Tailwind custom properties
export const cssTokens = {
  '--color-primary':     colors.primary[600],
  '--color-success':     colors.success[600],
  '--color-accent':      colors.accent[500],
  '--color-danger':      colors.danger[500],
  '--color-bg':          colors.surface.bg,
  '--color-text':        colors.text.primary,
  '--color-text-muted':  colors.text.muted,
  '--color-border':      colors.surface.border,
} as const;
