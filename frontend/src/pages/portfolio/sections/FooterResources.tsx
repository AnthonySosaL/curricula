import { useI18n } from '@/lib/i18n';

// Enlaces visibles (y rastreables por Google) a las landings de proyectos y
// a los artículos estáticos de /public. Sin esto quedarían como páginas huérfanas.
const PROJECTS = [
  { slug: 'atlas-lab', label: 'ATLAS Lab' },
  { slug: 'certis', label: 'Certis' },
  { slug: 'praxis-togaf', label: 'Praxis TOGAF' },
];

const ARTICLES = [
  { slug: 'diferencia-b2-c1-ingles', label: 'Diferencia entre B2 y C1 de inglés: qué cambia de verdad' },
  { slug: 'que-es-el-mcer', label: 'Qué es el MCER y qué significa cada nivel de inglés' },
  { slug: 'preparar-c1-advanced-3-meses', label: 'Cómo prepararse para el C1 Advanced en 3 meses' },
  { slug: 'reading-use-of-english-c1', label: 'Lectura y gramática (Reading and Use of English) del C1: las 8 partes y trucos' },
  { slug: 'writing-c1-advanced', label: 'Escritura (Writing) del C1 Advanced: cómo estructurar el ensayo y la Part 2' },
  { slug: 'speaking-c1-advanced', label: 'Cómo es el examen oral (Speaking) del C1 Advanced: las 4 partes y cómo practicarlo' },
  { slug: 'listening-b2-first', label: 'Comprensión auditiva (Listening) del B2 First: las 4 partes y trucos' },
  { slug: 'togaf-adm-fases', label: 'Qué es el TOGAF ADM y qué se hace en cada fase' },
  { slug: 'deflated-sharpe-ratio', label: 'Qué es el Deflated Sharpe Ratio y por qué tu backtest probablemente miente' },
  { slug: 'errores-backtesting', label: '7 errores de backtesting que inflan tus resultados' },
];

const linkClass = 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] underline-offset-2 hover:underline';

export default function FooterResources() {
  const { language } = useI18n();
  const en = language === 'en';

  return (
    <nav
      aria-label={en ? 'Projects and articles' : 'Proyectos y artículos'}
      className="max-w-5xl mx-auto grid gap-6 sm:grid-cols-2 text-sm mb-8"
    >
      <div>
        <p className="font-semibold text-[var(--color-text)] mb-2">{en ? 'Case studies' : 'Casos de estudio'}</p>
        <ul className="space-y-1">
          {PROJECTS.map((p) => (
            <li key={p.slug}>
              <a className={linkClass} href={`/proyectos/${p.slug}/${en ? 'en/' : ''}`}>{p.label}</a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="font-semibold text-[var(--color-text)] mb-2">{en ? 'Articles (Spanish)' : 'Artículos'}</p>
        <ul className="space-y-1">
          {ARTICLES.map((a) => (
            <li key={a.slug}>
              <a className={linkClass} href={`/articulos/${a.slug}/`}>{a.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
