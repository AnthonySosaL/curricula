/**
 * Allowlist de origenes permitidos para CORS y verificacion de Origin.
 * En produccion solo el frontend publicado (FRONTEND_URL);
 * en desarrollo se suman los puertos locales de Vite.
 */
export function getAllowedOrigins(): string[] {
  const isProd = process.env['NODE_ENV'] === 'production';
  const origins = [
    process.env['FRONTEND_URL'],
    ...(isProd ? [] : ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174']),
  ].filter((o): o is string => Boolean(o));

  return origins.map((o) => o.replace(/\/+$/, ''));
}
