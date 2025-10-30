// src/commons/rol/services/rolService.ts

import api, { handleApiError } from '../../../api/axios';
import { endpoints } from '../../../api/endpoints';
import type { Rol } from '../../../types';

/**
 * Service Layer para Roles
 * Patrón: Repository Pattern
 * Maneja los tipos de usuario del sistema (Admin, Docente, Estudiante)
 */
class RolService {
  /**
   * Obtener todos los roles
   */
  async getAll(): Promise<Rol[]> {
    try {
      const { data } = await api.get<Rol[]>(endpoints.roles.list);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtener un rol por ID
   */
  async getById(id: number): Promise<Rol> {
    try {
      const { data } = await api.get<Rol>(endpoints.roles.detail(id));
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Crear nuevo rol
   * NOTA: En producción, esto debería estar restringido a Super Admin
   */
  async create(rol: Omit<Rol, 'idRol'>): Promise<Rol> {
    try {
      const { data } = await api.post<Rol>(endpoints.roles.list, rol);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Actualizar rol existente
   */
  async update(id: number, rol: Partial<Omit<Rol, 'idRol'>>): Promise<Rol> {
    try {
      const { data } = await api.patch<Rol>(endpoints.roles.detail(id), rol);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Eliminar rol
   * ADVERTENCIA: Esto puede causar problemas de integridad referencial
   * si existen usuarios con este rol
   */
  async delete(id: number): Promise<void> {
    try {
      await api.delete(endpoints.roles.detail(id));
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Verificar si un rol está en uso
   * Útil antes de eliminar
   */
  async isInUse(rolId: number): Promise<boolean> {
    try {
      // Verificar si hay usuarios con este rol
      const { data } = await api.get(`/api/usuarios/?rol=${rolId}`);
      return Array.isArray(data) && data.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtener estadísticas de uso por rol
   */
  async getEstadisticas(): Promise<{ [rolId: number]: { nombre: string; cantidad: number } }> {
    try {
      const roles = await this.getAll();
      const estadisticas: { [key: number]: { nombre: string; cantidad: number } } = {};

      for (const rol of roles) {
        const { data } = await api.get(`/api/usuarios/?rol=${rol.idRol}`);
        estadisticas[rol.idRol] = {
          nombre: rol.nombre_rol,
          cantidad: Array.isArray(data) ? data.length : 0,
        };
      }

      return estadisticas;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const rolService = new RolService();
export default rolService;