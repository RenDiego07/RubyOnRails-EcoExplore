// import { useMemo } from 'react';
// import { useAuth } from './useAuth';
// import { PROFILE_ROUTES, DASHBOARD_ROUTES, AUTH_ROUTES, type UserRole } from '@/constants/routes';

// export const useRoutes = () => {
//   const { user } = useAuth();

//   const routes = useMemo(() => {
//     // Determinar el rol principal del usuario (con prioridad)
//     const getPrimaryRole = (): UserRole | null => {
//       if (!user?.roles || user.roles.length === 0) {
//         return null;
//       }

//       // Prioridad: HR > MANAGER > DIRECTOR > USER
//       if (user.roles.includes('HR')) return 'HR';
//       if (user.roles.includes('MANAGER')) return 'MANAGER';
//       if (user.roles.includes('DIRECTOR')) return 'DIRECTOR';
//       if (user.roles.includes('USER')) return 'USER';

//       return null;
//     };

//     // const primaryRole = getPrimaryRole();

//     return {
//       // Rutas específicas del usuario
//       profile: primaryRole ? PROFILE_ROUTES[primaryRole] : AUTH_ROUTES.LOGIN,
//       dashboard: primaryRole ? DASHBOARD_ROUTES[primaryRole] : AUTH_ROUTES.LOGIN,

//       // Información del rol
//       primaryRole,
//       hasRole: (role: UserRole) => user?.roles?.includes(role) ?? false,

//       // Rutas estáticas
//       auth: AUTH_ROUTES,

//       // Función helper para navegación
//       getProfileRoute: () => (primaryRole ? PROFILE_ROUTES[primaryRole] : AUTH_ROUTES.LOGIN),
//       getDashboardRoute: () => (primaryRole ? DASHBOARD_ROUTES[primaryRole] : AUTH_ROUTES.LOGIN),
//     };
//   }, [user?.roles]);

//   return routes;
// };

// // Hook específico para obtener solo la ruta del perfil
// export const useProfileRoute = () => {
//   const { getProfileRoute } = useRoutes();
//   return getProfileRoute();
// };
