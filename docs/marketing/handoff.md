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

## Pendiente técnico (para la próxima sesión)

1. Dentro de los repos de ATLAS Lab (Next.js) y Certis (Angular): SEO propio (title/description, Open Graph, sitemap, robots, JSON-LD) y AdSense con el mismo ID.
2. En Certis (SPA Angular): prerender o SSR de la home para que Google la indexe.
3. Enlaces cruzados: ATLAS ↔ Certis ↔ portafolio (footer "Otros proyectos").
4. Versiones en inglés de las landings y artículos SEO (Deflated Sharpe, B2 vs C1, speaking C1).
5. Banner de consentimiento (GDPR) si no se activa el de AdSense.
6. Con el `ca-pub` real: reemplazarlo en `adsense.js` y `ads.txt` de todos los repos.
