// src/commons/inscripcion/services/inscripcionService.ts

import api, { handleApiError } from '../../../api/axios';
import { endpoints } from '../../../api/endpoints';
import type { Inscripcion, InscripcionFormData } from '../../../types';

/**
 * Service Layer para Inscripciones
 * Maneja la relación Estudiante-Curso-Asignatura
 */
class InscripcionService {
  async getAll(filters?: { estudiante?: number; curso?: number }): Promise<Inscripcion[]> {
    try {
      let url = endpoints.inscripciones.list;
      
      if (filters?.estudiante) {
        url = endpoints.inscripciones.byEstudiante(filters.estudiante);
      } else if (filters?.curso) {
        url = endpoints.inscripciones.byCurso(filters.curso);
      }
      
      const { data } = await api.get<Inscripcion[]>(url);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getById(id: number): Promise<Inscripcion> {
    try {
      const { data } = await api.get<Inscripcion>(endpoints.inscripciones.detail(id));
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async create(inscripcion: InscripcionFormData): Promise<Inscripcion> {
    try {
      const { data } = await api.post<Inscripcion>(
        endpoints.inscripciones.list,
        inscripcion
      );
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async update(id: number, inscripcion: Partial<InscripcionFormData>): Promise<Inscripcion> {
    try {
      const { data } = await api.patch<Inscripcion>(
        endpoints.inscripciones.detail(id),
        inscripcion
      );
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await api.delete(endpoints.inscripciones.detail(id));
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Verificar si ya existe una inscripción
   */
  async checkDuplicate(estudianteId: number, cursoId: number): Promise<boolean> {
    try {
      const inscripciones = await this.getAll({ estudiante: estudianteId });
      return inscripciones.some(i => i.curso === cursoId);
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtener inscripciones con datos expandidos
   */
  async getAllWithDetails(): Promise<Inscripcion[]> {
    try {
      const { data } = await api.get<Inscripcion[]>(
        `${endpoints.inscripciones.list}?expand=estudiante,curso,asignatura`
      );
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const inscripcionService = new InscripcionService();
export default inscripcionService;