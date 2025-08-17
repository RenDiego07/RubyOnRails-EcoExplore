import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const PublicRoute: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (user) {
    // Si el usuario está autenticado, redirigir según su rol
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.role === 'member') {
      return <Navigate to="/member/dashboard" replace />;
    }

    // Si no tiene un rol específico, mantener en la página actual
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
