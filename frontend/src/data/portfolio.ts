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
    bio: 'Estudiante de Ingenieria de Sistemas dinamico y proactivo, con experiencia real en desarrollo Full Stack, analisis de datos, automatizacion e inteligencia artificial.',
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
      github: 'https://github.com/AnthonySosaL',
      demo: null as string | null,
      color: '#2563eb',
    },
    {
      name: 'Curricula · Portfolio & Panel Admin',
      description: 'Portfolio publico con panel de administracion protegido con JWT.',
      techs: ['NestJS', 'React', 'Prisma', 'Neon', 'Vercel', 'JWT'],
      github: 'https://github.com/AnthonySosaL',
      demo: null as string | null,
      color: '#16a34a',
    },
    {
      name: 'SIADI 2.0 · Estadisticas Ciudadanas',
      description: 'Sistema web de estadisticas de ciudadanos para el Ministerio de Telecomunicaciones.',
      techs: ['JavaScript', 'HTML5', 'CSS3', 'PostgreSQL', 'AlmaLinux', 'SSL'],
      github: 'https://github.com/AnthonySosaL',
      demo: null as string | null,
      color: '#f59e0b',
    },
    {
      name: 'Infraestructura Tecnologica · MTOP',
      description: 'Aplicacion interna para registrar y visualizar infraestructura tecnologica nacional.',
      techs: ['Java', 'JavaScript', 'Jupyter Notebook', 'PostgreSQL'],
      github: 'https://github.com/AnthonySosaL',
      demo: null as string | null,
      color: '#8b5cf6',
    },
  ],
  education: [
    { institution: 'Pontificia Universidad Catolica del Ecuador', degree: 'Ingenieria de Sistemas de la Informacion · 8vo semestre', period: '2021 — Presente', location: 'Quito, Ecuador' },
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
    bio: 'Dynamic and proactive Systems Engineering student with real experience in Full Stack development, data analysis, automation and artificial intelligence.',
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
      github: 'https://github.com/AnthonySosaL',
      demo: null as string | null,
      color: '#2563eb',
    },
    {
      name: 'Curricula · Portfolio & Admin Panel',
      description: 'Public portfolio with JWT-protected admin panel.',
      techs: ['NestJS', 'React', 'Prisma', 'Neon', 'Vercel', 'JWT'],
      github: 'https://github.com/AnthonySosaL',
      demo: null as string | null,
      color: '#16a34a',
    },
    {
      name: 'SIADI 2.0 · Citizen Statistics',
      description: 'Citizen statistics web system for the Ministry of Telecommunications.',
      techs: ['JavaScript', 'HTML5', 'CSS3', 'PostgreSQL', 'AlmaLinux', 'SSL'],
      github: 'https://github.com/AnthonySosaL',
      demo: null as string | null,
      color: '#f59e0b',
    },
    {
      name: 'Technology Infrastructure · MTOP',
      description: 'Internal app to register and visualize national technology infrastructure.',
      techs: ['Java', 'JavaScript', 'Jupyter Notebook', 'PostgreSQL'],
      github: 'https://github.com/AnthonySosaL',
      demo: null as string | null,
      color: '#8b5cf6',
    },
  ],
  education: [
    { institution: 'Pontifical Catholic University of Ecuador', degree: 'Information Systems Engineering · 8th semester', period: '2021 — Present', location: 'Quito, Ecuador' },
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
