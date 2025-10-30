// src/commons/rol/types/rolTypes.ts

/**
 * Tipos específicos del módulo de Roles
 * Complementa los tipos globales en src/types/index.ts
 */

export interface Rol {
  idRol: number;
  nombre_rol: string;
}

export type RolFormData = Omit<Rol, 'idRol'>;

/**
 * Enum para roles del sistema (predefinidos)
 */
export const RolSistema = {
  ADMIN: 1,
  DOCENTE: 2,
  ESTUDIANTE: 3,
} as const;

export type RolSistema = typeof RolSistema[keyof typeof RolSistema];

/**
 * Constantes de roles
 */
export const ROLES_SISTEMA = {
  ADMIN: { id: 1, nombre: 'Administrador', icono: '👑' },
  DOCENTE: { id: 2, nombre: 'Docente', icono: '👨‍🏫' },
  ESTUDIANTE: { id: 3, nombre: 'Estudiante', icono: '🎓' },
} as const;

/**
 * Helper para verificar si un rol es del sistema
 */
export const isRolSistema = (rolId: number): boolean => {
  return rolId >= 1 && rolId <= 3;
};

/**
 * Helper para obtener el nombre del rol por ID
 */
export const getRolNombre = (rolId: number): string => {
  switch (rolId) {
    case RolSistema.ADMIN:
      return 'Administrador';
    case RolSistema.DOCENTE:
      return 'Docente';
    case RolSistema.ESTUDIANTE:
      return 'Estudiante';
    default:
      return 'Rol personalizado';
  }
};

/**
 * Helper para obtener permisos por rol
 * (Para implementación futura de control de acceso)
 */
export const getRolPermisos = (rolId: number): string[] => {
  switch (rolId) {
    case RolSistema.ADMIN:
      return ['*']; // Todos los permisos
    case RolSistema.DOCENTE:
      return [
        'asignaturas.read',
        'asignaturas.create',
        'cursos.read',
        'cursos.create',
        'notas.read',
        'notas.create',
        'notas.update',
        'inscripciones.read',
      ];
    case RolSistema.ESTUDIANTE:
      return [
        'asignaturas.read',
        'cursos.read',
        'inscripciones.read',
        'notas.read',
      ];
    default:
      return [];
  }
};

/**
 * Estadísticas de uso de rol
 */
export interface RolEstadistica {
  idRol: number;
  nombre_rol: string;
  cantidad_usuarios: number;
  porcentaje: number;
  en_uso: boolean;
}

/**
 * Filtros para consulta de roles
 */
export interface RolFilters {
  en_uso?: boolean;
  sistema?: boolean;
  busqueda?: string;
}