// ============================================================
// DATOS DEL PORTFOLIO — Anthony Sebastian Sosa Loroña
// ============================================================

export const profile = {
  name: 'Anthony Sosa',
  title: 'Desarrollador Full Stack',
  subtitle: 'Ingeniería de Sistemas · Ecuador',
  email: 'anthonysosa44@gmail.com',
  phone: '+593 099 582 2812',
  location: 'Pichincha, Ecuador',
  bio: `Estudiante de Ingeniería de Sistemas dinámico y proactivo, con experiencia real en desarrollo Full Stack,
análisis de datos, automatización e inteligencia artificial. He trabajado en entornos gubernamentales y empresas privadas,
liderando proyectos de impacto y desplegando aplicaciones en producción.`,
  avatar: '/foto.png' as string | null,
  links: {
    github:      'https://github.com/AnthonySosaL',
    linkedin:    'https://www.linkedin.com/in/anthony-sosa-942475187/',
    cv:          '/cv.pdf',
    certificate: '/aws-certificate.pdf',
  },
};

export const skills = [
  {
    category: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'React Native', 'Flutter', 'HTML5', 'CSS3'],
  },
  {
    category: 'Backend',
    items: ['NestJS', 'Spring Boot', 'Node.js', 'Java', 'JavaScript', 'REST APIs', 'JWT Auth'],
  },
  {
    category: 'Bases de datos & ORM',
    items: ['PostgreSQL', 'MySQL', 'Oracle', 'SQL Server', 'Firebase', 'Prisma ORM'],
  },
  {
    category: 'Cloud & DevOps',
    items: ['Docker', 'AWS S3', 'Railway', 'AlmaLinux', 'SSL', 'Vercel', 'Git'],
  },
  {
    category: 'IA & Datos',
    items: ['Python', 'scikit-learn', 'OpenAI API', 'Whisper', 'BeautifulSoup', 'Selenium', 'Jupyter Notebook'],
  },
  {
    category: 'Automatización',
    items: ['Excel avanzado', 'Macros VBA', 'FFmpeg', 'YouTube Data API', 'React Email', 'Resend', 'Zod'],
  },
];

export const experience = [
  {
    company: 'Nexus Soluciones S.A.S. B.I.C',
    role: 'Desarrollador Full Stack',
    period: 'Feb 2026 — Mar 2026',
    location: 'Remoto',
    description:
      'Desarrollo completo de plataforma SaaS para gestión de firmas electrónicas, clientes, planes y pagos en línea. Backend NestJS + Prisma + PostgreSQL con arquitectura modular JWT. Frontend Next.js 16 + React 19 + shadcn/ui con dashboards y métricas Nivo. Integración AWS S3, pasarela Payphone y sistema de descuentos. Despliegue en Railway con Docker.',
    techs: ['NestJS', 'Next.js', 'React 19', 'Prisma', 'PostgreSQL', 'AWS S3', 'Docker', 'Payphone'],
  },
  {
    company: 'Ministerio de Transporte y Obras Públicas',
    role: 'Desarrollador Full Stack',
    period: 'Dic 2024 — Jun 2025',
    location: 'Híbrido · Ecuador',
    description:
      'Levantamiento de infraestructura tecnológica nacional (puertos, redes, access points, racks). Desarrollo de aplicación interna con Java backend y JavaScript frontend para registrar equipos. Lideré el equipo "Ecuatorianos en Acción". Limpieza de datos con Jupyter Notebooks. Publicación y mantenimiento en servidor corporativo.',
    techs: ['Java', 'JavaScript', 'Jupyter Notebook', 'PostgreSQL'],
  },
  {
    company: 'Ministerio de Telecomunicaciones',
    role: 'Desarrollador Full Stack',
    period: 'Jul 2024 — Sep 2024',
    location: 'Presencial · Ecuador',
    description:
      'Optimización del sistema SIADI con React + TypeScript. Administración de contenedores Docker. Automatización con macros de Excel y Word. Desarrollo de SIADI 2.0 y Sistema de Estadísticas de Ciudadanos con JavaScript, HTML, CSS y PostgreSQL; montado en AlmaLinux con certificados SSL.',
    techs: ['React', 'TypeScript', 'Docker', 'PostgreSQL', 'AlmaLinux', 'SSL'],
  },
  {
    company: 'Helios Trader Group LLC',
    role: 'Especialista en Mercados Financieros',
    period: '2021 — 2022',
    location: 'Remoto',
    description:
      'Aprobé la prueba de selección de EloOps y gestioné una cuenta de inversión aplicando estrategia propia de gestión de riesgo para rendimiento mensual constante. Elaboración de reportes de desempeño y ajuste de estrategias basado en métricas.',
    techs: ['Análisis cuantitativo', 'Gestión de riesgo', 'Reportes financieros'],
  },
];

export const projects = [
  {
    name: 'Plataforma SaaS · Firmas Electrónicas',
    featured: true,
    description:
      'SaaS completo para gestión de firmas electrónicas, clientes, planes y pagos. Módulos de documentos firmados, notificaciones, códigos de descuento y pasarela Payphone. Despliegue en Railway con Docker.',
    techs: ['NestJS', 'Next.js 16', 'Prisma', 'PostgreSQL', 'AWS S3', 'Docker'],
    github: 'https://github.com/AnthonySosaL',
    demo: null as string | null,
    color: '#2563eb',
  },
  {
    name: 'Curricula · Portfolio & Panel Admin',
    description:
      'Portfolio público con panel de administración protegido con JWT. Backend NestJS + Prisma + Neon PostgreSQL. Frontend React + Vite + Tailwind. Desplegado en Vercel con arquitectura serverless.',
    techs: ['NestJS', 'React', 'Prisma', 'Neon', 'Vercel', 'JWT'],
    github: 'https://github.com/AnthonySosaL',
    demo: null as string | null,
    color: '#16a34a',
  },
  {
    name: 'SIADI 2.0 · Estadísticas Ciudadanas',
    description:
      'Sistema web de estadísticas de ciudadanos para el Ministerio de Telecomunicaciones. Desarrollo con JavaScript, HTML5, CSS3 y PostgreSQL; desplegado en servidor AlmaLinux con certificados SSL.',
    techs: ['JavaScript', 'HTML5', 'CSS3', 'PostgreSQL', 'AlmaLinux', 'SSL'],
    github: 'https://github.com/AnthonySosaL',
    demo: null as string | null,
    color: '#f59e0b',
  },
  {
    name: 'Infraestructura Tecnológica · MTOP',
    description:
      'Aplicación interna para registrar y visualizar infraestructura tecnológica nacional (equipos, racks, puertos, redes). Coordinación de equipo de campo y procesamiento de datos con Jupyter Notebooks.',
    techs: ['Java', 'JavaScript', 'Jupyter Notebook', 'PostgreSQL'],
    github: 'https://github.com/AnthonySosaL',
    demo: null as string | null,
    color: '#8b5cf6',
  },
];

export const education = [
  {
    institution: 'Pontificia Universidad Católica del Ecuador',
    degree: 'Ingeniería de Sistemas de la Información · 8vo semestre',
    period: '2021 — Presente',
    location: 'Quito, Ecuador',
  },
  {
    institution: 'Unidad Educativa Santo Domingo de Guzmán',
    degree: 'Bachillerato General Unificado',
    period: '2008 — 2021',
    location: 'Ecuador',
  },
];

export const languages = [
  { name: 'Español', level: 'Nativo', percent: 100 },
  { name: 'Inglés', level: 'Intermedio (B1)', percent: 55 },
];
