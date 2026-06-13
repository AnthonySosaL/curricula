import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import PortfolioPage from '@/pages/portfolio/PortfolioPage';

// El juego (three.js) se carga en su propio chunk para no pesar en el portafolio
const GamePage = lazy(() => import('@/pages/game/GamePage'));
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import PublicDashboardPage from '@/pages/dashboard/PublicDashboardPage';
import NotFoundPage from '@/pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Portfolio público — lo que ven todos */}
          <Route path="/" element={<PortfolioPage />} />

          {/* Mini-juego Robot Runner */}
          <Route
            path="/juego"
            element={(
              <Suspense fallback={<div className="fixed inset-0 bg-[#160707]" />}>
                <GamePage />
              </Suspense>
            )}
          />
          <Route
            path="/game"
            element={(
              <Suspense fallback={<div className="fixed inset-0 bg-[#160707]" />}>
                <GamePage />
              </Suspense>
            )}
          />

          {/* Auth */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Dashboard publico sin sesion con mismo layout */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard-public" element={<PublicDashboardPage />} />
          </Route>

          {/* Dashboard privado — protegido con JWT */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
