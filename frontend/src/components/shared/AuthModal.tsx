import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Mail, Lock, User, Eye, EyeOff, ShieldCheck, LineChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLogin, useRegister } from '@/hooks/useAuth';
import { useI18n } from '@/lib/i18n';

type LoginValues = {
  email: string;
  password: string;
};

type RegisterValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

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
  const navigate = useNavigate();
  const { t } = useI18n();

  const loginSchema = useMemo(() => z.object({
    email: z.string().email(t('auth.invalidEmail')),
    password: z.string().min(8, t('auth.min8Chars')),
  }), [t]);

  const registerSchema = useMemo(() => z
    .object({
      name: z.string().min(2, t('auth.min2Chars')),
      email: z.string().email(t('auth.invalidEmail')),
      password: z.string().min(8, t('auth.min8Chars')),
      confirmPassword: z.string(),
    })
    .refine((d) => d.password === d.confirmPassword, {
      message: t('auth.passwordsNoMatch'),
      path: ['confirmPassword'],
    }), [t]);

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
      <div className="relative w-full max-w-md bg-[var(--color-card)] rounded-2xl shadow-[0_25px_60px_-10px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in-95 duration-200 border border-[var(--color-border)]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center">
              <ShieldCheck size={18} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <h2 className="font-bold text-[var(--color-text)] text-lg leading-none">{t('brand.dashboardLogin')}</h2>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{t('auth.professionalAccess')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--color-surface-soft)] transition-colors text-[var(--color-text-muted)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mx-6 mt-5 bg-[var(--color-surface-soft)] rounded-xl p-1">
          {(['login', 'register'] as const).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                tab === tabKey
                  ? 'bg-[var(--color-card)] text-[var(--color-primary)] shadow-[var(--shadow-sm)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              {tabKey === 'login' ? t('auth.login') : t('auth.register')}
            </button>
          ))}
        </div>

        <div className="mx-6 mt-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate('/dashboard-public');
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-secondary)] text-sm hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
          >
            <span>{t('auth.noSessionPublic')}</span>
            <LineChart size={15} />
          </button>
        </div>

        {/* Forms */}
        <div className="p-6">
          {tab === 'login' ? (
            <form onSubmit={loginForm.handleSubmit((d) => login.mutate(d))} className="space-y-4">
              <InputField
                icon={Mail} label={t('auth.email')} type="email" placeholder="tu@email.com"
                error={loginForm.formState.errors.email?.message}
                {...loginForm.register('email')}
              />
              <InputField
                icon={Lock} label={t('auth.password')} type="password" placeholder="••••••••"
                showToggle error={loginForm.formState.errors.password?.message}
                {...loginForm.register('password')}
              />
              {login.error && (
                <p className="text-sm text-[var(--color-danger)] bg-red-50 px-3 py-2 rounded-xl">
                  {t('auth.invalidCredentials')}
                </p>
              )}
              <button
                type="submit"
                disabled={login.isPending}
                className="w-full bg-[var(--color-primary)] text-white py-2.5 rounded-xl font-medium text-sm hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 mt-2"
              >
                {login.isPending
                  ? t('auth.signingIn')
                  : t('auth.loginToDashboard')}
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
                icon={User} label={t('auth.fullName')} type="text" placeholder="Juan Perez"
                error={registerForm.formState.errors.name?.message}
                {...registerForm.register('name')}
              />
              <InputField
                icon={Mail} label={t('auth.email')} type="email" placeholder="tu@email.com"
                error={registerForm.formState.errors.email?.message}
                {...registerForm.register('email')}
              />
              <InputField
                icon={Lock} label={t('auth.password')} type="password" placeholder="••••••••"
                showToggle error={registerForm.formState.errors.password?.message}
                {...registerForm.register('password')}
              />
              <InputField
                icon={Lock} label={t('auth.confirmPassword')} type="password" placeholder="••••••••"
                showToggle error={registerForm.formState.errors.confirmPassword?.message}
                {...registerForm.register('confirmPassword')}
              />
              {register.error && (
                <p className="text-sm text-[var(--color-danger)] bg-red-50 px-3 py-2 rounded-xl">
                  {t('auth.registerFailed')}
                </p>
              )}
              <button
                type="submit"
                disabled={register.isPending}
                className="w-full bg-[var(--color-primary)] text-white py-2.5 rounded-xl font-medium text-sm hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 mt-2"
              >
                {register.isPending
                  ? t('auth.creatingAccount')
                  : t('auth.createAccount')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
