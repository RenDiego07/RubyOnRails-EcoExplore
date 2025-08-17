import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { User } from '@/services/CRUD/auth/auth.service';

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
  isInitialized: boolean;
  logout: () => void;
  checkAuth: () => void;
  handleToken: (jwtToken: string) => void;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const clearSession = () => {
    console.log('🧹 AuthProvider: Clearing session');
    localStorage.removeItem('token');
    setUser(null);
  };

  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp < currentTime) {
        console.log('⏰ AuthProvider: Token has expired');
        return true;
      }

      console.log('✅ AuthProvider: Token is valid');
      return false;
    } catch (error) {
      console.error('❌ AuthProvider: Error checking token expiration', error);
      return true;
    }
  };

  const checkAuth = useCallback(() => {
    console.log('🔍 AuthProvider: === VERIFICANDO AUTENTICACIÓN ===');
    try {
      const jwtToken = localStorage.getItem('token');
      if (!jwtToken) {
        console.log('AuthProvider: No JWT token found in localStorage');
        if (user) {
          console.log('AuthProvider: Clearing user because no token found');
          setUser(null);
        }
        return;
      }

      console.log('AuthProvider: JWT token found, length:', jwtToken.length);

      if (isTokenExpired(jwtToken)) {
        console.log('AuthProvider: Token expired, clearing session');
        clearSession();
        return;
      }

      try {
        const payload = jwtDecode<{
          user_id: string;
          role: string;
          email?: string;
          name?: string;
          exp: number;
        }>(jwtToken);
        console.log('AuthProvider: Decoded payload:', payload);

        if (payload.user_id) {
          const userFromToken: User = {
            id: payload.user_id,
            email: payload.email || '',
            name: payload.name || '',
            role: payload.role === 'admin' || payload.role === 'member' ? payload.role : 'member',
            active: true,
          };
          setUser((prevUser) => {
            if (!prevUser || prevUser.id !== userFromToken.id) {
              console.log('AuthProvider: Updating user state');
              return userFromToken;
            }
            return prevUser;
          });
        } else {
          console.log('AuthProvider: Invalid payload - no user_id found');
          clearSession();
        }
      } catch (decodeError) {
        console.error('AuthProvider: Error decoding token:', decodeError);
        clearSession();
      }
    } catch (error) {
      console.error('AuthProvider: General error in checkAuth:', error);
      clearSession();
    }
  }, [user]);

  // Inicialización inicial
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      checkAuth();
      setIsLoading(false);
      setIsInitialized(true);
    };
    initializeAuth();
  }, [checkAuth]);

  // Escuchar eventos de logout desde interceptors de API
  useEffect(() => {
    const handleAuthLogout = (event: CustomEvent) => {
      console.log('🔔 AuthProvider: Received automatic logout event:', event.detail);
      clearSession();
    };

    window.addEventListener('auth:logout', handleAuthLogout as EventListener);

    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout as EventListener);
    };
  }, []);

  const logout = () => {
    console.log('AuthProvider: === CERRANDO SESIÓN ===');
    clearSession();
    console.log('✅ AuthProvider: Session closed');
  };

  const handleToken = (jwtToken: string) => {
    console.log('🔍 AuthProvider: === Saving JWT token in localStorage ===');
    localStorage.setItem('token', jwtToken);
    console.log('AuthProvider: JWT token saved correctly');
    checkAuth();
  };

  const isAuthenticated = !!user;

  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  const value: AuthContextType = {
    user,
    setUser,
    isLoading,
    isInitialized,
    logout,
    checkAuth,
    handleToken,
    isAuthenticated,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
