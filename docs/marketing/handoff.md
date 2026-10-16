# Handoff — Tráfico, SEO y AdSense (ATLAS Lab, Certis, Praxis TOGAF, portafolio)

Actualizado: 2026-10-16 (tarde). Para continuar en otro chat: lee este archivo primero.

## Reglas de trabajo (las pidió Anthony)

- Responder siempre en **español**.
- Cambios quirúrgicos, no romper lógica existente, archivos < 200 líneas, reutilizar código (skill dev-engineering-rules).
- **No inventar datos**: de los proyectos solo usar lo que está en el código o en `frontend/src/data/portfolio.ts`; para lo demás, información general verificable con fuente.
- Trabajar en rama nueva, compilar antes de cada commit, push y PR; Anthony mergea.
- **No proponer campañas en redes, guiones de video ni posts** si no lo pide. El canal de YouTube/Instagram será solo de ATLAS y él decide la estrategia.
- Nunca commitear secretos (ConnectionStrings, Jwt, Groq viven solo en el `web.config` del servidor).

## Sitios

| Sitio | URL | Hosting | Repo |
|---|---|---|---|
| Portafolio | https://curricula-fawn.vercel.app | Vercel (auto-deploy al mergear) | `AnthonySosaL/curricula` (`frontend/`) |
| ATLAS Lab | https://atlas-lab-one.vercel.app | Vercel (Next.js 16) | `AnthonySosaL/atlas-lab` |
| Certis | https://english-c1.runasp.net | MonsterASP site87768 (Angular prerender estático, deploy manual de `dist/client-frontend/browser`) | `AnthonySosaL/certis-platform` |
| Praxis TOGAF | https://praxis-togaf.runasp.net | MonsterASP site89009 (+ back site89010) | `AnthonySosaL/praxis-togaf` |

IDs: AdSense `ca-pub-6972285940439853` · GA4 `G-N2H066P5K6` · Search Console verificado con `googlecb9810bcd7d450e8.html` en los 4.

## Lo que ya está hecho

**En los 4 sitios:** metadatos SEO + Open Graph + JSON-LD, `robots.txt`, `sitemap.xml`, `adsense.js` + `ads.txt`, `analytics.js` (GA4), enlaces cruzados entre proyectos, enlace a `/privacidad/`.

**Portafolio (`frontend/public/`):**
- Landings: `/proyectos/{atlas-lab,certis,praxis-togaf}/` y versión `/en/`.
- `/articulos/` (índice) + 18 artículos en `/articulos/<slug>/` (inglés Cambridge, TOGAF, trading cuantitativo). Formato: `landing.css`, adsense, analytics, JSON-LD Article, FAQ, CTA con UTM, footer con fuentes y Privacidad.
- `/sobre-mi/` (autor y contacto, JSON-LD Person) y `/privacidad/`.
- `index.html`: texto estático dentro de `#root` para Google (React lo reemplaza al cargar).
- `src/pages/portfolio/sections/FooterResources.tsx`: lista ARTICLES (label = H1 de cada artículo) + enlaces a `/articulos/` y `/sobre-mi/`.
- `frontend/vercel.json`: rewrite que sirve los HTML estáticos de `articulos`, `proyectos`, `privacidad`, `sobre-mi` antes del catch-all de la SPA. **Sin esto daban 404** (pasó hasta el 12-oct).

**ATLAS:** `src/app/sitemap.ts` con `lastModified` solo fecha (Search Console marcaba 91 fechas no válidas; arreglado en atlas-lab PR #4, mergeado).

**Certis:** prerender de `/` y `/about`; `public/web.config` reescribe a `/index.csr.html`.

**Search Console:** sitemaps enviados en los 4 (portafolio, ATLAS, Certis y Praxis en "Correcto").

## Estado al 16-oct

- PR #16 (Sharpe vs Sortino, Writing B2 First) mergeado. Rama `claude/articulos-speaking-b2-phrasal-c1`: Speaking del B2 First y phrasal verbs del C1 (sitemap con 28 URLs).
- **AdSense:** cuenta **no aprobada** (12-oct) por contenido/navegación. Causa probable: artículos daban 404 durante la revisión y la portada no tenía texto sin JavaScript. Ya corregido. **No reenviar todavía.**
- **Indexación (13-oct):** portafolio 2 indexadas / 12 sin indexar; ATLAS 13 / 84. "Solicitar indexación" da "cuota superada" casi siempre; se reinicia a las 2:00 a.m. hora Ecuador.
- **runasp.net (Certis, Praxis):** AdSense no los acepta (subdominio de MonsterASP). Solo con dominio propio.
- **Tráfico (GA4):** todo "Direct", aún sin "Organic Search".

## Qué verificar (y cada cuánto)

| Cada | Dónde | Qué mirar |
|---|---|---|
| 2–3 días | Search Console → Páginas (portafolio y ATLAS) | Que "Indexadas" suba. "Rastreada: sin indexar" de páginas que antes eran 404 debería resolverse sola. |
| 2–3 días | Search Console → Sitemaps | Portafolio: "Páginas descubiertas" debe llegar a 26+. ATLAS: sin errores de fecha tras reenviar. |
| 1 intento/día, después de las 2 a.m. | Search Console → Inspeccionar URL | Pedir indexación de 1–3 URLs prioritarias (`/articulos/`, `/sobre-mi/`, artículos nuevos). Si "cuota superada", no insistir. |
| Semanal | Google: `site:curricula-fawn.vercel.app` | Qué páginas aparecen ya. |
| Semanal | GA4 → Informes → Adquisición → Adquisición de tráfico | Si aparece "Organic Search" y qué páginas reciben visitas. |
| Semanal | AdSense → Sitios | Estado. **Reenviar** solo cuando haya artículos indexados (≈ 7–10 días desde el 13-oct y unos 20+ artículos). |

Pendiente opcional de Anthony: en GA4 aceptar "Vincular Search Console"; poner la URL del portafolio en el campo Website de GitHub y LinkedIn (solo editar perfil).

## Próximos artículos (en este orden)

Cómo calcular el drawdown máximo (ATLAS) · un tema de TOGAF (Praxis). Hechos: Speaking del B2 First, Phrasal verbs del C1. Luego seguir alternando temas de Certis (inglés), Praxis (TOGAF) y ATLAS (trading).

Al crear uno: carpeta `frontend/public/articulos/<slug>/index.html` con el formato de los existentes, y añadirlo a **`public/sitemap.xml`**, a **ARTICLES en `FooterResources.tsx`** y al **índice `public/articulos/index.html`** (en su grupo). Luego `npm install --no-package-lock`, `npx tsc --noEmit -p .`, `npm run build`, validar JSON-LD y enlaces internos, commit, PR.

## Problemas conocidos

- Vercel falló una vez al desplegar (PR #13) sin causa en el código; si vuelve a fallar, revisar el log en vercel.com.
- `npm warn install-scripts` (sharp, unrs-resolver) en ATLAS es inofensivo.
- Angular CLI de Certis necesita Node ≥ 22.22.3. Al desplegar Certis subir solo `dist/client-frontend/browser` (incluye `web.config`, `about/`, `index.csr.html`), nunca `node_modules`.
