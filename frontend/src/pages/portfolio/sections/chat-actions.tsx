import { Download } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons';

export interface ChatAction {
  kind: 'cv' | 'certificate' | 'linkedin' | 'github';
  label: string;
  href: string;
  download?: boolean;
}

interface Links {
  github: string;
  linkedin: string;
  cv: string;
  certificate: string;
}

// Normaliza para comparar sin acentos ni mayúsculas
function norm(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

/**
 * Detecta la intención en la pregunta del usuario para ofrecer botones de
 * descarga (CV, certificado) o enlaces a redes (LinkedIn, GitHub). Así el
 * visitante no tiene que buscar dónde descargar.
 */
export function detectChatActions(userText: string, links: Links, en: boolean): ChatAction[] {
  const q = norm(userText);
  const actions: ChatAction[] = [];

  if (/\bcv\b|hoja de vida|curriculum|curriculo|\bresume\b/.test(q)) {
    actions.push({ kind: 'cv', label: en ? 'Download CV (PDF)' : 'Descargar CV (PDF)', href: links.cv, download: true });
  }
  if (/certificad|certificat|certification|\baws\b|cloud foundations/.test(q) && links.certificate) {
    actions.push({ kind: 'certificate', label: en ? 'AWS certificate (PDF)' : 'Certificado AWS (PDF)', href: links.certificate, download: true });
  }
  if (/linkedin/.test(q)) {
    actions.push({ kind: 'linkedin', label: 'LinkedIn', href: links.linkedin });
  }
  if (/github|git hub|repositor|\brepos?\b|codigo fuente|source code/.test(q)) {
    actions.push({ kind: 'github', label: 'GitHub', href: links.github });
  }
  return actions;
}

function ActionIcon({ kind }: { kind: ChatAction['kind'] }) {
  if (kind === 'github') return <GithubIcon size={13} />;
  if (kind === 'linkedin') return <LinkedinIcon size={13} />;
  return <Download size={13} />;
}

export function ChatActions({ actions }: { actions: ChatAction[] }) {
  if (!actions.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {actions.map((a) => (
        <a
          key={a.kind}
          href={a.href}
          {...(a.download ? { download: true } : { target: '_blank', rel: 'noreferrer' })}
          className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors no-underline"
        >
          <ActionIcon kind={a.kind} />
          {a.label}
        </a>
      ))}
    </div>
  );
}
