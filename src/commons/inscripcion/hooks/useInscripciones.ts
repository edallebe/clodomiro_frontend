// src/commons/inscripcion/hooks/useInscripciones.ts

import { useState, useEffect, useCallback } from 'react';
import { inscripcionService } from '../services/inscripcionService';
import type { Inscripcion, LoadingState } from '../../../types';
import type { ApiError } from '../../../api/axios';

interface UseInscripcionesReturn {
  inscripciones: Inscripcion[];
  loading: LoadingState;
  error: ApiError | null;
  fetchInscripciones: (filters?: { estudiante?: number; curso?: number }) => Promise<void>;
  createInscripcion: (data: Omit<Inscripcion, 'idInscripcion'>) => Promise<void>;
  updateInscripcion: (id: number, data: Partial<Inscripcion>) => Promise<void>;
  deleteInscripcion: (id: number) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useInscripciones = (filters?: { estudiante?: number; curso?: number }): UseInscripcionesReturn => {
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<ApiError | null>(null);

  const fetchInscripciones = useCallback(async (filterParams?: { estudiante?: number; curso?: number }) => {
    setLoading('loading');
    setError(null);

    try {
      const data = await inscripcionService.getAll(filterParams);
      setInscripciones(data);
      setLoading('success');
    } catch (err) {
      setError(err as ApiError);
      setLoading('error');
    }
  }, []);

  const createInscripcion = useCallback(async (data: Omit<Inscripcion, 'idInscripcion'>) => {
    setLoading('loading');
    setError(null);

    try {
      // Verificar duplicados
      const isDuplicate = await inscripcionService.checkDuplicate(data.estudiante, data.curso);
      if (isDuplicate) {
        throw new Error('El estudiante ya está inscrito en este curso');
      }

      const newInscripcion = await inscripcionService.create(data);
      setInscripciones(prev => [...prev, newInscripcion]);
      setLoading('success');
    } catch (err) {
      setError(err as ApiError);
      setLoading('error');
      throw err;
    }
  }, []);

  const updateInscripcion = useCallback(async (id: number, data: Partial<Inscripcion>) => {
    setLoading('loading');
    setError(null);

    try {
      const updated = await inscripcionService.update(id, data);
      setInscripciones(prev => prev.map(i => i.idInscripcion === id ? updated : i));
      setLoading('success');
    } catch (err) {
      setError(err as ApiError);
      setLoading('error');
      throw err;
    }
  }, []);

  const deleteInscripcion = useCallback(async (id: number) => {
    setLoading('loading');
    setError(null);

    try {
      await inscripcionService.delete(id);
      setInscripciones(prev => prev.filter(i => i.idInscripcion !== id));
      setLoading('success');
    } catch (err) {
      setError(err as ApiError);
      setLoading('error');
      throw err;
    }
  }, []);

  const refetch = useCallback(() => fetchInscripciones(filters), [fetchInscripciones, filters]);

  useEffect(() => {
    fetchInscripciones(filters);
  }, [fetchInscripciones, filters]);

  return {
    inscripciones,
    loading,
    error,
    fetchInscripciones,
    createInscripcion,
    updateInscripcion,
    deleteInscripcion,
    refetch,
  };
};