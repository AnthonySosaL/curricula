import { useI18n } from '@/lib/i18n';

// Enlaces visibles (y rastreables por Google) a las landings de proyectos y
// a los artículos estáticos de /public. Sin esto quedarían como páginas huérfanas.
const PROJECTS = [
  { slug: 'atlas-lab', label: 'ATLAS Lab' },
  { slug: 'certis', label: 'Certis' },
  { slug: 'praxis-togaf', label: 'Praxis TOGAF' },
];

const ARTICLES = [
  { slug: 'diferencia-b2-c1-ingles', label: 'Diferencia entre B2 y C1' },
  { slug: 'speaking-c1-advanced', label: 'Speaking del C1 Advanced' },
  { slug: 'writing-c1-advanced', label: 'Writing del C1 Advanced' },
  { slug: 'reading-use-of-english-c1', label: 'Reading and Use of English del C1' },
  { slug: 'preparar-c1-advanced-3-meses', label: 'Preparar el C1 en 3 meses' },
  { slug: 'listening-b2-first', label: 'Listening del B2 First' },
  { slug: 'que-es-el-mcer', label: 'Qué es el MCER' },
  { slug: 'togaf-adm-fases', label: 'Fases del TOGAF ADM' },
  { slug: 'deflated-sharpe-ratio', label: 'Deflated Sharpe Ratio' },
  { slug: 'errores-backtesting', label: '7 errores de backtesting' },
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
