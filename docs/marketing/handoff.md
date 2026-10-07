# Handoff — Difusión de ATLAS Lab y Certis + AdSense

## Lo que ya está hecho (repo `curricula`, rama `claude/optimistic-darwin-m9w3n5`)

| Archivo | Para qué |
|---------|----------|
| `frontend/public/proyectos/atlas-lab/index.html` | Landing SEO de ATLAS Lab (HTML estático, JSON-LD, FAQ, CTA con UTM) |
| `frontend/public/proyectos/certis/index.html` | Landing SEO de Certis (igual) |
| `frontend/public/proyectos/landing.css` | Estilos compartidos de las landings |
| `frontend/public/adsense.js` | Cargador único de AdSense. Inactivo hasta poner el ID real `ca-pub-...` |
| `frontend/public/ads.txt` | Falta reemplazar `pub-XXXXXXXXXXXXXXXX` |
| `frontend/public/robots.txt` y `sitemap.xml` | Indexación en Google |
| `frontend/index.html` | Se agregó `<script src="/adsense.js">` y link al sitemap |
| `docs/marketing/plan-difusion.md` | Pasos de AdSense/Search Console, calendario y posts listos |

Sitio: https://curricula-fawn.vercel.app · ATLAS: https://atlas-lab-one.vercel.app · Certis: https://english-c1.runasp.net

## Pendiente del dueño (Anthony)

1. Crear cuenta AdSense y obtener `ca-pub-...` (probable que pida dominio propio; `*.vercel.app` suele ser rechazado).
2. Alta en Google Search Console + enviar `sitemap.xml`.
3. Publicar los posts del plan.
4. Confirmar si Certis es gratis (si sí, usarlo como gancho principal).
5. Mergear la rama.

## Hecho en la sesión 2 (2026-10-07, rama `claude/epic-cannon-1kdgaj` en los 3 repos)

- **atlas-lab**: metadata + Open Graph (descripción calculada de los datos), `generateMetadata` por experimento, `sitemap.ts`, `robots.ts`, JSON-LD, `public/adsense.js` + `ads.txt`, footer "Otros proyectos" con UTM.
- **certis-platform**: prerender estático de `/` y `/about` (`@angular/ssr`, `outputMode: static`, sin servidor Node), meta/OG/JSON-LD, títulos por ruta, `robots.txt`, `sitemap.xml`, `public/web.config` (fallback a `index.csr.html`), AdSense + `ads.txt`, footer "Other projects".
- **curricula**: landings en inglés (`/proyectos/*/en/`) con hreflang, 3 artículos en `/articulos/` (Deflated Sharpe, B2 vs C1, speaking C1), sitemap actualizado.

## Pendiente técnico

1. Con el `ca-pub` real: reemplazarlo en `adsense.js` y `ads.txt` de los 3 repos.
2. Banner de consentimiento (GDPR) si no se activa el de AdSense.
3. Certis: el próximo deploy debe subir el `dist/` completo (incluye `web.config`, `about/` e `index.csr.html`).
