import { useState } from 'react';
import { Globe, ExternalLink, Info } from 'lucide-react';
import { GithubIcon } from '@/components/ui/BrandIcons';
import { usePortfolioData } from '@/data/portfolio';
import { useI18n } from '@/lib/i18n';
import { ScrollStorySection, type StoryPhase } from './ScrollStorySection';
import { ProjectDetailsModal } from './ProjectDetailsModal';

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
  color: string;
  featured?: boolean;
  live?: boolean;
  github: string | null;
  demo: string | null;
  details?: ProjectDetail;
}

function ProjectCard({
  project, language, onOpenDetails,
}: { project: ProjectItem; language: string; onOpenDetails: (p: ProjectItem) => void }) {
  const isLive = Boolean(project.live && project.demo);
  const hasGithub = Boolean(project.github);
  const hasDemo = Boolean(project.demo);

  return (
    <div
      data-card
      className="project-card group bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border)] overflow-hidden flex flex-col transition-all hover:-translate-y-1.5"
      style={{ boxShadow: `0 0 0 1px ${project.color}22` }}
    >
      {/* Barra de color con gradiente */}
      <div
        className="h-1.5 w-full"
        style={{ background: `linear-gradient(90deg, ${project.color}, ${project.color}88)` }}
      />
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            {project.featured && (
              <span className="inline-block mb-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                ⭐ {language === 'en' ? 'Featured' : 'Destacado'}
              </span>
            )}
            {isLive && (
              <span
                className="inline-flex items-center gap-1 mb-1.5 text-xs font-semibold px-2 py-0.5 rounded-full border"
                style={{
                  backgroundColor: `${project.color}18`,
                  color: project.color,
                  borderColor: `${project.color}55`,
                }}
              >
                🌐 {language === 'en' ? 'Live demo' : 'Demo pública'}
              </span>
            )}
            <h3 className="font-bold text-[var(--color-text)] text-lg leading-snug">
              {project.name}
            </h3>
          </div>

          {/* Iconos de enlaces reales: GitHub solo si hay repo, web solo si hay demo */}
          <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
            {hasGithub && (
              <a
                href={project.github!}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label={language === 'en' ? 'View repository' : 'Ver repositorio'}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text)] bg-[var(--color-surface-soft)] hover:bg-slate-200 transition-colors"
              >
                <GithubIcon size={15} />
              </a>
            )}
            {hasDemo && (
              <a
                href={project.demo!}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label={language === 'en' ? 'Visit site' : 'Visitar sitio'}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ backgroundColor: `${project.color}18`, color: project.color }}
              >
                <Globe size={15} />
              </a>
            )}
          </div>
        </div>

        <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed flex-1 mb-4">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techs.map((t) => (
            <span
              key={t}
              className="skill-badge px-2 py-0.5 rounded-full bg-white text-slate-600 text-xs border border-[var(--color-border)] cursor-default"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Boton de info: abre el modal con el detalle completo del proyecto */}
        <button
          type="button"
          onClick={() => onOpenDetails(project)}
          className="flex items-center justify-center gap-1.5 mt-auto pt-4 border-t border-[var(--color-border)] text-xs font-semibold transition-colors"
          style={{ color: project.color }}
        >
          <Info size={13} />
          {language === 'en' ? 'View details' : 'Ver detalles'}
          <ExternalLink size={11} className="opacity-0 group-hover:opacity-60 transition-opacity" />
        </button>
      </div>
    </div>
  );
}

export function ProjectsSection({ className = '' }: { className?: string }) {
  const { projects } = usePortfolioData();
  const { language } = useI18n();
  const [selected, setSelected] = useState<ProjectItem | null>(null);
  const featured = projects.slice(0, 2);
  const rest = projects.slice(2);

  const grid = (items: ProjectItem[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((p) => (
        <ProjectCard key={p.name} project={p} language={language} onOpenDetails={setSelected} />
      ))}
    </div>
  );

  const phases: StoryPhase[] = [
    {
      title: language === 'en' ? 'What I have built' : 'Lo que he construido',
      subtitle: language === 'en'
        ? 'Featured projects that show my capabilities'
        : 'Proyectos destacados que demuestran mis capacidades',
      content: grid(featured),
    },
    ...(rest.length > 0
      ? [{
          title: language === 'en' ? 'More projects' : 'Mas proyectos',
          subtitle: language === 'en'
            ? 'Personal projects, government and private sector work'
            : 'Proyectos personales y trabajo para sector publico y privado',
          content: grid(rest),
        }]
      : []),
  ];

  return (
    <>
      <ScrollStorySection
        id="proyectos"
        badge={language === 'en' ? 'Projects' : 'Proyectos'}
        phases={phases}
        className={className}
      />
      <ProjectDetailsModal project={selected} language={language} onClose={() => setSelected(null)} />
    </>
  );
}
