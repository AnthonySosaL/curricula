import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useLogout } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/auth.store';
import { BookOpen, LayoutDashboard, LogOut, User, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/cursos',    label: 'Cursos',    icon: BookOpen },
  { to: '/perfil',   label: 'Perfil',    icon: User },
];

// ── Sidebar content reutilizable (desktop + drawer móvil) ───
function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { pathname } = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  const handleLogout = () => {
    onClose?.();
    logout();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo + close (solo en drawer móvil) */}
      <div className="px-6 py-5 border-b border-[var(--color-border)] flex items-center justify-between">
        <span className="text-xl font-bold text-[var(--color-primary)]">Curricula</span>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 md:hidden">
            <X size={20} className="text-[var(--color-text-secondary)]" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              pathname === to
                ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:bg-slate-50 hover:text-[var(--color-text)]',
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Usuario + logout */}
      <div className="px-3 py-4 border-t border-[var(--color-border)]">
        <div className="px-3 py-2 mb-1">
          <p className="text-sm font-medium text-[var(--color-text)] truncate">{user?.name}</p>
          <p className="text-xs text-[var(--color-text-muted)] truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-red-50 hover:text-[var(--color-danger)] transition-colors"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

// ── Layout principal ─────────────────────────────────────────
export function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">

      {/* ── Sidebar desktop (md+) ───────────────────────────── */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-[var(--color-border)] fixed inset-y-0 left-0 z-20">
        <SidebarContent />
      </aside>

      {/* ── Overlay + Drawer móvil ──────────────────────────── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          onClick={() => setDrawerOpen(false)}
        >
          {/* Fondo oscuro */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Drawer */}
          <aside
            className="absolute inset-y-0 left-0 w-72 bg-white shadow-[var(--shadow-lg)]"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent onClose={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      {/* ── Contenido principal ─────────────────────────────── */}
      <div className="flex-1 flex flex-col md:ml-64">

        {/* Header móvil (solo visible en mobile) */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-[var(--color-border)] sticky top-0 z-10">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Abrir menú"
          >
            <Menu size={20} className="text-[var(--color-text-secondary)]" />
          </button>
          <span className="text-lg font-bold text-[var(--color-primary)]">Curricula</span>
        </header>

        {/* Página */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
