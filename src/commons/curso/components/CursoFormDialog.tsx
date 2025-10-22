// src/commons/curso/components/CursoFormDialog.tsx

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  CircularProgress,
} from '@mui/material';
import type { Curso, Asignatura } from '../../../types';

interface CursoFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Curso, 'idCurso'>) => Promise<void>;
  curso?: Curso | null;
  asignaturas: Asignatura[];
}

export const CursoFormDialog: FC<CursoFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  curso,
  asignaturas,
}) => {
  const [formData, setFormData] = useState({
    nombre_curso: '',
    asignatura: 0,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = Boolean(curso);

  useEffect(() => {
    if (curso) {
      setFormData({
        nombre_curso: curso.nombre_curso,
        asignatura: curso.asignatura,
      });
    } else {
      setFormData({ nombre_curso: '', asignatura: 0 });
    }
    setErrors({});
  }, [curso, open]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre_curso.trim()) {
      newErrors.nombre_curso = 'El nombre del curso es requerido';
    }

    if (formData.asignatura === 0) {
      newErrors.asignatura = 'Debe seleccionar una asignatura';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
      setFormData({ nombre_curso: '', asignatura: 0 });
    } catch (error) {
      console.error('Error al guardar curso:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'asignatura' ? Number(e.target.value) : e.target.value,
    }));
    if (errors[field]) {
      setErrors(prev => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditMode ? 'Editar Curso' : 'Nuevo Curso'}</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Nombre del Curso"
              value={formData.nombre_curso}
              onChange={handleChange('nombre_curso')}
              error={Boolean(errors.nombre_curso)}
              helperText={errors.nombre_curso}
              required
              autoFocus
            />

            <TextField
              fullWidth
              select
              label="Asignatura"
              value={formData.asignatura}
              onChange={handleChange('asignatura')}
              error={Boolean(errors.asignatura)}
              helperText={errors.asignatura || 'Seleccione la asignatura asociada'}
              required
            >
              <MenuItem value={0} disabled>
                Seleccionar asignatura
              </MenuItem>
              {asignaturas.map((asignatura) => (
                <MenuItem key={asignatura.idAsignatura} value={asignatura.idAsignatura}>
                  {asignatura.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};