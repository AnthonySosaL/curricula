import { Award, Download, ExternalLink, Calendar } from 'lucide-react';
import { usePortfolioData } from '@/data/portfolio';
import { useI18n } from '@/lib/i18n';
import { ScrollStorySection, type StoryPhase } from './ScrollStorySection';

export function CertificatesSection({ className = '' }: { className?: string }) {
  const { profile } = usePortfolioData();
  const { language } = useI18n();

  const certs = [
    {
      name: 'AWS Academy Graduate',
      detail: 'Cloud Foundations',
      issuer: 'Amazon Web Services (AWS)',
      date: language === 'en' ? 'April 2026' : 'Abril 2026',
      color: '#FF9900',
      bg: '#FFF8EE',
      badge: '☁️',
      file: (profile.links as { certificate?: string }).certificate,
      verify: null as string | null,
    },
  ];

  const content = (
    <div className="flex flex-wrap justify-center gap-5">
      {certs.map((cert) => (
        <div
          key={cert.name}
          className="group relative w-full sm:w-80 bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-[var(--shadow-md)] hover:-translate-y-1 transition-all"
        >
          {/* Barra superior con color del proveedor */}
          <div className="h-1" style={{ backgroundColor: cert.color }} />

          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: cert.bg }}
              >
                {cert.badge}
              </div>
              <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                <Calendar size={11} />
                {cert.date}
              </div>
            </div>

            <h3 className="font-bold text-[var(--color-text)] text-sm leading-tight">
              {cert.name}
            </h3>
            <p className="text-xs font-medium mt-0.5" style={{ color: cert.color }}>
              {cert.detail}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">{cert.issuer}</p>

            <div className="mt-4 flex gap-2">
              {cert.file && (
                <a
                  href={cert.file}
                  download
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 px-3 rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors bg-[var(--color-card)]"
                >
                  <Download size={13} />
                  {language === 'en' ? 'Download' : 'Descargar'}
                </a>
              )}
              {cert.verify && (
                <a
                  href={cert.verify}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 text-xs font-medium py-2 px-3 rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors"
                >
                  <ExternalLink size={13} />
                  {language === 'en' ? 'Verify' : 'Verificar'}
                </a>
              )}
            </div>
          </div>

          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Award size={16} style={{ color: cert.color }} />
          </div>
        </div>
      ))}
    </div>
  );

  const phases: StoryPhase[] = [
    {
      title: language === 'en' ? 'Credentials' : 'Credenciales',
      subtitle: language === 'en'
        ? 'Official certifications earned'
        : 'Certificaciones oficiales obtenidas',
      content,
    },
  ];

  return (
    <ScrollStorySection
      id="certificados"
      badge={language === 'en' ? 'Certifications' : 'Certificaciones'}
      phases={phases}
      className={className}
      contentMinHeight="min(42vh, 380px)"
    />
  );
}
