import { ArrowRight, LineChart, Lock, Sparkles, UserPlus2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

const CARDS = [
  {
    title: 'Metrica de trafico',
    text: 'Cuantas visitas recibe el portafolio y como evoluciona por dia.',
    icon: LineChart,
  },
  {
    title: 'Uso de IA',
    text: 'Nivel de adopcion del asistente y oportunidades de mejora.',
    icon: Sparkles,
  },
  {
    title: 'Crecimiento de usuarios',
    text: 'Lectura de usuarios reales desde base de datos con desglose por roles.',
    icon: UserPlus2,
  },
];

export default function DashboardLoginPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f8fafc_0%,#eff6ff_45%,#ecfeff_100%)] px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 lg:gap-8">
          <section className="rounded-3xl border border-[var(--color-border)] bg-white/90 backdrop-blur-sm p-6 sm:p-9 shadow-[var(--shadow-lg)]">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Dashboard Login</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] mt-3 leading-tight">
              Centro de indicadores para decisiones de producto
            </h1>
            <p className="mt-4 text-[var(--color-text-secondary)] text-sm sm:text-base max-w-2xl">
              Elige como quieres entrar: con inicio de sesion para datos reales o sin iniciar sesion para una vista demo profesional.
            </p>

            <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3">
              <p className="text-sm font-semibold text-blue-900">Elige tu acceso</p>
              <p className="text-xs text-blue-800 mt-1">1) Iniciar sesion para datos reales. 2) Entrar sin iniciar sesion para demo.</p>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link to="/login" className="block">
                <Button className="w-full justify-between h-12" size="md">
                  Quiero iniciar sesion
                  <ArrowRight size={16} />
                </Button>
              </Link>

              <Link to="/dashboard-preview" className="block">
                <Button className="w-full justify-between h-12" size="md" variant="secondary">
                  Entrar sin iniciar sesion
                  <LineChart size={16} />
                </Button>
              </Link>
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link to="/register" className="block sm:col-start-1">
                <Button className="w-full justify-between h-12" size="md" variant="ghost">
                  No tengo cuenta, registrarme
                  <UserPlus2 size={16} />
                </Button>
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {CARDS.map(({ title, text, icon: Icon }) => (
                <article key={title} className="rounded-2xl border border-[var(--color-border)] bg-slate-50 p-4">
                  <span className="inline-flex size-8 items-center justify-center rounded-lg bg-white text-[var(--color-primary)] border border-[var(--color-border)]">
                    <Icon size={16} />
                  </span>
                  <h2 className="mt-3 text-sm font-semibold text-[var(--color-text)]">{title}</h2>
                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{text}</p>
                </article>
              ))}
            </div>
          </section>

          <aside className="rounded-3xl border border-[var(--color-border)] bg-white p-6 sm:p-7 shadow-[var(--shadow-md)]">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-[var(--color-primary)] flex items-center justify-center">
              <Lock size={18} />
            </div>
            <h2 className="mt-4 text-xl font-bold text-[var(--color-text)]">Acceso profesional</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              Si inicias sesion, el dashboard combina base de datos + metricas de uso del sitio para entregar resumenes ejecutivos listos para IA.
            </p>

            <ul className="mt-5 space-y-2 text-sm text-[var(--color-text-secondary)]">
              <li>Indicador de visitas totales y tendencia semanal</li>
              <li>Adopcion y frecuencia del asistente IA</li>
              <li>Tasa de conversion de visitantes a usuarios</li>
              <li>Prompt listo para analisis empresarial con IA</li>
            </ul>

            <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50 p-4">
              <p className="text-xs uppercase tracking-wide text-sky-700">Tip</p>
              <p className="text-sm text-sky-900 mt-1">
                Usa la vista demo en reuniones y luego inicia sesion para validar resultados contra datos reales.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
