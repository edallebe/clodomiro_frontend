// src/commons/rol/hooks/useRoles.ts

import { useState, useEffect, useCallback } from 'react';
import { rolService } from '../services/rolService';
import type { Rol, LoadingState } from '../../../types';
import type { ApiError } from '../../../api/axios';

interface UseRolesReturn {
  roles: Rol[];
  loading: LoadingState;
  error: ApiError | null;
  estadisticas: { [rolId: number]: { nombre: string; cantidad: number } };
  fetchRoles: () => Promise<void>;
  createRol: (data: Omit<Rol, 'idRol'>) => Promise<void>;
  updateRol: (id: number, data: Partial<Rol>) => Promise<void>;
  deleteRol: (id: number) => Promise<void>;
  checkRolInUse: (id: number) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export const useRoles = (): UseRolesReturn => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<ApiError | null>(null);
  const [estadisticas, setEstadisticas] = useState<{ [rolId: number]: { nombre: string; cantidad: number } }>({});

  const fetchRoles = useCallback(async () => {
    setLoading('loading');
    setError(null);

    try {
      const data = await rolService.getAll();
      setRoles(data);
      
      // Cargar estadísticas
      const stats = await rolService.getEstadisticas();
      setEstadisticas(stats);
      
      setLoading('success');
    } catch (err) {
      setError(err as ApiError);
      setLoading('error');
    }
  }, []);

  const createRol = useCallback(async (data: Omit<Rol, 'idRol'>) => {
    setLoading('loading');
    setError(null);

    try {
      const newRol = await rolService.create(data);
      setRoles(prev => [...prev, newRol]);
      setLoading('success');
    } catch (err) {
      setError(err as ApiError);
      setLoading('error');
      throw err;
    }
  }, []);

  const updateRol = useCallback(async (id: number, data: Partial<Rol>) => {
    setLoading('loading');
    setError(null);

    try {
      const updated = await rolService.update(id, data);
      setRoles(prev => prev.map(r => r.idRol === id ? updated : r));
      setLoading('success');
    } catch (err) {
      setError(err as ApiError);
      setLoading('error');
      throw err;
    }
  }, []);

  const deleteRol = useCallback(async (id: number) => {
    setLoading('loading');
    setError(null);

    try {
      // Verificar si está en uso
      const inUse = await rolService.isInUse(id);
      if (inUse) {
        throw new Error('No se puede eliminar un rol que tiene usuarios asignados');
      }

      await rolService.delete(id);
      setRoles(prev => prev.filter(r => r.idRol !== id));
      setLoading('success');
    } catch (err) {
      setError(err as ApiError);
      setLoading('error');
      throw err;
    }
  }, []);

  const checkRolInUse = useCallback(async (id: number): Promise<boolean> => {
    try {
      return await rolService.isInUse(id);
    } catch (err) {
      return false;
    }
  }, []);

  const refetch = useCallback(() => fetchRoles(), [fetchRoles]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return {
    roles,
    loading,
    error,
    estadisticas,
    fetchRoles,
    createRol,
    updateRol,
    deleteRol,
    checkRolInUse,
    refetch,
  };
};

/**
 * Hook para obtener un solo rol por ID
 */
export const useRol = (id: number) => {
  const [rol, setRol] = useState<Rol | null>(null);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchRol = async () => {
      setLoading('loading');
      setError(null);

      try {
        const data = await rolService.getById(id);
        setRol(data);
        setLoading('success');
      } catch (err) {
        setError(err as ApiError);
        setLoading('error');
      }
    };

    if (id) {
      fetchRol();
    }
  }, [id]);

  return { rol, loading, error };
};