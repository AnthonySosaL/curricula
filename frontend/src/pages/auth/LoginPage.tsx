import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useLogin } from '@/hooks/useAuth';
import { useI18n } from '@/lib/i18n';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { language } = useI18n();
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[var(--shadow-lg)] p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">{language === 'en' ? 'Sign in' : 'Iniciar sesion'}</h1>
        <p className="text-[var(--color-text-secondary)] text-sm mb-6">
          {language === 'en' ? 'Welcome back to Curricula' : 'Bienvenido de nuevo a Curricula'}
        </p>

        <form onSubmit={handleSubmit((d) => login.mutate(d))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              placeholder="tu@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              {language === 'en' ? 'Password' : 'Contrasena'}
            </label>
            <input
              {...register('password')}
              type="password"
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.password.message}</p>
            )}
          </div>

          {login.error && (
            <p className="text-sm text-[var(--color-danger)] bg-[#fef2f2] px-3 py-2 rounded-lg">
              {language === 'en' ? 'Invalid credentials. Check your email and password.' : 'Credenciales invalidas. Verifica tu email y contrasena.'}
            </p>
          )}

          <button
            type="submit"
            disabled={login.isPending}
            className="w-full bg-[var(--color-primary)] text-white py-2 rounded-lg font-medium text-sm hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50"
          >
            {login.isPending ? (language === 'en' ? 'Signing in...' : 'Ingresando...') : (language === 'en' ? 'Sign in' : 'Ingresar')}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[var(--color-text-secondary)]">
          {language === 'en' ? 'No account yet?' : 'No tienes cuenta?'}{' '}
          <Link to="/register" className="text-[var(--color-primary)] font-medium hover:underline">
            {language === 'en' ? 'Register' : 'Registrate'}
          </Link>
        </p>
      </div>
    </div>
  );
}
