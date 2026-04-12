// ─────────────────────────────────────────────────────────────────────────────
// Dual-entry point:
//   VERCEL=1  → pure Node.js HTTP server (no AppModule loaded, no shim errors)
//   local dev → full NestJS app
//
// WHY: experimentalServices generates CJS shims for pnpm packages.
//   - @nestjs/core shim: WORKS (kept as static import for framework detection)
//   - @nestjs/common.Injectable shim: BROKEN (in chat.service.cjs)
//   - Fix: AppModule loaded via dynamic import only in the non-Vercel branch,
//     so chat.service.cjs is NEVER require()'d on the Lambda.
// ─────────────────────────────────────────────────────────────────────────────
import { NestFactory } from '@nestjs/core'; // static import for NestJS detection — shim works

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `Eres el asistente virtual del portafolio de Anthony Sebastian Sosa Loroña.
Tu misión es responder preguntas sobre Anthony de forma concisa, amigable y profesional.
Responde siempre en el idioma en que te hablen (español o inglés).
Sé breve: máximo 3-4 oraciones por respuesta.

INFORMACIÓN DE ANTHONY:
- Nombre: Anthony Sebastian Sosa Loroña
- Rol: Desarrollador Full Stack | Estudiante de Ingeniería de Sistemas (8vo semestre, PUCE Ecuador)
- Email: anthonysosa44@gmail.com | Teléfono: +593 099 582 2812
- GitHub: github.com/AnthonySosaL | Ubicación: Pichincha, Ecuador
- Disponible para proyectos remotos o híbridos

EXPERIENCIA:
1. Nexus Soluciones S.A.S. B.I.C — Full Stack Dev (Feb-Mar 2026, Remoto)
   Plataforma SaaS de firmas electrónicas: NestJS + Prisma + PostgreSQL + Next.js 16 + AWS S3 + Payphone. Deploy en Railway con Docker.
2. Ministerio de Transporte y Obras Públicas — Full Stack Dev (Dic 2024 – Jun 2025, Híbrido)
   Levantamiento de infraestructura tecnológica nacional, app interna Java+JS, limpieza de datos con Jupyter.
3. Ministerio de Telecomunicaciones — Full Stack Dev (Jul-Sep 2024, Presencial)
   Sistema SIADI con React+TypeScript, Docker, SIADI 2.0 en AlmaLinux con SSL.
4. Helios Trader Group LLC — Especialista Mercados Financieros (2021-2022, Remoto)
   Gestión de cuenta de inversión, estrategia propia de riesgo, reportes mensuales.

HABILIDADES TÉCNICAS:
- Frontend: React, Next.js, TypeScript, Tailwind CSS, shadcn/ui, React Native, Flutter
- Backend: NestJS, Spring Boot, Node.js, Java, JWT Auth
- Bases de datos: PostgreSQL, MySQL, Oracle, Firebase, Prisma ORM
- Cloud/DevOps: Docker, AWS S3, Railway, AlmaLinux, SSL, Vercel
- IA/ML: Python, scikit-learn, OpenAI API, Whisper, BeautifulSoup, Selenium
- Automatización: Excel avanzado, Macros VBA, FFmpeg, YouTube Data API, Zod
- Certificación: AWS Academy Graduate - Cloud Foundations

EDUCACIÓN:
- PUCE - Ingeniería de Sistemas de la Información (8vo semestre, 2021-presente)
- BGU - Unidad Educativa Santo Domingo de Guzmán (2008-2021)

IDIOMAS: Español nativo, Inglés B1

Si te preguntan algo que no sabes de Anthony, di que no tienes esa información y sugiere contactarlo directamente.
No inventes información. No respondas preguntas ajenas al portafolio de Anthony.`;

// ── Vercel Lambda: pure Node.js HTTP server ───────────────────────────────────
// AppModule / chat.service are NEVER loaded here → no @nestjs/common shim errors
async function bootstrapVercel() {
  const http = await import('http');

  function setCors(res: import('http').ServerResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  function sendJson(res: import('http').ServerResponse, status: number, body: unknown) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body));
  }

  const server = http.createServer(async (req, res) => {
    setCors(res);

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const isChat =
      req.method === 'POST' &&
      (req.url === '/api/chat' || (req.url ?? '').endsWith('/api/chat'));

    if (!isChat) {
      return sendJson(res, 200, { status: 'ok', timestamp: new Date().toISOString() });
    }

    try {
      const raw = await new Promise<string>((resolve, reject) => {
        let data = '';
        req.on('data', (chunk: Buffer) => (data += chunk.toString()));
        req.on('end', () => resolve(data));
        req.on('error', reject);
      });

      const body = JSON.parse(raw) as { messages?: { role: string; content: string }[] };
      const messages = body?.messages;

      if (!Array.isArray(messages) || messages.length === 0) {
        return sendJson(res, 400, { statusCode: 400, message: 'messages array is required' });
      }

      const apiKey = process.env['GROQ_API_KEY'];
      if (!apiKey) {
        return sendJson(res, 500, { statusCode: 500, message: 'GROQ_API_KEY not configured' });
      }

      const groqRes = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages.slice(-8)],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (!groqRes.ok) {
        console.error('Groq error:', await groqRes.text());
        return sendJson(res, 502, { statusCode: 502, message: 'Groq API error' });
      }

      const completion = (await groqRes.json()) as {
        choices: { message: { content: string } }[];
      };
      const reply = completion.choices[0]?.message?.content ?? 'Sin respuesta';

      return sendJson(res, 200, { data: { reply }, timestamp: new Date().toISOString() });
    } catch (err) {
      console.error('Handler error:', err);
      return sendJson(res, 500, { statusCode: 500, message: 'Error interno del servidor' });
    }
  });

  const port = parseInt(process.env['PORT'] ?? '3001', 10);
  server.listen(port, () => console.log(`Vercel backend listening on port ${port}`));
}

// ── Local dev: full NestJS app ────────────────────────────────────────────────
// AppModule loaded via dynamic import — NEVER executed when VERCEL=1
async function bootstrapNestJS() {
  const { AppModule } = await import('./app.module');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  const port = parseInt(process.env['PORT'] ?? '3001', 10);
  await app.listen(port);
  console.log(`Backend corriendo en http://localhost:${port}/api`);
}

// ── Entry ─────────────────────────────────────────────────────────────────────
if (process.env['VERCEL'] === '1') {
  void bootstrapVercel();
} else {
  void bootstrapNestJS();
}
