import { Card, CardBody } from '@/components/ui/Card';
import { useAuthStore } from '@/stores/auth.store';

const STATS = [
  { label: 'Cursos activos',   value: '0', color: 'var(--color-primary)' },
  { label: 'Completados',      value: '0', color: 'var(--color-success)' },
  { label: 'En progreso',      value: '0', color: 'var(--color-accent)'  },
];

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          Hola, {user?.name}
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm mt-1">
          Bienvenido a tu panel de aprendizaje
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATS.map(({ label, value, color }) => (
          <Card key={label}>
            <CardBody>
              <p className="text-sm text-[var(--color-text-secondary)]">{label}</p>
              <p className="text-4xl font-bold mt-1" style={{ color }}>
                {value}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
