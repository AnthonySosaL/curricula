import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)]">
      <p className="text-8xl font-bold text-[var(--color-primary)] opacity-20">404</p>
      <h1 className="mt-4 text-2xl font-bold text-[var(--color-text)]">Página no encontrada</h1>
      <p className="mt-2 text-[var(--color-text-secondary)] text-sm">
        La ruta que buscas no existe.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
      >
        Ir al dashboard
      </Link>
    </div>
  );
}
