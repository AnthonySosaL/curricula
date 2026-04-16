import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';

export default function NotFoundPage() {
  const { language } = useI18n();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)]">
      <p className="text-8xl font-bold text-[var(--color-primary)] opacity-20">404</p>
      <h1 className="mt-4 text-2xl font-bold text-[var(--color-text)]">{language === 'en' ? 'Page not found' : 'Pagina no encontrada'}</h1>
      <p className="mt-2 text-[var(--color-text-secondary)] text-sm">
        {language === 'en' ? 'The route you are looking for does not exist.' : 'La ruta que buscas no existe.'}
      </p>
      <Link
        to="/dashboard"
        className="mt-6 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
      >
        {language === 'en' ? 'Go to dashboard' : 'Ir al dashboard'}
      </Link>
    </div>
  );
}
