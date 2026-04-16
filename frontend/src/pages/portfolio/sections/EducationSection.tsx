import { GraduationCap, MapPin, Languages } from 'lucide-react';
import { usePortfolioData } from '@/data/portfolio';
import { useInView } from '@/hooks/useInView';
import { SectionHeader } from './SkillsSection';
import { useI18n } from '@/lib/i18n';

export function EducationSection() {
  const { education, languages } = usePortfolioData();
  const { language } = useI18n();
  const { ref: headerRef, inView: headerIn } = useInView();
  const { ref: cardsRef, inView: cardsIn } = useInView({ threshold: 0.1 });
  const { ref: langRef, inView: langIn } = useInView({ threshold: 0.3 });

  return (
    <section id="educacion" className="py-24 px-4 bg-[var(--color-surface-soft)] border-b border-[var(--color-border)]">
      <div className="max-w-3xl mx-auto">
        <div ref={headerRef}>
          <SectionHeader
            label={language === 'en' ? 'Education' : 'Educacion'}
            title={language === 'en' ? 'Academic background' : 'Formacion academica'}
            subtitle={language === 'en' ? 'My academic base and continuous learning' : 'Mi base academica y formacion continua'}
            inView={headerIn}
          />
        </div>

        <div ref={cardsRef} className="mt-12 space-y-4">
          {education.map((edu, i) => (
            <div
              key={i}
              className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 flex items-start gap-4 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 transition-all"
              style={{
                opacity: cardsIn ? 1 : 0,
                transform: cardsIn ? 'translateX(0)' : 'translateX(-24px)',
                transition: `opacity 0.55s ease ${i * 150}ms, transform 0.55s ease ${i * 150}ms, box-shadow 0.25s ease, translate 0.25s ease`,
              }}
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

        {/* Idiomas con barras animadas */}
        <div
          ref={langRef}
          className="mt-6 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 shadow-[var(--shadow-sm)]"
          style={{
            opacity: langIn ? 1 : 0,
            transform: langIn ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.55s ease 300ms, transform 0.55s ease 300ms',
          }}
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Languages size={16} className="text-[var(--color-primary)]" />
            </div>
            <h3 className="font-semibold text-[var(--color-text)] text-sm uppercase tracking-wide">
              {language === 'en' ? 'Languages' : 'Idiomas'}
            </h3>
          </div>
          <div className="space-y-5">
            {languages.map(({ name, level, percent }, i) => (
              <div key={name}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-[var(--color-text)]">{name}</span>
                  <span className="text-xs font-medium text-[var(--color-text-muted)] bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {level}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-blue-400"
                    style={{
                      width: langIn ? `${percent}%` : '0%',
                      transition: `width 1s cubic-bezier(0.22, 1, 0.36, 1) ${i * 200 + 400}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
