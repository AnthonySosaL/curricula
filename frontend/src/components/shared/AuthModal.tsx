import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Mail, Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useLogin, useRegister } from '@/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});

const registerSchema = z
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

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

function InputField({
  icon: Icon, label, type, placeholder, error, showToggle, ...rest
}: {
  icon: React.ElementType;
  label: string;
  type: string;
  placeholder: string;
  error?: string;
  showToggle?: boolean;
  [key: string]: unknown;
}) {
  const [show, setShow] = useState(false);
  const inputType = showToggle ? (show ? 'text' : 'password') : type;
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">{label}</label>
      <div className="relative">
        <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
        <input
          type={inputType}
          placeholder={placeholder}
          className={`w-full pl-9 pr-${showToggle ? '9' : '3'} py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all ${
            error ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]'
          }`}
          {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  );
}

export function AuthModal({ open, onClose, defaultTab = 'login' }: Props) {
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab);
  const login = useLogin();
  const register = useRegister();

  useEffect(() => { setTab(defaultTab); }, [defaultTab]);

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const loginForm = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-[0_25px_60px_-10px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <ShieldCheck size={18} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <h2 className="font-bold text-[var(--color-text)] text-lg leading-none">Panel Admin</h2>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Acceso restringido</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-[var(--color-text-muted)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mx-6 mt-5 bg-slate-100 rounded-xl p-1">
          {(['login', 'register'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                tab === t
                  ? 'bg-white text-[var(--color-primary)] shadow-[var(--shadow-sm)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              {t === 'login' ? 'Iniciar sesión' : 'Registrarse'}
            </button>
          ))}
        </div>

        {/* Forms */}
        <div className="p-6">
          {tab === 'login' ? (
            <form onSubmit={loginForm.handleSubmit((d) => login.mutate(d))} className="space-y-4">
              <InputField
                icon={Mail} label="Email" type="email" placeholder="tu@email.com"
                error={loginForm.formState.errors.email?.message}
                {...loginForm.register('email')}
              />
              <InputField
                icon={Lock} label="Contraseña" type="password" placeholder="••••••••"
                showToggle error={loginForm.formState.errors.password?.message}
                {...loginForm.register('password')}
              />
              {login.error && (
                <p className="text-sm text-[var(--color-danger)] bg-red-50 px-3 py-2 rounded-xl">
                  Credenciales inválidas
                </p>
              )}
              <button
                type="submit"
                disabled={login.isPending}
                className="w-full bg-[var(--color-primary)] text-white py-2.5 rounded-xl font-medium text-sm hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 mt-2"
              >
                {login.isPending ? 'Ingresando...' : 'Ingresar al panel'}
              </button>
            </form>
          ) : (
            <form
              onSubmit={registerForm.handleSubmit(({ name, email, password }) =>
                register.mutate({ name, email, password })
              )}
              className="space-y-4"
            >
              <InputField
                icon={User} label="Nombre completo" type="text" placeholder="Juan Pérez"
                error={registerForm.formState.errors.name?.message}
                {...registerForm.register('name')}
              />
              <InputField
                icon={Mail} label="Email" type="email" placeholder="tu@email.com"
                error={registerForm.formState.errors.email?.message}
                {...registerForm.register('email')}
              />
              <InputField
                icon={Lock} label="Contraseña" type="password" placeholder="••••••••"
                showToggle error={registerForm.formState.errors.password?.message}
                {...registerForm.register('password')}
              />
              <InputField
                icon={Lock} label="Confirmar contraseña" type="password" placeholder="••••••••"
                showToggle error={registerForm.formState.errors.confirmPassword?.message}
                {...registerForm.register('confirmPassword')}
              />
              {register.error && (
                <p className="text-sm text-[var(--color-danger)] bg-red-50 px-3 py-2 rounded-xl">
                  No se pudo crear la cuenta. El email puede estar en uso.
                </p>
              )}
              <button
                type="submit"
                disabled={register.isPending}
                className="w-full bg-[var(--color-primary)] text-white py-2.5 rounded-xl font-medium text-sm hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 mt-2"
              >
                {register.isPending ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
