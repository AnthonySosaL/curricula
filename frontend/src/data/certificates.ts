export interface Certificate {
  id: 'academy' | 'cloud-practitioner' | 'ai-practitioner';
  name: string;
  detail: string;
  issuer: string;
  date: { es: string; en: string };
  color: string;
  bg: string;
  badge: string;
  file: string | null;
  verify: string;
  chatLabel: { es: string; en: string };
  // Se prueba contra el texto de la pregunta ya normalizado (sin acentos, en minusculas)
  match: RegExp;
}

export const certificates: Certificate[] = [
  {
    id: 'academy',
    name: 'AWS Academy Graduate',
    detail: 'Cloud Foundations',
    issuer: 'Amazon Web Services (AWS)',
    date: { es: 'Abril 2026', en: 'April 2026' },
    color: '#FF9900',
    bg: '#FFF8EE',
    badge: '🏆',
    file: '/aws-certificate.pdf',
    verify: 'https://www.credly.com/go/7KSHyvoX',
    chatLabel: { es: 'Cloud Foundations (PDF)', en: 'Cloud Foundations (PDF)' },
    match: /cloud foundations|academy|foundations/,
  },
  {
    id: 'cloud-practitioner',
    name: 'AWS SimuLearn',
    detail: 'Cloud Practitioner Training Badge',
    issuer: 'Amazon Web Services (AWS)',
    date: { es: 'Septiembre 2026', en: 'September 2026' },
    color: '#FF9900',
    bg: '#FFF8EE',
    badge: '🏆',
    file: null,
    verify: 'https://www.credly.com/badges/f291f199-0f1c-4c0a-a058-be26610e4b59',
    chatLabel: { es: 'Cloud Practitioner (Credly)', en: 'Cloud Practitioner (Credly)' },
    match: /cloud practitioner/,
  },
  {
    id: 'ai-practitioner',
    name: 'AWS SimuLearn',
    detail: 'AI Practitioner Training Badge',
    issuer: 'Amazon Web Services (AWS)',
    date: { es: 'Septiembre 2026', en: 'September 2026' },
    color: '#8B5CF6',
    bg: '#F5F3FF',
    badge: '🏆',
    file: null,
    verify: 'https://www.credly.com/badges/835a30d4-78ad-4536-9fba-6a4e5f2a5760',
    chatLabel: { es: 'AI Practitioner (Credly)', en: 'AI Practitioner (Credly)' },
    match: /ai practitioner|ia practitioner|bedrock/,
  },
];
