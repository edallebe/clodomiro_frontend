// src/commons/inscripcion/components/InscripcionFormDialog.tsx

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
  Alert,
} from '@mui/material';
import type { Inscripcion, Usuario, Curso, Asignatura } from '../../../types';

interface InscripcionFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Inscripcion, 'idInscripcion'>) => Promise<void>;
  estudiantes: Usuario[];
  cursos: Curso[];
  asignaturas: Asignatura[];
}

export const InscripcionFormDialog: FC<InscripcionFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  estudiantes,
  cursos,
  asignaturas,
}) => {
  const [formData, setFormData] = useState({
    estudiante: 0,
    curso: 0,
    asignatura: 0,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [filteredCursos, setFilteredCursos] = useState<Curso[]>([]);

  useEffect(() => {
    setFormData({ estudiante: 0, curso: 0, asignatura: 0 });
    setErrors({});
    setFilteredCursos([]);
  }, [open]);

  // Filtrar cursos cuando se selecciona asignatura
  useEffect(() => {
    if (formData.asignatura) {
      const filtered = cursos.filter(c => c.asignatura === formData.asignatura);
      setFilteredCursos(filtered);
      
      // Reset curso si no pertenece a la asignatura seleccionada
      if (formData.curso) {
        const cursoValido = filtered.some(c => c.idCurso === formData.curso);
        if (!cursoValido) {
          setFormData(prev => ({ ...prev, curso: 0 }));
        }
      }
    } else {
      setFilteredCursos([]);
    }
  }, [formData.asignatura, cursos, formData.curso]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.estudiante === 0) {
      newErrors.estudiante = 'Debe seleccionar un estudiante';
    }

    if (formData.asignatura === 0) {
      newErrors.asignatura = 'Debe seleccionar una asignatura';
    }

    if (formData.curso === 0) {
      newErrors.curso = 'Debe seleccionar un curso';
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
      setFormData({ estudiante: 0, curso: 0, asignatura: 0 });
    } catch (error: any) {
      // Mostrar error de duplicado
      if (error.message?.includes('inscrito')) {
        setErrors({ general: error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: Number(e.target.value),
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
      <DialogTitle>Nueva Inscripción</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {errors.general && (
              <Alert severity="error">{errors.general}</Alert>
            )}

            <TextField
              fullWidth
              select
              label="Estudiante"
              value={formData.estudiante}
              onChange={handleChange('estudiante')}
              error={Boolean(errors.estudiante)}
              helperText={errors.estudiante}
              required
              autoFocus
            >
              <MenuItem value={0} disabled>
                Seleccionar estudiante
              </MenuItem>
              {estudiantes.map((estudiante) => (
                <MenuItem key={estudiante.idUsuario} value={estudiante.idUsuario}>
                  {estudiante.nombre} {estudiante.apellido} - {estudiante.correo}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              select
              label="Asignatura"
              value={formData.asignatura}
              onChange={handleChange('asignatura')}
              error={Boolean(errors.asignatura)}
              helperText={errors.asignatura || 'Primero seleccione la asignatura'}
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

            <TextField
              fullWidth
              select
              label="Curso"
              value={formData.curso}
              onChange={handleChange('curso')}
              error={Boolean(errors.curso)}
              helperText={errors.curso || 'Los cursos se filtran por asignatura'}
              required
              disabled={!formData.asignatura}
            >
              <MenuItem value={0} disabled>
                Seleccionar curso
              </MenuItem>
              {filteredCursos.length === 0 && formData.asignatura ? (
                <MenuItem disabled>No hay cursos para esta asignatura</MenuItem>
              ) : (
                filteredCursos.map((curso) => (
                  <MenuItem key={curso.idCurso} value={curso.idCurso}>
                    {curso.nombre_curso}
                  </MenuItem>
                ))
              )}
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
            {loading ? 'Inscribiendo...' : 'Inscribir'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};