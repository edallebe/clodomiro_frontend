// src/commons/asignatura/services/asignaturaService.ts

import api, { handleApiError} from '../../../api/axios';
import { endpoints } from '../../../api/endpoints';
import type { Asignatura } from '../../../types/index';
import type { AsignaturaFormData } from '../../../types/index';

/**
 * Service Layer para Asignaturas
 * Patrón: Repository Pattern
 * Responsabilidad: Abstracción de la comunicación con la API
 * Ventaja: La UI no conoce detalles de implementación HTTP
 */

class AsignaturaService {
  /**
   * Obtener todas las asignaturas
   * Opcionalmente filtrar por docente
   */
  async getAll(docenteId?: number): Promise<Asignatura[]> {
    try {
      const url = docenteId 
        ? endpoints.asignaturas.byDocente(docenteId)
        : endpoints.asignaturas.list;
      
      const { data } = await api.get<Asignatura[]>(url);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtener una asignatura por ID
   */
  async getById(id: number): Promise<Asignatura> {
    try {
      const { data } = await api.get<Asignatura>(endpoints.asignaturas.detail(id));
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Crear nueva asignatura
   */
  async create(asignatura: AsignaturaFormData): Promise<Asignatura> {
    try {
      const { data } = await api.post<Asignatura>(
        endpoints.asignaturas.list,
        asignatura
      );
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Actualizar asignatura existente
   */
  async update(id: number, asignatura: Partial<AsignaturaFormData>): Promise<Asignatura> {
    try {
      const { data } = await api.patch<Asignatura>(
        endpoints.asignaturas.detail(id),
        asignatura
      );
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Eliminar asignatura
   */
  async delete(id: number): Promise<void> {
    try {
      await api.delete(endpoints.asignaturas.detail(id));
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtener asignaturas con información del docente expandida
   * Requiere modificar el serializer en Django para incluir nested data
   */
  async getWithDocentes(): Promise<Asignatura[]> {
    try {
      // Este endpoint requeriría un serializer personalizado en Django
      const { data } = await api.get<Asignatura[]>(
        `${endpoints.asignaturas.list}?expand=docente`
      );
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// Export como singleton
export const asignaturaService = new AsignaturaService();
export default asignaturaService;