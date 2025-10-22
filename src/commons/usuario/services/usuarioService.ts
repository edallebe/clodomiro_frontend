// src/commons/usuario/services/usuarioService.ts

import api, { handleApiError } from '../../../api/axios';
import { endpoints } from '../../../api/endpoints';
import type { Usuario, UsuarioFormData } from '../../../types';

/**
 * Service Layer para Usuarios
 * Maneja operaciones CRUD sobre la entidad Usuario
 * NOTA: password se maneja con cuidado (nunca se retorna en GET)
 */
class UsuarioService {
  async getAll(rolId?: number): Promise<Usuario[]> {
    try {
      const url = rolId 
        ? endpoints.usuarios.byRole(rolId)
        : endpoints.usuarios.list;
      
      const { data } = await api.get<Usuario[]>(url);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getById(id: number): Promise<Usuario> {
    try {
      const { data } = await api.get<Usuario>(endpoints.usuarios.detail(id));
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async create(usuario: UsuarioFormData): Promise<Usuario> {
    try {
      const { data } = await api.post<Usuario>(endpoints.usuarios.list, usuario);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async update(id: number, usuario: Partial<UsuarioFormData>): Promise<Usuario> {
    try {
      // Si password está vacío, no lo enviamos
      const updateData = { ...usuario };
      if (updateData.password === '') {
        delete updateData.password;
      }
      
      const { data } = await api.patch<Usuario>(endpoints.usuarios.detail(id), updateData);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await api.delete(endpoints.usuarios.detail(id));
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtener usuarios filtrados por múltiples roles
   */
  async getByRoles(roleIds: number[]): Promise<Usuario[]> {
    try {
      const promises = roleIds.map(roleId => 
        api.get<Usuario[]>(endpoints.usuarios.byRole(roleId))
      );
      const responses = await Promise.all(promises);
      const allUsers = responses.flatMap(res => res.data);
      
      // Eliminar duplicados por idUsuario
      const uniqueUsers = allUsers.filter((user, index, self) =>
        index === self.findIndex(u => u.idUsuario === user.idUsuario)
      );
      
      return uniqueUsers;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const usuarioService = new UsuarioService();
export default usuarioService;