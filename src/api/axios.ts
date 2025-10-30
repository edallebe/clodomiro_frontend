// src/api/axios.ts

import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Configuración de Axios con interceptores
 * Patrón: Singleton + Interceptor Pattern
 * Responsabilidades:
 * - Inyección automática de tokens
 * - Manejo centralizado de errores
 * - Refresh token logic (futuro)
 * - Logging de requests en desarrollo
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===== REQUEST INTERCEPTOR =====
// Inyecta el token JWT si existe en localStorage
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log en desarrollo
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ===== RESPONSE INTERCEPTOR =====
// Manejo centralizado de errores HTTP
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log en desarrollo
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.status}`, response.data);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Manejo de errores por código HTTP
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token expirado o inválido
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          break;

        case 403:
          console.error('Acceso denegado - Permisos insuficientes');
          break;

        case 404:
          console.error('Recurso no encontrado');
          break;

        case 500:
          console.error('Error interno del servidor');
          break;

        default:
          console.error(`Error HTTP ${error.response.status}`, error.response.data);
      }
    } else if (error.request) {
      // Request enviado pero sin respuesta (problema de red)
      console.error('Error de red - Sin respuesta del servidor');
    } else {
      // Error en la configuración del request
      console.error('Error en la configuración:', error.message);
    }

    return Promise.reject(error);
  }
);

// ===== HELPER TYPES =====
export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.message || error.message || 'Error desconocido',
      status: error.response?.status,
      errors: error.response?.data?.errors,
    };
  }
  return {
    message: 'Error inesperado',
  };
};

export default api;