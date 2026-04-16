import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useRegister } from '@/hooks/useAuth';
import { useI18n } from '@/lib/i18n';

const schema = z
  .object({
    name: z.string().min(2, 'Mínimo 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const { language } = useI18n();
  const register = useRegister();
  const {
    register: field,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = ({ name, email, password }: FormValues) =>
    register.mutate({ name, email, password });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[var(--shadow-lg)] p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">{language === 'en' ? 'Create account' : 'Crear cuenta'}</h1>
        <p className="text-[var(--color-text-secondary)] text-sm mb-6">
          {language === 'en' ? 'Join Curricula and start learning' : 'Unete a Curricula y empieza a aprender'}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {[
            { name: 'name' as const, label: language === 'en' ? 'Full name' : 'Nombre completo', type: 'text', placeholder: 'Juan Perez' },
            { name: 'email' as const, label: 'Email', type: 'email', placeholder: 'tu@email.com' },
            { name: 'password' as const, label: language === 'en' ? 'Password' : 'Contrasena', type: 'password', placeholder: '••••••••' },
            { name: 'confirmPassword' as const, label: language === 'en' ? 'Confirm password' : 'Confirmar contrasena', type: 'password', placeholder: '••••••••' },
          ].map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                {label}
              </label>
              <input
                {...field(name)}
                type={type}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
              {errors[name] && (
                <p className="mt-1 text-xs text-[var(--color-danger)]">{errors[name]?.message}</p>
              )}
            </div>
          ))}

          {register.error && (
            <p className="text-sm text-[var(--color-danger)] bg-[#fef2f2] px-3 py-2 rounded-lg">
              {language === 'en' ? 'Could not create account. The email may already be in use.' : 'No se pudo crear la cuenta. El email puede estar en uso.'}
            </p>
          )}

          <button
            type="submit"
            disabled={register.isPending}
            className="w-full bg-[var(--color-primary)] text-white py-2 rounded-lg font-medium text-sm hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50"
          >
            {register.isPending ? (language === 'en' ? 'Creating account...' : 'Creando cuenta...') : (language === 'en' ? 'Create account' : 'Crear cuenta')}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[var(--color-text-secondary)]">
          {language === 'en' ? 'Already have an account?' : 'Ya tienes cuenta?'}{' '}
          <Link to="/login" className="text-[var(--color-primary)] font-medium hover:underline">
            {language === 'en' ? 'Sign in' : 'Inicia sesion'}
          </Link>
        </p>
      </div>
    </div>
  );
}
