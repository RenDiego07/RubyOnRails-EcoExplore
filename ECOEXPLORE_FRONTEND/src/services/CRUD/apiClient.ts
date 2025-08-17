import axios from 'axios';
import { EnvConfig } from '@/env.config';

const APIClient = axios.create({
  baseURL: EnvConfig.back_end_url,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor para requests - agregar token automáticamente
APIClient.interceptors.request.use((config) => {
  // Obtener token de localStorage (usar 'token' como clave consistente)
  const token = localStorage.getItem('token');

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para responses - manejar errores de autenticación
APIClient.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, simplemente la devolvemos
    return response;
  },
  (error) => {
    // Si hay error en la respuesta
    if (error.response?.status === 401) {
      console.log('🔐 APIClient: Token inválido o expirado, limpiando sesión');

      // Limpiar token de localStorage (usar 'token' como clave consistente)
      localStorage.removeItem('token');

      // Disparar evento personalizado para que AuthProvider se entere
      window.dispatchEvent(
        new CustomEvent('auth:logout', {
          detail: {
            reason: 'api_401',
            url: error.config?.url,
            method: error.config?.method,
          },
        })
      );

      // El componente AuthNavigationHandler se encargará de la navegación
    }

    return Promise.reject(error);
  }
);

export default APIClient;
