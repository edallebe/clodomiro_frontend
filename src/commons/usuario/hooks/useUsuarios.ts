// src/commons/usuario/hooks/useUsuarios.ts

import { useState, useEffect, useCallback } from 'react';
import { usuarioService } from '../services/usuarioService';
import type { Usuario, LoadingState } from '../../../types';
import type { ApiError } from '../../../api/axios';

interface UseUsuariosReturn {
  usuarios: Usuario[];
  loading: LoadingState;
  error: ApiError | null;
  fetchUsuarios: (rolId?: number) => Promise<void>;
  createUsuario: (data: Omit<Usuario, 'idUsuario' | 'rol_detail'>) => Promise<void>;
  updateUsuario: (id: number, data: Partial<Usuario>) => Promise<void>;
  deleteUsuario: (id: number) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useUsuarios = (rolId?: number): UseUsuariosReturn => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<ApiError | null>(null);

  const fetchUsuarios = useCallback(async (filterRolId?: number) => {
    setLoading('loading');
    setError(null);

    try {
      const data = await usuarioService.getAll(filterRolId);
      setUsuarios(data);
      setLoading('success');
    } catch (err) {
      setError(err as ApiError);
      setLoading('error');
    }
  }, []);

  const createUsuario = useCallback(async (data: Omit<Usuario, 'idUsuario' | 'rol_detail'>) => {
    setLoading('loading');
    setError(null);

    try {
      const newUsuario = await usuarioService.create(data);
      setUsuarios(prev => [...prev, newUsuario]);
      setLoading('success');
    } catch (err) {
      setError(err as ApiError);
      setLoading('error');
      throw err;
    }
  }, []);

  const updateUsuario = useCallback(async (id: number, data: Partial<Usuario>) => {
    setLoading('loading');
    setError(null);

    try {
      const updated = await usuarioService.update(id, data);
      setUsuarios(prev => prev.map(u => u.idUsuario === id ? updated : u));
      setLoading('success');
    } catch (err) {
      setError(err as ApiError);
      setLoading('error');
      throw err;
    }
  }, []);

  const deleteUsuario = useCallback(async (id: number) => {
    setLoading('loading');
    setError(null);

    try {
      await usuarioService.delete(id);
      setUsuarios(prev => prev.filter(u => u.idUsuario !== id));
      setLoading('success');
    } catch (err) {
      setError(err as ApiError);
      setLoading('error');
      throw err;
    }
  }, []);

  const refetch = useCallback(() => fetchUsuarios(rolId), [fetchUsuarios, rolId]);

  useEffect(() => {
    fetchUsuarios(rolId);
  }, [fetchUsuarios, rolId]);

  return {
    usuarios,
    loading,
    error,
    fetchUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    refetch,
  };
};

export const useUsuario = (id: number) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      setLoading('loading');
      setError(null);

      try {
        const data = await usuarioService.getById(id);
        setUsuario(data);
        setLoading('success');
      } catch (err) {
        setError(err as ApiError);
        setLoading('error');
      }
    };

    if (id) {
      fetchUsuario();
    }
  }, [id]);

  return { usuario, loading, error };
};