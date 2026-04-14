import type { IncomingMessage, ServerResponse } from 'http';
import Groq from 'groq-sdk';

// ─── System prompt ────────────────────────────────────────────
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

function isExecutiveDashboardPrompt(messages: { role: string; content: string }[]) {
  const latestUserPrompt = [...messages]
    .reverse()
    .find((message) => message.role === 'user')
    ?.content
    ?.toLowerCase() ?? '';

  return (
    latestUserPrompt.includes('[resumen]')
    || latestUserPrompt.includes('[summary]')
    || latestUserPrompt.includes('formato exacto')
    || latestUserPrompt.includes('exact tagged format')
    || latestUserPrompt.includes('[recomendaciones]')
    || latestUserPrompt.includes('[recommendations]')
  );
}

// ─── CORS helper ─────────────────────────────────────────────
function setCors(res: ServerResponse) {
  const origin = process.env.FRONTEND_URL ?? '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

function json(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

// ─── Handler ─────────────────────────────────────────────────
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  setCors(res);

  // Preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    return json(res, 405, { statusCode: 405, message: 'Method Not Allowed' });
  }

  try {
    // Read body
    const raw = await new Promise<string>((resolve, reject) => {
      let data = '';
      req.on('data', (chunk) => (data += chunk));
      req.on('end', () => resolve(data));
      req.on('error', reject);
    });

    const body = JSON.parse(raw) as { messages?: { role: string; content: string }[] };
    const messages = body?.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return json(res, 400, { statusCode: 400, message: 'messages array is required' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return json(res, 500, { statusCode: 500, message: 'GROQ_API_KEY not configured' });
    }

    const isExecutiveRequest = isExecutiveDashboardPrompt(messages);
    const executiveInstruction: Groq.Chat.ChatCompletionMessageParam[] = isExecutiveRequest
      ? [{
        role: 'system',
        content: 'If the user requests a tagged executive dashboard analysis, strictly follow the requested sections and keep each section concise.',
      }]
      : [];

    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...executiveInstruction,
        ...(messages.slice(-8) as Groq.Chat.ChatCompletionMessageParam[]),
      ],
      max_tokens: isExecutiveRequest ? 520 : 300,
      temperature: isExecutiveRequest ? 0.35 : 0.7,
    });

    const reply = completion.choices[0]?.message?.content ?? 'Sin respuesta';

    // Match TransformInterceptor format: { data, timestamp }
    return json(res, 200, {
      data: { reply },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Chat handler error:', err);
    return json(res, 500, { statusCode: 500, message: 'Error interno del servidor' });
  }
}
