// src/api/endpoints.ts

/**
 * Centralización de endpoints del backend Django
 * Patrón: Configuration Object
 * Ventaja: Single source of truth para URLs
 */

const BASE_PATH = '/api';

export const endpoints = {
  // Roles
  roles: {
    list: `${BASE_PATH}/roles/`,
    detail: (id: number) => `${BASE_PATH}/roles/${id}/`,
  },

  // Usuarios
  usuarios: {
    list: `${BASE_PATH}/usuarios/`,
    detail: (id: number) => `${BASE_PATH}/usuarios/${id}/`,
    byRole: (roleId: number) => `${BASE_PATH}/usuarios/?rol=${roleId}`,
  },

  // Asignaturas
  asignaturas: {
    list: `${BASE_PATH}/asignaturas/`,
    detail: (id: number) => `${BASE_PATH}/asignaturas/${id}/`,
    byDocente: (docenteId: number) => `${BASE_PATH}/asignaturas/?docente=${docenteId}`,
  },

  // Cursos
  cursos: {
    list: `${BASE_PATH}/cursos/`,
    detail: (id: number) => `${BASE_PATH}/cursos/${id}/`,
    byAsignatura: (asignaturaId: number) => `${BASE_PATH}/cursos/?asignatura=${asignaturaId}`,
  },

  // Inscripciones
  inscripciones: {
    list: `${BASE_PATH}/inscripciones/`,
    detail: (id: number) => `${BASE_PATH}/inscripciones/${id}/`,
    byEstudiante: (estudianteId: number) => `${BASE_PATH}/inscripciones/?estudiante=${estudianteId}`,
    byCurso: (cursoId: number) => `${BASE_PATH}/inscripciones/?curso=${cursoId}`,
  },

  // Notas
  notas: {
    list: `${BASE_PATH}/notas/`,
    detail: (id: number) => `${BASE_PATH}/notas/${id}/`,
    byInscripcion: (inscripcionId: number) => `${BASE_PATH}/notas/?inscripcion=${inscripcionId}`,
    byCalificacion: (calificacion: number) => `${BASE_PATH}/notas/?calificacion=${calificacion}`,
  },
} as const;

// Type-safe helper para construcción de URLs con query params
export const buildUrl = (base: string, params?: Record<string, string | number>): string => {
  if (!params) return base;
  
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  
  return `${base}?${queryString}`;
};