// src/commons/curso/services/cursoService.ts

import api, { handleApiError } from '../../../api/axios';
import { endpoints } from '../../../api/endpoints';
import type { Curso, CursoFormData } from '../../../types';

/**
 * Service Layer para Cursos
 * Patrón: Repository Pattern
 */
class CursoService {
  async getAll(asignaturaId?: number): Promise<Curso[]> {
    try {
      const url = asignaturaId 
        ? endpoints.cursos.byAsignatura(asignaturaId)
        : endpoints.cursos.list;
      
      const { data } = await api.get<Curso[]>(url);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getById(id: number): Promise<Curso> {
    try {
      const { data } = await api.get<Curso>(endpoints.cursos.detail(id));
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async create(curso: CursoFormData): Promise<Curso> {
    try {
      const { data } = await api.post<Curso>(endpoints.cursos.list, curso);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async update(id: number, curso: Partial<CursoFormData>): Promise<Curso> {
    try {
      const { data } = await api.patch<Curso>(endpoints.cursos.detail(id), curso);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await api.delete(endpoints.cursos.detail(id));
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getByAsignaturaWithDetails(asignaturaId: number): Promise<Curso[]> {
    try {
      const { data } = await api.get<Curso[]>(
        `${endpoints.cursos.byAsignatura(asignaturaId)}?expand=asignatura`
      );
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const cursoService = new CursoService();
export default cursoService;