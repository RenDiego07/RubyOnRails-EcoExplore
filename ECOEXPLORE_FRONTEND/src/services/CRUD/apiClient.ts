/* eslint-disable */
import axios from 'axios';
import { EnvConfig } from '@/env.config';

const APIClient = axios.create({
  baseURL: EnvConfig.back_end_url,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

APIClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

APIClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log('🔐 APIClient: Token inválido o expirado, limpiando sesión');

      localStorage.removeItem('token');

      window.dispatchEvent(
        new CustomEvent('auth:logout', {
          detail: {
            reason: 'api_401',
            url: error.config?.url,
            method: error.config?.method,
          },
        })
      );
    }

    return Promise.reject(error);
  }
);

export default APIClient;

/* eslint-enable */
