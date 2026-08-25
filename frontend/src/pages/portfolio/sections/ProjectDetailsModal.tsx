import { useEffect } from 'react';
import { X, ExternalLink, Sparkles } from 'lucide-react';
import { GithubIcon } from '@/components/ui/BrandIcons';

interface ProjectDetail {
  summary: string;
  highlights: string[];
  stack: { label: string; items: string }[];
  numbers?: string[];
}

interface ProjectItem {
  name: string;
  description: string;
  techs: string[];
  github: string | null;
  demo: string | null;
  color: string;
  details?: ProjectDetail;
}

interface Props {
  project: ProjectItem | null;
  language: string;
  onClose: () => void;
}

export function ProjectDetailsModal({ project, language, onClose }: Props) {
  const en = language === 'en';

  // Cerrar con Escape y bloquear el scroll de fondo mientras el modal esta abierto
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  if (!project) return null;
  const details = project.details;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-[var(--color-card)] rounded-2xl shadow-[0_25px_60px_-10px_rgba(0,0,0,0.35)] border border-[var(--color-border)] animate-in fade-in zoom-in-95 duration-200"
        style={{ boxShadow: `0 0 0 1px ${project.color}33` }}
      >
        {/* Barra de color */}
        <div className="h-1.5 w-full sticky top-0 z-10" style={{ background: `linear-gradient(90deg, ${project.color}, ${project.color}88)` }} />

        <div className="p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${project.color}18` }}
              >
                <Sparkles size={18} style={{ color: project.color }} />
              </div>
              <h2 className="font-bold text-[var(--color-text)] text-lg leading-snug">{project.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 -mt-1 -mr-1 rounded-lg hover:bg-[var(--color-surface-soft)] transition-colors text-[var(--color-text-muted)] shrink-0"
              aria-label={en ? 'Close' : 'Cerrar'}
            >
              <X size={18} />
            </button>
          </div>

          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-5">
            {details?.summary ?? project.description}
          </p>

          {details?.numbers && details.numbers.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {details.numbers.map((n) => (
                <span
                  key={n}
                  className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                  style={{ backgroundColor: `${project.color}12`, color: project.color, borderColor: `${project.color}40` }}
                >
                  {n}
                </span>
              ))}
            </div>
          )}

          {details?.highlights && details.highlights.length > 0 && (
            <div className="mb-5">
              <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-muted)] font-semibold mb-2">
                {en ? 'Highlights' : 'Lo destacado'}
              </p>
              <ul className="space-y-2">
                {details.highlights.map((h) => (
                  <li key={h} className="text-sm text-[var(--color-text-secondary)] leading-relaxed pl-4 relative">
                    <span
                      className="absolute left-0 top-[0.55em] w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {details?.stack && details.stack.length > 0 && (
            <div className="mb-5">
              <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-muted)] font-semibold mb-2">
                {en ? 'Stack' : 'Tecnologias'}
              </p>
              <div className="space-y-2">
                {details.stack.map((s) => (
                  <div key={s.label} className="text-sm bg-[var(--color-surface-soft)] rounded-xl px-3 py-2">
                    <span className="font-semibold text-[var(--color-text)]">{s.label}: </span>
                    <span className="text-[var(--color-text-secondary)]">{s.items}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.techs.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-full bg-white text-slate-600 text-xs border border-[var(--color-border)]"
              >
                {t}
              </span>
            ))}
          </div>

          {(project.github || project.demo) && (
            <div className="flex gap-2 pt-4 border-t border-[var(--color-border)]">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2.5 px-3 rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  <GithubIcon size={14} />
                  {en ? 'View repository' : 'Ver repositorio'}
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2.5 px-3 rounded-xl text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: project.color }}
                >
                  <ExternalLink size={14} />
                  {en ? 'Visit site' : 'Visitar sitio'}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
