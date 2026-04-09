import { Award, Download, ExternalLink, Calendar } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { SectionHeader } from './SkillsSection';
import { profile } from '@/data/portfolio';

const CERTS = [
  {
    name: 'AWS Academy Graduate',
    detail: 'Cloud Foundations',
    issuer: 'Amazon Web Services (AWS)',
    date: 'Abril 2026',
    color: '#FF9900',
    bg: '#FFF8EE',
    badge: '☁️',
    file: (profile.links as { certificate?: string }).certificate,
    verify: null as string | null,
  },
];

export function CertificatesSection() {
  const { ref: headerRef, inView: headerIn } = useInView();
  const { ref: cardsRef, inView: cardsIn } = useInView({ threshold: 0.1 });

  return (
    <section id="certificados" className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div ref={headerRef}>
          <SectionHeader
            label="Certificaciones"
            title="Credenciales"
            subtitle="Certificaciones oficiales obtenidas"
            inView={headerIn}
          />
        </div>

        <div ref={cardsRef} className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CERTS.map((cert, i) => (
            <div
              key={cert.name}
              className="group relative bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-[var(--shadow-md)] hover:-translate-y-1 transition-all"
              style={{
                opacity: cardsIn ? 1 : 0,
                transform: cardsIn ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 0.5s ease ${i * 100}ms, transform 0.5s ease ${i * 100}ms, box-shadow 0.25s ease`,
              }}
            >
              {/* Barra superior con color del proveedor */}
              <div className="h-1" style={{ backgroundColor: cert.color }} />

              <div className="p-5">
                {/* Badge + Proveedor */}
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

                {/* Nombre */}
                <h3 className="font-bold text-[var(--color-text)] text-sm leading-tight">
                  {cert.name}
                </h3>
                <p className="text-xs font-medium mt-0.5" style={{ color: cert.color }}>
                  {cert.detail}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">{cert.issuer}</p>

                {/* Botón descargar */}
                <div className="mt-4 flex gap-2">
                  {cert.file && (
                    <a
                      href={cert.file}
                      download
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 px-3 rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors bg-white"
                    >
                      <Download size={13} />
                      Descargar
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
                      Verificar
                    </a>
                  )}
                </div>
              </div>

              {/* Sello decorativo */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Award size={16} style={{ color: cert.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
