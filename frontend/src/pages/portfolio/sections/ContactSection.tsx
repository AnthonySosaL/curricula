import { useState } from 'react';
import { Mail, Phone, MapPin, Copy, Check } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons';
import { usePortfolioData } from '@/data/portfolio';
import { useI18n } from '@/lib/i18n';
import { ScrollStorySection, type StoryPhase } from './ScrollStorySection';

function CopyButton({ text, title }: { text: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      title={title}
      className="ml-auto p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-red-50 transition-all shrink-0"
    >
      {copied ? <Check size={14} className="text-[var(--color-success)]" /> : <Copy size={14} />}
    </button>
  );
}

export function ContactSection({ className = '' }: { className?: string }) {
  const { profile } = usePortfolioData();
  const { language } = useI18n();

  const items = [
    {
      icon: Mail,
      label: 'Email',
      value: profile.email,
      href: null,
      iconColor: 'bg-red-50 text-[var(--color-primary)]',
      borderHover: 'hover:border-red-300',
      extra: <CopyButton text={profile.email} title={language === 'en' ? 'Copy email' : 'Copiar email'} />,
    },
    {
      icon: Phone,
      label: language === 'en' ? 'Phone' : 'Telefono',
      value: profile.phone,
      href: null,
      iconColor: 'bg-green-50 text-[var(--color-success)]',
      borderHover: 'hover:border-green-300',
      extra: <CopyButton text={profile.phone} title={language === 'en' ? 'Copy phone' : 'Copiar telefono'} />,
    },
    {
      icon: GithubIcon,
      label: 'GitHub',
      value: profile.links.github.replace('https://', ''),
      href: profile.links.github,
      iconColor: 'bg-slate-100 text-slate-600',
      borderHover: 'hover:border-slate-400',
      extra: null,
    },
    {
      icon: LinkedinIcon,
      label: 'LinkedIn',
      value: profile.links.linkedin.replace('https://www.', ''),
      href: profile.links.linkedin,
      iconColor: 'bg-red-50 text-red-600',
      borderHover: 'hover:border-red-400',
      extra: null,
    },
  ];

  const content = (
    <div className="max-w-3xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map(({ icon: Icon, label, value, href, iconColor, borderHover, extra }) => {
          const cardClass = `group flex items-center gap-4 p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] hover:shadow-[var(--shadow-md)] hover:-translate-y-1 ${borderHover}`;
          const inner = (
            <>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconColor} shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                <Icon size={20} />
              </div>
              <div className="overflow-hidden flex-1 min-w-0">
                <p className="text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wide">
                  {label}
                </p>
                <p className="text-sm font-semibold text-[var(--color-text)] truncate group-hover:text-[var(--color-primary)] transition-colors">
                  {value}
                </p>
              </div>
              {extra}
            </>
          );
          return href ? (
            <a key={label} data-card href={href} target="_blank" rel="noreferrer" className={cardClass}>
              {inner}
            </a>
          ) : (
            <div key={label} data-card className={cardClass}>
              {inner}
            </div>
          );
        })}
      </div>

      {/* Ubicación */}
      <div data-card className="mt-4 p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] flex items-center gap-4 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5">
        <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
          <MapPin size={20} className="text-[var(--color-accent)]" />
        </div>
        <div>
          <p className="text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wide">{language === 'en' ? 'Location' : 'Ubicacion'}</p>
          <p className="text-sm font-semibold text-[var(--color-text)]">{profile.location}</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-[var(--color-success)] font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-success)]" />
          </span>
          {language === 'en' ? 'Available' : 'Disponible'}
        </div>
      </div>
    </div>
  );

  const phases: StoryPhase[] = [
    {
      title: language === 'en' ? "Let's talk" : 'Hablemos',
      subtitle: language === 'en'
        ? 'Do you have a project in mind or want to work together? Contact me.'
        : 'Tienes un proyecto en mente o quieres trabajar juntos? Contactame.',
      content,
    },
  ];

  return (
    <ScrollStorySection
      id="contacto"
      badge={language === 'en' ? 'Contact' : 'Contacto'}
      phases={phases}
      className={className}
    />
  );
}
