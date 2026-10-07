# Plan de difusión — ATLAS Lab y Certis

Objetivo: llevar visitas a las páginas `/proyectos/atlas-lab/` y `/proyectos/certis/`
(que tienen AdSense) y desde ahí a las apps en vivo. Todos los links llevan UTM
para medir qué canal funciona.

## 1. Activar AdSense (una sola vez)

1. Entra a <https://adsense.google.com> con tu cuenta de Google y registra el sitio
   `curricula-fawn.vercel.app`.
2. Copia tu ID de editor (`ca-pub-1234567890123456`).
3. Reemplaza `ca-pub-XXXXXXXXXXXXXXXX` en `frontend/public/adsense.js`
   y `pub-XXXXXXXXXXXXXXXX` en `frontend/public/ads.txt` (en ads.txt va **sin** `ca-`).
4. Haz deploy y en AdSense pulsa "Verificar". La revisión tarda de días a semanas.
5. En AdSense → Anuncios → activa **Anuncios automáticos**.
6. En AdSense → Privacidad y mensajes → activa el mensaje de consentimiento (GDPR)
   para tráfico de Europa.
7. (Opcional) Crea dos bloques "Display" y pega su número en `data-ad-slot=""`
   de cada landing.

**Ojo:** Google suele rechazar subdominios `*.vercel.app` y sitios con poco contenido.
Si lo rechazan: compra un dominio propio (~10 USD/año, ej. `anthonysosa.dev`),
apúntalo a Vercel y vuelve a solicitar. Más páginas con texto original ayudan.

## 2. Indexar en Google (una sola vez)

1. <https://search.google.com/search-console> → agregar propiedad (prefijo de URL).
2. Verifica con la etiqueta HTML que te dan (pégala en `frontend/index.html`).
3. Sitemaps → envía `sitemap.xml`.
4. Inspección de URL → pide indexar las dos landings.

## 3. Calendario (primeras 2 semanas)

| Día | Canal | Proyecto |
|-----|-------|----------|
| 1 | LinkedIn (post largo) | ATLAS |
| 2 | Reddit r/algotrading (inglés) | ATLAS |
| 3 | LinkedIn | Certis |
| 4 | Reddit r/EnglishLearning, r/learnEnglish | Certis |
| 5 | dev.to / Medium (artículo técnico) | ATLAS |
| 7 | Hacker News "Show HN" (martes-jueves, 8-10 am hora de NY) | ATLAS |
| 8 | Grupos de Facebook de inglés / Telegram de estudiantes | Certis |
| 10 | X/Twitter hilo | ATLAS |
| 12 | Product Hunt / Indie Hackers | Certis |

Regla de oro en Reddit/HN: cuenta la historia y el aprendizaje, no vendas.
Lee las reglas de cada subreddit antes (algunos prohíben autopromoción).

## 4. Textos listos para pegar

### LinkedIn — ATLAS

> Probé 34,751 estrategias de trading. Casi ninguna sobrevive a la estadística honesta.
>
> Construí ATLAS Lab, un laboratorio cuantitativo en Python que genera y valida
> estrategias con el rigor de un paper: doble out-of-sample de 18 meses,
> Deflated Sharpe Ratio, Monte Carlo y costos reales.
>
> 90 experimentos · 27 instrumentos · +12 años de datos.
>
> La conclusión incómoda: con datos retail no encontré alpha explotable.
> Y lo publiqué igual, porque un resultado negativo bien medido vale más que
> cien capturas de ganancias.
>
> Todo está en vivo 👇
> https://curricula-fawn.vercel.app/proyectos/atlas-lab/?utm_source=linkedin&utm_medium=social&utm_campaign=atlas
>
> #Python #DataScience #Trading #QuantFinance

### Reddit r/algotrading — ATLAS (inglés)

> **Title:** I backtested 34,751 strategies with Deflated Sharpe + double OOS. Here's the (mostly negative) result.
>
> I built an open lab to test whether retail-accessible data has exploitable alpha.
> Setup: 90 experiments, 11 strategy classes, 27 instruments, 12+ years, 18-month
> double out-of-sample, Deflated Sharpe Ratio, Monte Carlo, realistic costs,
> preregistered rules. Short answer: I couldn't find robust alpha.
> Everything, including the failures, is on a public dashboard:
> https://atlas-lab-one.vercel.app/?utm_source=reddit&utm_medium=social&utm_campaign=atlas
>
> Happy to answer methodology questions or hear where I'm wrong.

### Hacker News

> **Show HN: I tested 34,751 trading strategies and published the negative results**
> URL: https://atlas-lab-one.vercel.app/?utm_source=hn&utm_medium=social&utm_campaign=atlas

### LinkedIn — Certis

> ¿Sabes qué nivel de inglés tienes de verdad? 🇬🇧
>
> Hice Certis: un examen de nivelación CEFR (A2 → C1) de 64 preguntas en 5 destrezas,
> refuerzo generado con IA justo donde fallas, y lo que más me costó:
> simulacros de speaking con un examinador de IA al estilo Cambridge
> (entrevista, turno largo, tarea colaborativa y discusión).
>
> Si estás preparando un B2 First o C1 Advanced, o necesitas demostrar tu inglés
> para trabajo remoto, pruébalo y dime qué nivel te salió 👇
> https://curricula-fawn.vercel.app/proyectos/certis/?utm_source=linkedin&utm_medium=social&utm_campaign=certis
>
> #Inglés #Cambridge #EdTech #IA

### Grupos de estudiantes / WhatsApp — Certis

> Encontré/hice una plataforma para medir tu nivel de inglés (A2 a C1) y practicar
> el speaking tipo Cambridge con IA. Les dejo el link por si están preparando examen:
> https://curricula-fawn.vercel.app/proyectos/certis/?utm_source=whatsapp&utm_medium=social&utm_campaign=certis

## 5. Medir

- Search Console: impresiones y clics por landing (semanal).
- AdSense: RPM e ingresos por página.
- Dashboard del portafolio (`/dashboard`): visitas totales.
- Si un canal trae >70% del tráfico, dobla la apuesta ahí.

## 6. Siguientes ideas para más tráfico orgánico

- Artículos SEO en el portafolio: "Qué es el Deflated Sharpe Ratio",
  "Cómo es el speaking del C1 Advanced", "Diferencia entre B2 y C1".
- Versión en inglés de cada landing (mayor volumen de búsqueda).
- Video corto (TikTok/Reels/Shorts) del examinador de IA de Certis en acción.
