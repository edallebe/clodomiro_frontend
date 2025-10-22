// src/commons/nota/services/notaService.ts

import api, { handleApiError } from '../../../api/axios';
import { endpoints } from '../../../api/endpoints';
import type { Nota, NotaFormData } from '../../../types';

/**
 * Service Layer para Notas
 * Maneja calificaciones asociadas a inscripciones
 */
class NotaService {
  async getAll(inscripcionId?: number): Promise<Nota[]> {
    try {
      const url = inscripcionId 
        ? endpoints.notas.byInscripcion(inscripcionId)
        : endpoints.notas.list;
      
      const { data } = await api.get<Nota[]>(url);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getById(id: number): Promise<Nota> {
    try {
      const { data } = await api.get<Nota>(endpoints.notas.detail(id));
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async create(nota: NotaFormData): Promise<Nota> {
    try {
      const { data } = await api.post<Nota>(endpoints.notas.list, nota);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async update(id: number, nota: Partial<NotaFormData>): Promise<Nota> {
    try {
      const { data } = await api.patch<Nota>(endpoints.notas.detail(id), nota);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await api.delete(endpoints.notas.detail(id));
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtener estadísticas de notas
   */
  async getEstadisticas(inscripcionId?: number): Promise<{
    promedio: number;
    aprobados: number;
    reprobados: number;
    total: number;
  }> {
    try {
      const notas = await this.getAll(inscripcionId);
      const total = notas.length;
      
      if (total === 0) {
        return { promedio: 0, aprobados: 0, reprobados: 0, total: 0 };
      }

      const suma = notas.reduce((acc, nota) => acc + nota.calificacion, 0);
      const promedio = suma / total;
      const aprobados = notas.filter(n => n.calificacion >= 60).length;
      const reprobados = total - aprobados;

      return { promedio, aprobados, reprobados, total };
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtener notas con datos expandidos
   */
  async getAllWithDetails(): Promise<Nota[]> {
    try {
      const { data } = await api.get<Nota[]>(
        `${endpoints.notas.list}?expand=inscripcion`
      );
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const notaService = new NotaService();
export default notaService;