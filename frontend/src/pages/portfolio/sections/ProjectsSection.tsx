import { Globe, ExternalLink } from 'lucide-react';
import { GithubIcon } from '@/components/ui/BrandIcons';
import { usePortfolioData } from '@/data/portfolio';
import { useI18n } from '@/lib/i18n';
import { ScrollStorySection, type StoryPhase } from './ScrollStorySection';

interface ProjectItem {
  name: string;
  description: string;
  techs: string[];
  color: string;
  featured?: boolean;
  live?: boolean;
  demo?: string | null;
}

function ProjectCardInner({ project, language }: { project: ProjectItem; language: string }) {
  const isLive = Boolean(project.live && project.demo);
  return (
    <>
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
            <h3 className="font-bold text-[var(--color-text)] text-lg leading-snug flex items-center gap-1.5">
              {project.name}
              {isLive && (
                <ExternalLink
                  size={14}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: project.color }}
                />
              )}
            </h3>
          </div>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
            style={{ backgroundColor: `${project.color}18` }}
          >
            <div style={{ color: project.color }}>
              {isLive ? <Globe size={16} /> : <GithubIcon size={16} />}
            </div>
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

        {/* Pie decorativo — los links a repos/demos se agregaran cuando esten publicos */}
        <div className="flex items-center mt-auto pt-4 border-t border-[var(--color-border)]">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          {isLive && (
            <span
              className="ml-auto text-xs font-medium flex items-center gap-1"
              style={{ color: project.color }}
            >
              {language === 'en' ? 'Visit site' : 'Visitar sitio'}
              <ExternalLink size={11} />
            </span>
          )}
        </div>
      </div>
    </>
  );
}

function ProjectCard({ project, language }: { project: ProjectItem; language: string }) {
  const isLive = Boolean(project.live && project.demo);
  const base = 'project-card group bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border)] overflow-hidden flex flex-col transition-all';

  // Card cliqueable SOLO si tiene live+demo (proyecto público visitable)
  if (isLive) {
    return (
      <a
        data-card
        href={project.demo!}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${language === 'en' ? 'Open' : 'Abrir'} ${project.name}`}
        className={`${base} cursor-pointer hover:-translate-y-2 hover:shadow-xl no-underline text-inherit`}
        style={{ boxShadow: `0 0 0 1px ${project.color}22` }}
      >
        <ProjectCardInner project={project} language={language} />
      </a>
    );
  }

  // Card normal (no cliqueable)
  return (
    <div data-card className={`${base} hover:-translate-y-1.5`}>
      <ProjectCardInner project={project} language={language} />
    </div>
  );
}

export function ProjectsSection({ className = '' }: { className?: string }) {
  const { projects } = usePortfolioData();
  const { language } = useI18n();
  const featured = projects.slice(0, 2);
  const rest = projects.slice(2);

  const grid = (items: ProjectItem[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((p) => (
        <ProjectCard key={p.name} project={p} language={language} />
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
            ? 'Work for government and private sector'
            : 'Trabajo para sector publico y privado',
          content: grid(rest),
        }]
      : []),
  ];

  return (
    <ScrollStorySection
      id="proyectos"
      badge={language === 'en' ? 'Projects' : 'Proyectos'}
      phases={phases}
      className={className}
    />
  );
}
