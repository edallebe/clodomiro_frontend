// src/types/index.ts

/**
 * Tipos base del dominio de negocio
 * Reflejan las entidades del backend Django
 * Patrón: Type-Driven Development
 */

// ===== ENTIDADES BASE =====

export interface Rol {
  idRol: number;
  nombre_rol: string;
}

export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  password?: string; // Opcional en responses
  rol: number; // FK al idRol
  rol_detail?: Rol; // Nested serializer (si se implementa en DRF)
}

export interface Asignatura {
  idAsignatura: number;
  nombre: string;
  docente: number; // FK al idUsuario
  docente_detail?: Usuario;
}

export interface Curso {
  idCurso: number;
  nombre_curso: string;
  asignatura: number; // FK al idAsignatura
  asignatura_detail?: Asignatura;
}

export interface Inscripcion {
  idInscripcion: number;
  estudiante: number; // FK al idUsuario
  curso: number; // FK al idCurso
  asignatura: number; // FK al idAsignatura
  estudiante_detail?: Usuario;
  curso_detail?: Curso;
  asignatura_detail?: Asignatura;
}

export interface Nota {
  idnotas: number;
  calificacion: number;
  inscripcion: number; // FK al idInscripcion
  inscripcion_detail?: Inscripcion;
}

// ===== TIPOS UTILITARIOS =====

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface FormErrors {
  [key: string]: string[];
}

// ===== TIPOS DE UI =====

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface TableColumn<T> {
  id: keyof T;
  label: string;
  align?: 'left' | 'center' | 'right';
  format?: (value: any) => string;
  sortable?: boolean;
}

// ===== ENUMS =====

// export enum RolEnum {
//   ADMIN = 1,
//   DOCENTE = 2,
//   ESTUDIANTE = 3,
// }

// export enum EstadoCalificacion {
//   REPROBADO = 0,
//   APROBADO_BASICO = 60,
//   APROBADO_SATISFACTORIO = 75,
//   APROBADO_EXCELENTE = 90,
// }

// ===== TIPOS PARA FORMULARIOS =====

export type UsuarioFormData = Omit<Usuario, 'idUsuario' | 'rol_detail'>;
export type AsignaturaFormData = Omit<Asignatura, 'idAsignatura' | 'docente_detail'>;
export type CursoFormData = Omit<Curso, 'idCurso' | 'asignatura_detail'>;
export type InscripcionFormData = Omit<Inscripcion, 'idInscripcion' | 'estudiante_detail' | 'curso_detail' | 'asignatura_detail'>;
export type NotaFormData = Omit<Nota, 'idnotas' | 'inscripcion_detail'>;