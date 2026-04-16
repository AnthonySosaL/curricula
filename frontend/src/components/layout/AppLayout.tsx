import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useLogout } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/auth.store';
import { House, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { GlobalControls } from '@/components/shared/GlobalControls';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

// ── Sidebar content reutilizable (desktop + drawer móvil) ───
function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { pathname } = useLocation();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => !!s.token);
  const logout = useLogout();
  const { t } = useI18n();

  const navItems = isAuthenticated
    ? [{ to: '/dashboard', label: t('layout.businessDashboard'), icon: LayoutDashboard }]
    : [{ to: '/dashboard-public', label: t('layout.businessDashboard'), icon: LayoutDashboard }];

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
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--color-surface-soft)] md:hidden">
            <X size={20} className="text-[var(--color-text-secondary)]" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 pb-2 text-[11px] uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
          {t('layout.executivePanel')}
        </p>
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              pathname === to
                ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text)]',
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Usuario + logout */}
      <div className="px-3 py-4 border-t border-[var(--color-border)]">
        <div className="px-3 pb-2">
          <GlobalControls />
        </div>
        <div className="px-3 py-2 mb-1">
          <p className="text-sm font-medium text-[var(--color-text)] truncate">
            {isAuthenticated ? user?.name : t('layout.guest')}
          </p>
          <p className="text-xs text-[var(--color-text-muted)] truncate">
            {isAuthenticated ? user?.email : t('layout.publicView')}
          </p>
        </div>
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-red-50 hover:text-[var(--color-danger)] transition-colors"
          >
            <LogOut size={18} />
            {t('layout.logout')}
          </button>
        ) : (
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text)] transition-colors"
          >
            <House size={18} />
            {t('layout.backHome')}
          </Link>
        )}
      </div>
    </div>
  );
}

// ── Layout principal ─────────────────────────────────────────
export function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">

      {/* ── Sidebar desktop (md+) ───────────────────────────── */}
      <aside className="hidden md:flex w-64 flex-col bg-[var(--color-card)] border-r border-[var(--color-border)] fixed inset-y-0 left-0 z-20">
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
            className="absolute inset-y-0 left-0 w-72 bg-[var(--color-card)] shadow-[var(--shadow-lg)]"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent onClose={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      {/* ── Contenido principal ─────────────────────────────── */}
      <div className="flex-1 flex flex-col md:ml-64">

        {/* Header móvil (solo visible en mobile) */}
        <header className="md:hidden flex items-center justify-between gap-3 px-4 py-3 bg-[var(--color-card)] border-b border-[var(--color-border)] sticky top-0 z-10">
          <div className="flex items-center gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-lg hover:bg-[var(--color-surface-soft)] transition-colors"
            aria-label={t('layout.openMenu')}
          >
            <Menu size={20} className="text-[var(--color-text-secondary)]" />
          </button>
          <span className="text-lg font-bold text-[var(--color-primary)]">Curricula</span>
          </div>
          <GlobalControls />
        </header>

        {/* Página */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
