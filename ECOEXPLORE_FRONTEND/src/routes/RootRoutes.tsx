import { Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { PublicRoute, ProtectedRoute } from '@/utils/routes';
import { LandingPage } from '@/components/LandingPage';
import LoginPage from '@/pages/auth/Login/LoginPage';
import RegisterPage from '@/pages/auth/Register/RegisterPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import { UserManagement, SpeciesManagement, EcosystemManagement } from '@/pages/admin';
import { MemberDashboard, Sightings, History } from '@/pages/member';
import UserProfilePage from '@/pages/UserProfilePage';
import { MemberLayout } from '@/layouts';

function AuthNavigationHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthLogout = (event: CustomEvent) => {
      console.log('🔄 AuthNavigationHandler: Navegando a login...', event.detail);

      const currentPath = window.location.pathname;
      // Solo navegar si no estamos ya en una ruta pública
      if (currentPath !== '/login' && currentPath !== '/' && currentPath !== '/register') {
        navigate('/login', { replace: true });
      }
    };

    window.addEventListener('auth:logout', handleAuthLogout as EventListener);

    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout as EventListener);
    };
  }, [navigate]);

  return null;
}

export default function RootRoutes() {
  return (
    <>
      <AuthNavigationHandler />
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/species" element={<SpeciesManagement />} />
          <Route path="/admin/ecosystems" element={<EcosystemManagement />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['member']} />}>
          <Route element={<MemberLayout />}>
            <Route path="/member/dashboard" element={<MemberDashboard />} />
            <Route path="/member/sightings" element={<Sightings />} />
            <Route path="/member/profile" element={<UserProfilePage />} />
            <Route path="/member/history" element={<History />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          {/* Aquí puedes agregar rutas que cualquier usuario autenticado puede acceder */}
        </Route>
      </Routes>
    </>
  );
}
