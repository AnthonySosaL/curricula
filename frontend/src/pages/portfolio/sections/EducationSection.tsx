import { GraduationCap, MapPin, Languages } from 'lucide-react';
import { usePortfolioData } from '@/data/portfolio';
import { useI18n } from '@/lib/i18n';
import { ScrollStorySection, type StoryPhase } from './ScrollStorySection';

export function EducationSection({ className = '' }: { className?: string }) {
  const { education, languages } = usePortfolioData();
  const { language } = useI18n();

  const educationContent = (
    <div className="max-w-3xl mx-auto space-y-4">
      {education.map((edu, i) => (
        <div
          key={i}
          className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 flex items-start gap-4 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center shrink-0">
            <GraduationCap size={22} className="text-[var(--color-success)]" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-[var(--color-text)]">{edu.degree}</h3>
                <p className="text-[var(--color-primary)] text-sm font-medium">{edu.institution}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="inline-block px-3 py-1 rounded-full bg-green-50 text-[var(--color-success)] text-xs font-medium">
                  {edu.period}
                </span>
                <p className="flex items-center justify-end gap-1 text-xs text-[var(--color-text-muted)] mt-1">
                  <MapPin size={11} />
                  {edu.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const languagesContent = (
    <div className="max-w-3xl mx-auto">
      <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 shadow-[var(--shadow-sm)]">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
            <Languages size={16} className="text-[var(--color-primary)]" />
          </div>
          <h3 className="font-semibold text-[var(--color-text)] text-sm uppercase tracking-wide">
            {language === 'en' ? 'Languages' : 'Idiomas'}
          </h3>
        </div>
        <div className="space-y-5">
          {languages.map(({ name, level, percent }) => (
            <div key={name}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-[var(--color-text)]">{name}</span>
                <span className="text-xs font-medium text-[var(--color-text-muted)] bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {level}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-orange-400"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const phases: StoryPhase[] = [
    {
      title: language === 'en' ? 'Academic background' : 'Formacion academica',
      subtitle: language === 'en'
        ? 'My academic base and continuous learning'
        : 'Mi base academica y formacion continua',
      content: educationContent,
    },
    {
      title: language === 'en' ? 'Languages' : 'Idiomas',
      subtitle: language === 'en'
        ? 'Communication beyond code'
        : 'Comunicacion mas alla del codigo',
      content: languagesContent,
    },
  ];

  return (
    <ScrollStorySection
      id="educacion"
      badge={language === 'en' ? 'Education' : 'Educacion'}
      phases={phases}
      className={className}
    />
  );
}
