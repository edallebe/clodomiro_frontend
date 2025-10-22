// src/commons/asignatura/hooks/useAsignaturas.ts

import { useState, useEffect, useCallback } from 'react';
import { asignaturaService } from '../services/asignaturaService';
import type { Asignatura, LoadingState } from '../../../types/index';
import type { ApiError } from '../../../api/axios';

/**
 * Custom Hook para gestión de estado de Asignaturas
 * Patrón: Custom Hook + State Management
 * Encapsula lógica de fetching, caching y mutaciones
 */

interface UseAsignaturasReturn {
  asignaturas: Asignatura[];
  loading: LoadingState;
  error: ApiError | null;
  fetchAsignaturas: (docenteId?: number) => Promise<void>;
  createAsignatura: (data: Omit<Asignatura, 'idAsignatura'>) => Promise<void>;
  updateAsignatura: (id: number, data: Partial<Asignatura>) => Promise<void>;
  deleteAsignatura: (id: number) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useAsignaturas = (docenteId?: number): UseAsignaturasReturn => {
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<ApiError | null>(null);

  // Fetch principal con useCallback para evitar re-renders innecesarios
  const fetchAsignaturas = useCallback(async (filterDocenteId?: number) => {
    setLoading('loading');
    setError(null);

    try {
      const data = await asignaturaService.getAll(filterDocenteId);
      setAsignaturas(data);
      setLoading('success');
    } catch (err) {
      setError(err as ApiError);
      setLoading('error');
    }
  }, []);

  // Crear nueva asignatura
  const createAsignatura = useCallback(async (data: Omit<Asignatura, 'idAsignatura'>) => {
    setLoading('loading');
    setError(null);

    try {
      const newAsignatura = await asignaturaService.create(data);
      setAsignaturas(prev => [...prev, newAsignatura]);
      setLoading('success');
    } catch (err) {
      setError(err as ApiError);
      setLoading('error');
      throw err; // Re-throw para manejo en UI (mostrar toast/snackbar)
    }
  }, []);

  // Actualizar asignatura existente
  const updateAsignatura = useCallback(async (id: number, data: Partial<Asignatura>) => {
    setLoading('loading');
    setError(null);

    try {
      const updated = await asignaturaService.update(id, data);
      setAsignaturas(prev => 
        prev.map(a => a.idAsignatura === id ? updated : a)
      );
      setLoading('success');
    } catch (err) {
      setError(err as ApiError);
      setLoading('error');
      throw err;
    }
  }, []);

  // Eliminar asignatura
  const deleteAsignatura = useCallback(async (id: number) => {
    setLoading('loading');
    setError(null);

    try {
      await asignaturaService.delete(id);
      setAsignaturas(prev => prev.filter(a => a.idAsignatura !== id));
      setLoading('success');
    } catch (err) {
      setError(err as ApiError);
      setLoading('error');
      throw err;
    }
  }, []);

  // Refetch helper
  const refetch = useCallback(() => fetchAsignaturas(docenteId), [fetchAsignaturas, docenteId]);

  // Auto-fetch en mount
  useEffect(() => {
    fetchAsignaturas(docenteId);
  }, [fetchAsignaturas, docenteId]);

  return {
    asignaturas,
    loading,
    error,
    fetchAsignaturas,
    createAsignatura,
    updateAsignatura,
    deleteAsignatura,
    refetch,
  };
};

/**
 * Hook para obtener una sola asignatura por ID
 */
export const useAsignatura = (id: number) => {
  const [asignatura, setAsignatura] = useState<Asignatura | null>(null);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchAsignatura = async () => {
      setLoading('loading');
      setError(null);

      try {
        const data = await asignaturaService.getById(id);
        setAsignatura(data);
        setLoading('success');
      } catch (err) {
        setError(err as ApiError);
        setLoading('error');
      }
    };

    if (id) {
      fetchAsignatura();
    }
  }, [id]);

  return { asignatura, loading, error };
};