// src/commons/nota/hooks/useNotas.ts

import { useState, useEffect, useCallback } from 'react';
import { notaService } from '../services/notaService';
import type { Nota, LoadingState } from '../../../types';
import type { ApiError } from '../../../api/axios';

interface UseNotasReturn {
  notas: Nota[];
  loading: LoadingState;
  error: ApiError | null;
  estadisticas: {
    promedio: number;
    aprobados: number;
    reprobados: number;
    total: number;
  };
  fetchNotas: (inscripcionId?: number) => Promise<void>;
  createNota: (data: Omit<Nota, 'idnotas'>) => Promise<void>;
  updateNota: (id: number, data: Partial<Nota>) => Promise<void>;
  deleteNota: (id: number) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useNotas = (inscripcionId?: number): UseNotasReturn => {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<ApiError | null>(null);
  const [estadisticas, setEstadisticas] = useState({
    promedio: 0,
    aprobados: 0,
    reprobados: 0,
    total: 0,
  });

  const fetchNotas = useCallback(async (filterInscripcionId?: number) => {
    setLoading('loading');
    setError(null);

    try {
      const data = await notaService.getAll(filterInscripcionId);
      setNotas(data);
      
      // Calcular estadísticas
      const stats = await notaService.getEstadisticas(filterInscripcionId);
      setEstadisticas(stats);
      
      setLoading('success');
    } catch (err) {
      setError(err as ApiError);
      setLoading('error');
    }
  }, []);

  const createNota = useCallback(async (data: Omit<Nota, 'idnotas'>) => {
    setLoading('loading');
    setError(null);

    try {
      const newNota = await notaService.create(data);
      setNotas(prev => [...prev, newNota]);
      
      // Recalcular estadísticas
      const stats = await notaService.getEstadisticas(inscripcionId);
      setEstadisticas(stats);
      
      setLoading('success');
    } catch (err) {
      setError(err as ApiError);
      setLoading('error');
      throw err;
    }
  }, [inscripcionId]);

  const updateNota = useCallback(async (id: number, data: Partial<Nota>) => {
    setLoading('loading');
    setError(null);

    try {
      const updated = await notaService.update(id, data);
      setNotas(prev => prev.map(n => n.idnotas === id ? updated : n));
      
      // Recalcular estadísticas
      const stats = await notaService.getEstadisticas(inscripcionId);
      setEstadisticas(stats);
      
      setLoading('success');
    } catch (err) {
      setError(err as ApiError);
      setLoading('error');
      throw err;
    }
  }, [inscripcionId]);

  const deleteNota = useCallback(async (id: number) => {
    setLoading('loading');
    setError(null);

    try {
      await notaService.delete(id);
      setNotas(prev => prev.filter(n => n.idnotas !== id));
      
      // Recalcular estadísticas
      const stats = await notaService.getEstadisticas(inscripcionId);
      setEstadisticas(stats);
      
      setLoading('success');
    } catch (err) {
      setError(err as ApiError);
      setLoading('error');
      throw err;
    }
  }, [inscripcionId]);

  const refetch = useCallback(() => fetchNotas(inscripcionId), [fetchNotas, inscripcionId]);

  useEffect(() => {
    fetchNotas(inscripcionId);
  }, [fetchNotas, inscripcionId]);

  return {
    notas,
    loading,
    error,
    estadisticas,
    fetchNotas,
    createNota,
    updateNota,
    deleteNota,
    refetch,
  };
};