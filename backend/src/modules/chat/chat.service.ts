import { Injectable, InternalServerErrorException } from '@nestjs/common';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

function isExecutiveDashboardPrompt(messages: { role: 'user' | 'assistant'; content: string }[]) {
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

@Injectable()
export class ChatService {
  async chat(messages: { role: 'user' | 'assistant'; content: string }[]) {
    const apiKey = process.env['GROQ_API_KEY'];
    if (!apiKey) throw new InternalServerErrorException('GROQ_API_KEY not configured');

    const isExecutiveRequest = isExecutiveDashboardPrompt(messages);

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...(isExecutiveRequest
            ? [{
              role: 'system',
              content: 'If the user requests a tagged executive dashboard analysis, strictly follow the requested sections and keep each section concise.',
            }]
            : []),
          ...messages.slice(-8),
        ],
        max_tokens: isExecutiveRequest ? 520 : 300,
        temperature: isExecutiveRequest ? 0.35 : 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', errorText);
      throw new InternalServerErrorException('Groq API error');
    }

    const completion = (await response.json()) as {
      choices: { message: { content: string } }[];
    };
    return { reply: completion.choices[0]?.message?.content ?? 'Sin respuesta' };
  }
}
