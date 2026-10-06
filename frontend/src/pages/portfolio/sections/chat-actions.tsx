import { Download } from 'lucide-react';
import { certificates } from '@/data/certificates';
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
export function detectChatActions(userText: string, replyText: string, links: Links, en: boolean): ChatAction[] {
  const q = norm(`${userText}\n${replyText}`);
  const actions: ChatAction[] = [];

  if (/\bcv\b|hoja de vida|curriculum|curriculo|\bresume\b/.test(q)) {
    actions.push({ kind: 'cv', label: en ? 'Download CV (PDF)' : 'Descargar CV (PDF)', href: links.cv, download: true });
  }
  if (/certificad|certificat|certification|credencial|credential|simulearn|\baws\b|cloud foundations|practitioner/.test(q)) {
    // Si la pregunta nombra certificados concretos se muestran solo esos; si es general, los tres.
    const asked = norm(userText);
    const specific = certificates.filter((c) => c.match.test(asked));
    for (const cert of specific.length ? specific : certificates) {
      actions.push({
        kind: 'certificate',
        label: cert.chatLabel[en ? 'en' : 'es'],
        href: cert.file ?? cert.verify,
        download: cert.file !== null,
      });
    }
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
          key={a.href}
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
