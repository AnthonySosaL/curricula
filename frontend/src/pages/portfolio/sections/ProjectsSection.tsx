import { GithubIcon } from '@/components/ui/BrandIcons';
import { usePortfolioData } from '@/data/portfolio';
import { useInView } from '@/hooks/useInView';
import { SectionHeader } from './SkillsSection';
import { useI18n } from '@/lib/i18n';

export function ProjectsSection({ className = 'bg-[var(--color-bg)]' }: { className?: string }) {
  const { projects } = usePortfolioData();
  const { language } = useI18n();
  const { ref: headerRef, inView: headerIn } = useInView();
  const { ref: gridRef, inView: gridIn } = useInView({ threshold: 0.05 });

  return (
    <section id="proyectos" className={`py-24 px-4 border-t border-[var(--color-border)] ${className}`}>
      <div className="max-w-5xl mx-auto">
        <div ref={headerRef}>
          <SectionHeader
            label={language === 'en' ? 'Projects' : 'Proyectos'}
            title={language === 'en' ? 'What I have built' : 'Lo que he construido'}
            subtitle={language === 'en' ? 'Personal and professional projects that show my capabilities' : 'Proyectos personales y profesionales que demuestran mis capacidades'}
            inView={headerIn}
          />
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12"
        >
          {projects.map((project, i) => (
            <div
              key={project.name}
              className="project-card group bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border)] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
              style={{
                opacity: gridIn ? 1 : 0,
                transform: gridIn ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.97)',
                transition: `opacity 0.5s ease ${i * 100}ms, transform 0.5s ease ${i * 100}ms, box-shadow 0.3s ease, border-color 0.3s ease`,
              }}
            >
              {/* Barra de color con gradiente */}
              <div
                className="h-1.5 w-full"
                style={{ background: `linear-gradient(90deg, ${project.color}, ${project.color}88)` }}
              />

              <div className="p-6 flex flex-col flex-1">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    {project.featured && (
                      <span className="inline-block mb-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        ⭐ {language === 'en' ? 'Featured' : 'Destacado'}
                      </span>
                    )}
                    <h3 className="font-bold text-[var(--color-text)] text-lg leading-snug">
                      {project.name}
                    </h3>
                  </div>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: `${project.color}18` }}
                  >
                    <div style={{ color: project.color }}>
                      <GithubIcon size={16} />
                    </div>
                  </div>
                </div>

                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed flex-1 mb-4">
                  {project.description}
                </p>

                {/* Techs */}
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
