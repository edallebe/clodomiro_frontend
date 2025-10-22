// src/commons/curso/hooks/useCursos.ts

import { useState, useEffect, useCallback } from 'react';
import { cursoService } from '../services/cursoService';
import type { Curso, LoadingState } from '../../../types';
import type { ApiError } from '../../../api/axios';

interface UseCursosReturn {
  cursos: Curso[];
  loading: LoadingState;
  error: ApiError | null;
  fetchCursos: (asignaturaId?: number) => Promise<void>;
  createCurso: (data: Omit<Curso, 'idCurso'>) => Promise<void>;
  updateCurso: (id: number, data: Partial<Curso>) => Promise<void>;
  deleteCurso: (id: number) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useCursos = (asignaturaId?: number): UseCursosReturn => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<ApiError | null>(null);

  const fetchCursos = useCallback(async (filterAsignaturaId?: number) => {
    setLoading('loading');
    setError(null);

    try {
      const data = await cursoService.getAll(filterAsignaturaId);
      setCursos(data);
      setLoading('success');
    } catch (err) {
      setError(err as ApiError);
      setLoading('error');
    }
  }, []);

  const createCurso = useCallback(async (data: Omit<Curso, 'idCurso'>) => {
    setLoading('loading');
    setError(null);

    try {
      const newCurso = await cursoService.create(data);
      setCursos(prev => [...prev, newCurso]);
      setLoading('success');
    } catch (err) {
      setError(err as ApiError);
      setLoading('error');
      throw err;
    }
  }, []);

  const updateCurso = useCallback(async (id: number, data: Partial<Curso>) => {
    setLoading('loading');
    setError(null);

    try {
      const updated = await cursoService.update(id, data);
      setCursos(prev => prev.map(c => c.idCurso === id ? updated : c));
      setLoading('success');
    } catch (err) {
      setError(err as ApiError);
      setLoading('error');
      throw err;
    }
  }, []);

  const deleteCurso = useCallback(async (id: number) => {
    setLoading('loading');
    setError(null);

    try {
      await cursoService.delete(id);
      setCursos(prev => prev.filter(c => c.idCurso !== id));
      setLoading('success');
    } catch (err) {
      setError(err as ApiError);
      setLoading('error');
      throw err;
    }
  }, []);

  const refetch = useCallback(() => fetchCursos(asignaturaId), [fetchCursos, asignaturaId]);

  useEffect(() => {
    fetchCursos(asignaturaId);
  }, [fetchCursos, asignaturaId]);

  return {
    cursos,
    loading,
    error,
    fetchCursos,
    createCurso,
    updateCurso,
    deleteCurso,
    refetch,
  };
};

export const useCurso = (id: number) => {
  const [curso, setCurso] = useState<Curso | null>(null);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchCurso = async () => {
      setLoading('loading');
      setError(null);

      try {
        const data = await cursoService.getById(id);
        setCurso(data);
        setLoading('success');
      } catch (err) {
        setError(err as ApiError);
        setLoading('error');
      }
    };

    if (id) {
      fetchCurso();
    }
  }, [id]);

  return { curso, loading, error };
};