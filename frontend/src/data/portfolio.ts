import { useI18n } from '@/lib/i18n';

const commonProfile = {
  name: 'Anthony Sosa',
  email: 'anthonysosa44@gmail.com',
  phone: '+593 099 582 2812',
  location: 'Pichincha, Ecuador',
  avatar: '/foto.png' as string | null,
  links: {
    github: 'https://github.com/AnthonySosaL',
    linkedin: 'https://www.linkedin.com/in/anthony-sosa-942475187/',
    cv: '/cv.pdf',
    certificate: '/aws-certificate.pdf',
  },
};

const esData = {
  profile: {
    ...commonProfile,
    title: 'Desarrollador Full Stack',
    subtitle: 'Ingenieria de Sistemas · Ecuador',
    bio: 'Graduado de Ingenieria de Sistemas de la Informacion, dinamico y proactivo, con experiencia real en desarrollo Full Stack, analisis de datos, automatizacion e inteligencia artificial.',
    links: { ...commonProfile.links, cv: '/cv.pdf' },
  },
  skills: [
    { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'React Native', 'Flutter', 'HTML5', 'CSS3'] },
    { category: 'Backend', items: ['NestJS', 'Spring Boot', 'Node.js', 'Java', 'JavaScript', 'REST APIs', 'JWT Auth'] },
    { category: 'Bases de datos & ORM', items: ['PostgreSQL', 'MySQL', 'Oracle', 'SQL Server', 'Firebase', 'Prisma ORM'] },
    { category: 'Cloud & DevOps', items: ['Docker', 'AWS S3', 'Railway', 'AlmaLinux', 'SSL', 'Vercel', 'Git'] },
    { category: 'IA & Datos', items: ['Python', 'scikit-learn', 'OpenAI API', 'Whisper', 'BeautifulSoup', 'Selenium', 'Jupyter Notebook'] },
    { category: 'Automatizacion', items: ['Excel avanzado', 'Macros VBA', 'FFmpeg', 'YouTube Data API', 'React Email', 'Resend', 'Zod'] },
  ],
  experience: [
    {
      company: 'Nexus Soluciones S.A.S. B.I.C',
      role: 'Desarrollador Full Stack',
      period: 'Feb 2026 — Mar 2026',
      location: 'Remoto',
      description: 'Desarrollo completo de plataforma SaaS para gestion de firmas electronicas, clientes, planes y pagos en linea.',
      techs: ['NestJS', 'Next.js 16', 'React 19', 'Prisma', 'PostgreSQL', 'AWS S3', 'Docker', 'Payphone'],
    },
    {
      company: 'Ministerio de Transporte y Obras Publicas',
      role: 'Desarrollador Full Stack',
      period: 'Dic 2024 — Jun 2025',
      location: 'Hibrido · Ecuador',
      description: 'Levantamiento de infraestructura tecnologica nacional y desarrollo de aplicacion interna con Java y JavaScript.',
      techs: ['Java', 'JavaScript', 'Jupyter Notebook', 'PostgreSQL'],
    },
    {
      company: 'Ministerio de Telecomunicaciones',
      role: 'Desarrollador Full Stack',
      period: 'Jul 2024 — Sep 2024',
      location: 'Presencial · Ecuador',
      description: 'Optimizacion del sistema SIADI con React + TypeScript y despliegue en AlmaLinux con SSL.',
      techs: ['React', 'TypeScript', 'Docker', 'PostgreSQL', 'AlmaLinux', 'SSL'],
    },
    {
      company: 'Helios Trader Group LLC',
      role: 'Especialista en Mercados Financieros',
      period: '2021 — 2022',
      location: 'Remoto',
      description: 'Gestion de cuenta de inversion con estrategia de riesgo y reportes de desempeno.',
      techs: ['Analisis cuantitativo', 'Gestion de riesgo', 'Reportes financieros'],
    },
  ],
  projects: [
    {
      name: 'Plataforma SaaS · Firmas Electronicas',
      featured: true,
      description: 'SaaS para gestion de firmas electronicas, clientes, planes y pagos.',
      techs: ['NestJS', 'Next.js 16', 'Prisma', 'PostgreSQL', 'AWS S3', 'Docker'],
      github: null as string | null,
      demo: 'https://solucionesnexus.com/' as string | null,
      live: true,
      color: '#2563eb',
      details: {
        summary: 'SaaS completo para gestión de firmas electrónicas, clientes, planes y pagos en línea, con arquitectura modular y despliegue en contenedores.',
        highlights: [
          'Backend con NestJS + Prisma ORM + PostgreSQL, arquitectura modular con autenticación JWT.',
          'Frontend con Next.js 16 + React 19 + Tailwind CSS + shadcn/ui: dashboards, tablas dinámicas y visualización de métricas con Nivo.',
          'Integración de AWS S3 para documentos y certificados digitales, y pasarela de pago Payphone con sistema de códigos de descuento.',
          'Módulos de usuarios, clientes, planes, transferencias, consultas, firmas digitales, documentos firmados y notificaciones.',
          'Despliegue en Railway con Docker.',
        ],
        stack: [
          { label: 'Backend', items: 'NestJS · Prisma ORM · PostgreSQL · JWT' },
          { label: 'Frontend', items: 'Next.js 16 · React 19 · Tailwind CSS · shadcn/ui · Nivo' },
          { label: 'Cloud', items: 'AWS S3 · Payphone · Docker · Railway' },
        ],
        links: [
          { label: 'Portal de distribuidores', url: 'https://distribuidores.solucionesnexus.com/' },
        ],
      },
    },
    {
      name: 'Curricula · Portfolio & Panel Admin',
      description: 'Portfolio publico con panel de administracion protegido con JWT.',
      techs: ['NestJS', 'React', 'Prisma', 'Neon', 'Vercel', 'JWT'],
      github: 'https://github.com/AnthonySosaL/curricula',
      demo: 'https://curricula-fawn.vercel.app/' as string | null,
      color: '#16a34a',
      details: {
        summary: 'Este mismo portafolio: sitio público con avatar 3D, chat de IA, mini-juego con ranking y un panel de analíticas que mide su propio tráfico en tiempo real.',
        highlights: [
          'Panel de administración protegido con JWT, con vista pública sin sesión para demostrar el dashboard.',
          'Asistente de IA (Groq) integrado en el chat del portafolio y en las recomendaciones del panel.',
          'Mini-juego 3D (Three.js) con tabla de puntajes en base de datos.',
          'Backend en NestJS + Prisma + PostgreSQL (Neon) desplegado en Render; frontend en Vercel.',
        ],
        stack: [
          { label: 'Frontend', items: 'React 19 · Vite · TypeScript · Tailwind CSS 4 · Three.js' },
          { label: 'Backend', items: 'NestJS 11 · Prisma 7 · PostgreSQL (Neon) · JWT' },
          { label: 'IA', items: 'Groq API (chat + análisis del dashboard)' },
          { label: 'Despliegue', items: 'Vercel (frontend) · Render (backend)' },
        ],
      },
    },
    {
      name: 'ATLAS Lab · Investigación Cuantitativa',
      description: 'Laboratorio de trading cuantitativo: generó y validó 34,751 estrategias con rigor estadístico (Deflated Sharpe, Monte Carlo, out-of-sample). Resultados publicados en vivo, incluidos los negativos.',
      techs: ['Python', 'Pandas', 'Next.js', 'TypeScript', 'MetaTrader 5', 'Vercel'],
      github: null as string | null,
      demo: 'https://atlas-lab-one.vercel.app/' as string | null,
      live: true,
      color: '#dc2626',
      details: {
        summary: 'Plataforma de análisis de datos financieros de extremo a extremo: pipeline en Python que ingesta, procesa y valida estadísticamente miles de estrategias de trading, con dashboard público y un experimento en vivo que se actualiza solo cada día.',
        highlights: [
          '34,751 estrategias generadas y validadas en 90 experimentos, 11 clases, 27 instrumentos y más de 12 años de histórico.',
          'Validación anti-autoengaño: doble out-of-sample (18 meses), Deflated Sharpe Ratio, simulación Monte Carlo y costos reales de transacción.',
          'Metodología preregistrada: se publican también los resultados negativos — la conclusión central es que no hay alpha explotable en datos retail.',
          'El cómputo pesado corre local en Python y exporta JSON estático que consume la web, por eso el dashboard es instantáneo y no necesita servidor de cómputo.',
          'Experimento en vivo desde julio 2026, con autopublicación diaria y manejo de errores para que un fallo de red no rompa el proceso.',
        ],
        stack: [
          { label: 'Análisis', items: 'Python · pandas · numpy · scipy · scikit-learn' },
          { label: 'Datos', items: 'Parquet (PyArrow) · Dukascopy · yfinance · FRED · CFTC' },
          { label: 'Dashboard', items: 'Next.js 16 · React 19 · TypeScript · Tailwind · shadcn/ui · lightweight-charts' },
          { label: 'Despliegue', items: 'Vercel (CI/CD desde GitHub)' },
          { label: 'Integración', items: 'MetaTrader 5 (Python) · servidor MCP propio' },
        ],
        numbers: ['34,751 estrategias', '90 experimentos · 11 clases', '27 instrumentos', '+12 años de histórico', 'OOS de 18 meses'],
      },
    },
    {
      name: 'JARVIS · Asistente de IA de Escritorio',
      description: 'Asistente de IA local para Windows que controla la PC por voz o texto: abre apps, gestiona ventanas, automatiza el navegador y se autoextiende creando sus propias habilidades.',
      techs: ['Node.js', 'Express', 'PowerShell', 'Win32 API', 'Groq', 'Gemini', 'Playwright', 'MCP'],
      github: null as string | null,
      demo: null as string | null,
      color: '#7c3aed',
      details: {
        summary: 'Asistente 100% local y gratuito: pipeline de clasificación de intenciones con LLM, router multi-proveedor con failover, loop agéntico auto-correctivo y arquitectura de plugins con hot-reload.',
        highlights: [
          'Pipeline de intención: un LLM clasificador convierte lenguaje natural en JSON estructurado, reemplazando un sistema de regex frágil con cientos de sinónimos a mano.',
          'Router multi-proveedor (Groq, Gemini, NVIDIA NIM) con failover y penalización de modelos caídos — nació de un incidente real cuando el modelo principal llegó a end-of-life.',
          'Loop agéntico con auto-corrección: observa, decide, ejecuta, verifica y corrige solo si algo falla (ej. instala una dependencia faltante y reintenta).',
          'Arquitectura de plugins con hot-reload: el usuario pide una habilidad nueva en lenguaje natural, el LLM la genera, se valida y queda activa sin reiniciar el proceso.',
          'Control preciso del sistema operativo vía Win32 API (P/Invoke) y UI Automation, con visión por computadora como respaldo.',
          'Verificación como principio: cada acción confirma su efecto real antes de reportar éxito, nunca un "listo" falso.',
        ],
        stack: [
          { label: 'Backend', items: 'Node.js + Express (API REST)' },
          { label: 'Control del SO', items: 'PowerShell + Win32 API (P/Invoke) + UI Automation' },
          { label: 'LLMs', items: 'Groq · Google Gemini · NVIDIA NIM — router propio con failover' },
          { label: 'Voz', items: 'Web Speech API (STT) + edge-tts / SAPI (TTS)' },
          { label: 'Automatización web', items: 'Patchright (Playwright stealth)' },
          { label: 'Integraciones', items: 'Extensión de VS Code · cliente MCP (JSON-RPC)' },
        ],
        numbers: ['~9,000 líneas de código propio', '36 tests de integración, 100% passing', '3 proveedores de IA con failover'],
      },
    },
    {
      name: 'Asistente de Reuniones en Tiempo Real',
      description: 'Herramienta de escritorio que transcribe audio del sistema en vivo y sugiere respuestas con IA, con degradación en cascada entre GPU local, CPU local y API en la nube.',
      techs: ['Python', 'customtkinter', 'faster-whisper', 'WASAPI', 'Groq', 'Gemini'],
      github: null as string | null,
      demo: null as string | null,
      color: '#0891b2',
      details: {
        summary: 'Captura la salida de audio del sistema (no el micrófono) vía WASAPI loopback, la transcribe localmente en GPU con faster-whisper, y genera sugerencias con un router de varios proveedores de IA.',
        highlights: [
          'Degradación en cascada en dos capas: voz (GPU local → CPU local → API de Groq) y LLM (rotación entre proveedores) — el sistema nunca se queda mudo.',
          'Router con patrón circuit breaker: penaliza 60 segundos al proveedor que falla para sacarlo de la rotación.',
          'Inferencia local en GPU con ~0.3s de latencia: el audio no sale del equipo en el camino principal y responde 3-5x más rápido que una API.',
          'Captura por WASAPI loopback: agarra la salida del sistema, no el micrófono, para transcribir cualquier reunión sin depender de la app usada.',
        ],
        stack: [
          { label: 'Interfaz', items: 'Python + customtkinter (GUI flotante)' },
          { label: 'Audio', items: 'pyaudiowpatch (captura WASAPI loopback)' },
          { label: 'Transcripción', items: 'faster-whisper local en GPU (large-v3-turbo) con fallback a CPU' },
          { label: 'LLMs', items: 'Groq · Gemini · NVIDIA NIM — router con failover y circuit breaker' },
        ],
        numbers: ['~0.3s de latencia en GPU', '3 niveles de fallback', '3-5x más rápido que una API'],
      },
    },
    {
      name: 'Automatización de Canales de YouTube',
      description: 'Sistema de produccion y analitica para multiples canales de YouTube: bot de control por Telegram, metricas reales via API y dashboard BI.',
      techs: ['Python', 'Telegram Bot', 'YouTube Data API v3', 'YouTube Analytics API v2', 'Flask', 'OAuth2'],
      github: null as string | null,
      demo: null as string | null,
      color: '#d97706',
      details: {
        summary: 'Panel de operaciones completo por Telegram para un pipeline de producción de video en múltiples canales: control de ejecución e infraestructura en caliente, más tres capas de analítica (Telegram, dashboard BI en Flask, documentación viva en Obsidian).',
        highlights: [
          'Control total desde el celular: iniciar/detener el pipeline, cambiar de modo (boost, todos los canales, canal específico) y ver logs en streaming sin cargar el archivo completo.',
          '9 tokens OAuth2 (3 por canal) con separación de privilegios: el scope que sube video no puede leer analíticas y viceversa.',
          'Extracción del historial completo: 16,541 videos paginados desde YouTube Data API v3 en lotes de 50.',
          'YouTube Analytics API v2 reveló que el 87% de las vistas venían del feed de Shorts, y que la retención casi no afectaba las vistas.',
          'Caché en disco con TTL de 1 hora para no agotar la cuota diaria de units al enumerar miles de videos.',
          'Decisiones reales tomadas con los datos: detectar una distribución de vistas anormalmente plana y justificar con números pausar un canal completo.',
        ],
        stack: [
          { label: 'Control', items: 'Bot de Telegram con teclados inline' },
          { label: 'Datos', items: 'YouTube Data API v3 · YouTube Analytics API v2 · OAuth2 (9 tokens, scopes separados)' },
          { label: 'Visualización', items: 'Flask (dashboard BI) · Markdown auto-generado en Obsidian' },
        ],
        numbers: ['16,541 videos analizados', '9 tokens OAuth2', '3 capas de visualización', '87% de vistas desde Shorts'],
      },
    },
    {
      name: 'SIADI 2.0 · Estadisticas Ciudadanas',
      description: 'Sistema web de estadisticas de ciudadanos para el Ministerio de Telecomunicaciones.',
      techs: ['JavaScript', 'HTML5', 'CSS3', 'PostgreSQL', 'AlmaLinux', 'SSL'],
      github: null as string | null,
      demo: null as string | null,
      color: '#f59e0b',
      details: {
        summary: 'Optimización y desarrollo de dos sitios para el Ministerio de Telecomunicaciones: SIADI 2.0 y el Sistema de Estadísticas de Ciudadanos.',
        highlights: [
          'Correcciones y optimización del sistema SIADI, mejorando el rendimiento de la base de datos.',
          'Configuración con React y TypeScript, contenedores Docker para backend y frontend.',
          'Automatización de procesos con macros en Excel y Word.',
          'Despliegue en servidores AlmaLinux con certificados SSL.',
        ],
        stack: [
          { label: 'Frontend', items: 'React · TypeScript · JavaScript · HTML · CSS' },
          { label: 'Infraestructura', items: 'Docker · AlmaLinux · SSL · PostgreSQL' },
        ],
      },
    },
    {
      name: 'Infraestructura Tecnologica · MTOP',
      description: 'Aplicacion interna para registrar y visualizar infraestructura tecnologica nacional.',
      techs: ['Java', 'JavaScript', 'Jupyter Notebook', 'PostgreSQL'],
      github: null as string | null,
      demo: null as string | null,
      color: '#8b5cf6',
      details: {
        summary: 'Levantamiento y aplicación interna para registrar la infraestructura tecnológica nacional del Ministerio de Transporte y Obras Públicas.',
        highlights: [
          'Levantamiento de puertos, puntos de red, access points, interfaces, equipos, racks y switches.',
          'Aplicación interna (backend Java, frontend JavaScript) para registrar y visualizar la infraestructura por empleado y equipo.',
          'Coordinación del equipo de campo para asegurar el levantamiento correcto de datos.',
          'Limpieza y preprocesamiento de datos de Excel con Jupyter Notebooks.',
        ],
        stack: [
          { label: 'Backend', items: 'Java' },
          { label: 'Frontend', items: 'JavaScript' },
          { label: 'Datos', items: 'Jupyter Notebook · PostgreSQL' },
        ],
      },
    },
  ],
  education: [
    { institution: 'Pontificia Universidad Catolica del Ecuador', degree: 'Ingenieria de Sistemas de la Informacion · Graduado', period: '2022 — 2026', location: 'Quito, Ecuador' },
    { institution: 'Unidad Educativa Santo Domingo de Guzman', degree: 'Bachillerato General Unificado', period: '2008 — 2021', location: 'Ecuador' },
  ],
  languages: [
    { name: 'Espanol', level: 'Nativo', percent: 100 },
    { name: 'Ingles', level: 'Intermedio (B1)', percent: 55 },
  ],
};

const enData = {
  profile: {
    ...commonProfile,
    title: 'Full Stack Developer',
    subtitle: 'Systems Engineering · Ecuador',
    bio: 'Information Systems Engineering graduate, dynamic and proactive, with real experience in Full Stack development, data analysis, automation and artificial intelligence.',
    links: { ...commonProfile.links, cv: '/cv-en.pdf' },
  },
  skills: [
    { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'React Native', 'Flutter', 'HTML5', 'CSS3'] },
    { category: 'Backend', items: ['NestJS', 'Spring Boot', 'Node.js', 'Java', 'JavaScript', 'REST APIs', 'JWT Auth'] },
    { category: 'Databases & ORM', items: ['PostgreSQL', 'MySQL', 'Oracle', 'SQL Server', 'Firebase', 'Prisma ORM'] },
    { category: 'Cloud & DevOps', items: ['Docker', 'AWS S3', 'Railway', 'AlmaLinux', 'SSL', 'Vercel', 'Git'] },
    { category: 'AI & Data', items: ['Python', 'scikit-learn', 'OpenAI API', 'Whisper', 'BeautifulSoup', 'Selenium', 'Jupyter Notebook'] },
    { category: 'Automation', items: ['Advanced Excel', 'VBA Macros', 'FFmpeg', 'YouTube Data API', 'React Email', 'Resend', 'Zod'] },
  ],
  experience: [
    {
      company: 'Nexus Soluciones S.A.S. B.I.C',
      role: 'Full Stack Developer',
      period: 'Feb 2026 — Mar 2026',
      location: 'Remote',
      description: 'End-to-end SaaS platform development for e-signatures, clients, plans and online payments.',
      techs: ['NestJS', 'Next.js 16', 'React 19', 'Prisma', 'PostgreSQL', 'AWS S3', 'Docker', 'Payphone'],
    },
    {
      company: 'Ministry of Transport and Public Works',
      role: 'Full Stack Developer',
      period: 'Dec 2024 — Jun 2025',
      location: 'Hybrid · Ecuador',
      description: 'National technology infrastructure survey and internal app development with Java and JavaScript.',
      techs: ['Java', 'JavaScript', 'Jupyter Notebook', 'PostgreSQL'],
    },
    {
      company: 'Ministry of Telecommunications',
      role: 'Full Stack Developer',
      period: 'Jul 2024 — Sep 2024',
      location: 'On-site · Ecuador',
      description: 'SIADI optimization with React + TypeScript and deployment on AlmaLinux with SSL.',
      techs: ['React', 'TypeScript', 'Docker', 'PostgreSQL', 'AlmaLinux', 'SSL'],
    },
    {
      company: 'Helios Trader Group LLC',
      role: 'Financial Markets Specialist',
      period: '2021 — 2022',
      location: 'Remote',
      description: 'Managed an investment account with risk strategy and performance reporting.',
      techs: ['Quantitative analysis', 'Risk management', 'Financial reports'],
    },
  ],
  projects: [
    {
      name: 'SaaS Platform · Electronic Signatures',
      featured: true,
      description: 'SaaS for electronic signature management, clients, plans and payments.',
      techs: ['NestJS', 'Next.js 16', 'Prisma', 'PostgreSQL', 'AWS S3', 'Docker'],
      github: null as string | null,
      demo: 'https://solucionesnexus.com/' as string | null,
      live: true,
      color: '#2563eb',
      details: {
        summary: 'Complete SaaS for electronic signature management, clients, plans, and online payments, with modular architecture and containerized deployment.',
        highlights: [
          'Backend with NestJS + Prisma ORM + PostgreSQL, modular architecture with JWT authentication.',
          'Frontend with Next.js 16 + React 19 + Tailwind CSS + shadcn/ui: dashboards, dynamic tables, and metric visualization with Nivo.',
          'AWS S3 integration for documents and digital certificates, plus a Payphone payment gateway with a discount-code system.',
          'Modules for users, clients, plans, transfers, queries, digital signatures, signed documents, and notifications.',
          'Deployed to Railway with Docker.',
        ],
        stack: [
          { label: 'Backend', items: 'NestJS · Prisma ORM · PostgreSQL · JWT' },
          { label: 'Frontend', items: 'Next.js 16 · React 19 · Tailwind CSS · shadcn/ui · Nivo' },
          { label: 'Cloud', items: 'AWS S3 · Payphone · Docker · Railway' },
        ],
        links: [
          { label: 'Reseller portal', url: 'https://distribuidores.solucionesnexus.com/' },
        ],
      },
    },
    {
      name: 'Curricula · Portfolio & Admin Panel',
      description: 'Public portfolio with JWT-protected admin panel.',
      techs: ['NestJS', 'React', 'Prisma', 'Neon', 'Vercel', 'JWT'],
      github: 'https://github.com/AnthonySosaL/curricula',
      demo: 'https://curricula-fawn.vercel.app/' as string | null,
      color: '#16a34a',
      details: {
        summary: 'This very portfolio: a public site with a 3D avatar, an AI chat, a mini-game with a leaderboard, and an analytics panel that measures its own traffic in real time.',
        highlights: [
          'JWT-protected admin panel, with a public no-login view to demo the dashboard.',
          'AI assistant (Groq) integrated into the portfolio chat and the dashboard recommendations.',
          '3D mini-game (Three.js) with a database-backed leaderboard.',
          'Backend on NestJS + Prisma + PostgreSQL (Neon) deployed on Render; frontend on Vercel.',
        ],
        stack: [
          { label: 'Frontend', items: 'React 19 · Vite · TypeScript · Tailwind CSS 4 · Three.js' },
          { label: 'Backend', items: 'NestJS 11 · Prisma 7 · PostgreSQL (Neon) · JWT' },
          { label: 'AI', items: 'Groq API (chat + dashboard analysis)' },
          { label: 'Deployment', items: 'Vercel (frontend) · Render (backend)' },
        ],
      },
    },
    {
      name: 'ATLAS Lab · Quantitative Research',
      description: 'Quantitative trading laboratory: generated and validated 34,751 strategies with statistical rigor (Deflated Sharpe, Monte Carlo, out-of-sample). Results published live, including the negative ones.',
      techs: ['Python', 'Pandas', 'Next.js', 'TypeScript', 'MetaTrader 5', 'Vercel'],
      github: null as string | null,
      demo: 'https://atlas-lab-one.vercel.app/' as string | null,
      live: true,
      color: '#dc2626',
      details: {
        summary: 'End-to-end financial data platform: a Python pipeline that ingests, processes, and statistically validates thousands of trading strategies, with a public dashboard and a live experiment that self-updates daily.',
        highlights: [
          '34,751 strategies generated and validated across 90 experiments, 11 classes, 27 instruments, and over 12 years of history.',
          'Anti-self-deception validation: double out-of-sample (18 months), Deflated Sharpe Ratio, Monte Carlo simulation, and real transaction costs.',
          'Preregistered methodology: negative results are published too — the core conclusion is that there is no exploitable alpha in retail data.',
          'Heavy computation runs locally in Python and exports static JSON consumed by the site, which is why the dashboard is instant and needs no compute server.',
          'Live experiment running since July 2026, with daily auto-publishing and error handling so a network failure never breaks the process.',
        ],
        stack: [
          { label: 'Analysis', items: 'Python · pandas · numpy · scipy · scikit-learn' },
          { label: 'Data', items: 'Parquet (PyArrow) · Dukascopy · yfinance · FRED · CFTC' },
          { label: 'Dashboard', items: 'Next.js 16 · React 19 · TypeScript · Tailwind · shadcn/ui · lightweight-charts' },
          { label: 'Deployment', items: 'Vercel (CI/CD from GitHub)' },
          { label: 'Integration', items: 'MetaTrader 5 (Python) · custom MCP server' },
        ],
        numbers: ['34,751 strategies', '90 experiments · 11 classes', '27 instruments', '12+ years of history', '18-month OOS'],
      },
    },
    {
      name: 'JARVIS · Desktop AI Assistant',
      description: 'Local AI assistant for Windows that controls the PC by voice or text: opens apps, manages windows, automates the browser, and self-extends by creating its own skills.',
      techs: ['Node.js', 'Express', 'PowerShell', 'Win32 API', 'Groq', 'Gemini', 'Playwright', 'MCP'],
      github: null as string | null,
      demo: null as string | null,
      color: '#7c3aed',
      details: {
        summary: '100% local and free assistant: an LLM-based intent classification pipeline, a multi-provider router with failover, a self-correcting agentic loop, and a hot-reload plugin architecture.',
        highlights: [
          'Intent pipeline: an LLM classifier turns natural language into structured JSON, replacing a fragile regex system with hundreds of hand-written synonyms.',
          'Multi-provider router (Groq, Gemini, NVIDIA NIM) with failover and penalties for failing models — born from a real incident when the primary model hit end-of-life.',
          'Self-correcting agentic loop: observe, decide, execute, verify, and fix itself when something fails (e.g. installs a missing dependency and retries).',
          'Hot-reload plugin architecture: the user asks for a new skill in plain language, the LLM generates it, it gets validated, and it goes live without restarting the process.',
          'Precise OS control via the Win32 API (P/Invoke) and UI Automation, with computer vision as a fallback.',
          'Verification as a principle: every action confirms its real effect before reporting success — never a false "done".',
        ],
        stack: [
          { label: 'Backend', items: 'Node.js + Express (REST API)' },
          { label: 'OS control', items: 'PowerShell + Win32 API (P/Invoke) + UI Automation' },
          { label: 'LLMs', items: 'Groq · Google Gemini · NVIDIA NIM — custom router with failover' },
          { label: 'Voice', items: 'Web Speech API (STT) + edge-tts / SAPI (TTS)' },
          { label: 'Browser automation', items: 'Patchright (Playwright stealth)' },
          { label: 'Integrations', items: 'Custom VS Code extension · MCP client (JSON-RPC)' },
        ],
        numbers: ['~9,000 lines of custom code', '36 integration tests, 100% passing', '3 AI providers with failover'],
      },
    },
    {
      name: 'Real-Time Meeting Assistant',
      description: 'Desktop tool that transcribes system audio live and suggests AI-generated responses, with cascading fallback between local GPU, local CPU, and cloud API.',
      techs: ['Python', 'customtkinter', 'faster-whisper', 'WASAPI', 'Groq', 'Gemini'],
      github: null as string | null,
      demo: null as string | null,
      color: '#0891b2',
      details: {
        summary: 'Captures system audio output (not the microphone) via WASAPI loopback, transcribes it locally on GPU with faster-whisper, and generates suggestions with a multi-provider AI router.',
        highlights: [
          'Two-layer cascading fallback: voice (local GPU → local CPU → Groq API) and LLM (rotation across providers) — the system never goes silent.',
          'Circuit-breaker-style router: penalizes a failing provider for 60 seconds to pull it out of rotation.',
          'Local GPU inference at ~0.3s latency: audio never leaves the machine on the main path, and it responds 3-5x faster than an API.',
          'WASAPI loopback capture: grabs the system output, not the microphone, so it can transcribe any meeting regardless of the app used.',
        ],
        stack: [
          { label: 'Interface', items: 'Python + customtkinter (floating GUI)' },
          { label: 'Audio', items: 'pyaudiowpatch (WASAPI loopback capture)' },
          { label: 'Transcription', items: 'faster-whisper on local GPU (large-v3-turbo) with CPU fallback' },
          { label: 'LLMs', items: 'Groq · Gemini · NVIDIA NIM — router with failover and circuit breaker' },
        ],
        numbers: ['~0.3s GPU latency', '3 fallback levels', '3-5x faster than an API'],
      },
    },
    {
      name: 'YouTube Channel Automation',
      description: 'Production and analytics system for multiple YouTube channels: a Telegram control bot, real metrics via API, and a BI dashboard.',
      techs: ['Python', 'Telegram Bot', 'YouTube Data API v3', 'YouTube Analytics API v2', 'Flask', 'OAuth2'],
      github: null as string | null,
      demo: null as string | null,
      color: '#d97706',
      details: {
        summary: 'A full operations panel over Telegram for a multi-channel video production pipeline: hot-swappable execution and infrastructure controls, plus three layers of analytics (Telegram, a Flask BI dashboard, and a living Obsidian doc).',
        highlights: [
          'Full control from the phone: start/stop the pipeline, switch modes (boost, all channels, one specific channel), and stream logs without loading the whole file.',
          '9 OAuth2 tokens (3 per channel) with privilege separation: the upload scope can\'t read analytics and vice versa.',
          'Extracted the full history: 16,541 videos paginated from the YouTube Data API v3 in batches of 50.',
          'YouTube Analytics API v2 revealed that 87% of views came from the Shorts feed, and that retention barely moved views at all.',
          'Disk cache with a 1-hour TTL to avoid burning the daily unit quota when listing thousands of videos.',
          'Real decisions driven by the data: spotting an abnormally flat view distribution and using the numbers to justify pausing an entire channel.',
        ],
        stack: [
          { label: 'Control', items: 'Telegram bot with inline keyboards' },
          { label: 'Data', items: 'YouTube Data API v3 · YouTube Analytics API v2 · OAuth2 (9 tokens, separate scopes)' },
          { label: 'Visualization', items: 'Flask (BI dashboard) · auto-generated Obsidian markdown' },
        ],
        numbers: ['16,541 videos analyzed', '9 OAuth2 tokens', '3 visualization layers', '87% of views from Shorts'],
      },
    },
    {
      name: 'SIADI 2.0 · Citizen Statistics',
      description: 'Citizen statistics web system for the Ministry of Telecommunications.',
      techs: ['JavaScript', 'HTML5', 'CSS3', 'PostgreSQL', 'AlmaLinux', 'SSL'],
      github: null as string | null,
      demo: null as string | null,
      color: '#f59e0b',
      details: {
        summary: 'Optimization and development of two sites for the Ministry of Telecommunications: SIADI 2.0 and the Citizen Statistics System.',
        highlights: [
          'Bug fixes and optimization of the SIADI system, improving database performance.',
          'Configured with React and TypeScript, with Docker containers for backend and frontend.',
          'Process automation with Excel and Word macros.',
          'Deployed on AlmaLinux servers with SSL certificates.',
        ],
        stack: [
          { label: 'Frontend', items: 'React · TypeScript · JavaScript · HTML · CSS' },
          { label: 'Infrastructure', items: 'Docker · AlmaLinux · SSL · PostgreSQL' },
        ],
      },
    },
    {
      name: 'Technology Infrastructure · MTOP',
      description: 'Internal app to register and visualize national technology infrastructure.',
      techs: ['Java', 'JavaScript', 'Jupyter Notebook', 'PostgreSQL'],
      github: null as string | null,
      demo: null as string | null,
      color: '#8b5cf6',
      details: {
        summary: 'A survey and internal application to register the national technology infrastructure of the Ministry of Transport and Public Works.',
        highlights: [
          'Surveyed ports, network points, access points, interfaces, equipment, racks, and switches.',
          'Internal application (Java backend, JavaScript frontend) to register and visualize infrastructure per employee and equipment.',
          'Coordinated the field team to ensure accurate data collection.',
          'Excel data cleaning and preprocessing with Jupyter Notebooks.',
        ],
        stack: [
          { label: 'Backend', items: 'Java' },
          { label: 'Frontend', items: 'JavaScript' },
          { label: 'Data', items: 'Jupyter Notebook · PostgreSQL' },
        ],
      },
    },
  ],
  education: [
    { institution: 'Pontifical Catholic University of Ecuador', degree: 'Information Systems Engineering · Graduate', period: '2022 — 2026', location: 'Quito, Ecuador' },
    { institution: 'Santo Domingo de Guzman School', degree: 'Unified General Baccalaureate', period: '2008 — 2021', location: 'Ecuador' },
  ],
  languages: [
    { name: 'Spanish', level: 'Native', percent: 100 },
    { name: 'English', level: 'Intermediate (B1)', percent: 55 },
  ],
};

export function usePortfolioData() {
  const { language } = useI18n();
  return language === 'en' ? enData : esData;
}

// Backward-compatible named exports (defaulting to Spanish dataset)
export const profile = esData.profile;
export const skills = esData.skills;
export const experience = esData.experience;
export const projects = esData.projects;
export const education = esData.education;
export const languages = esData.languages;
