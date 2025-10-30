// src/commons/nota/components/NotaFormDialog.tsx

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
  Slider,
  Typography,
} from '@mui/material';
import type { Nota, Inscripcion } from '../../../types';

interface NotaFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Nota, 'idnotas'>) => Promise<void>;
  nota?: Nota | null;
  inscripciones: Inscripcion[];
}

export const NotaFormDialog: FC<NotaFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  nota,
  inscripciones,
}) => {
  const [formData, setFormData] = useState({
    calificacion: 0,
    inscripcion: 0,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = Boolean(nota);

  useEffect(() => {
    if (nota) {
      setFormData({
        calificacion: nota.calificacion,
        inscripcion: nota.inscripcion,
      });
    } else {
      setFormData({ calificacion: 0, inscripcion: 0 });
    }
    setErrors({});
  }, [nota, open]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.calificacion < 0 || formData.calificacion > 100) {
      newErrors.calificacion = 'La calificación debe estar entre 0 y 100';
    }

    if (formData.inscripcion === 0) {
      newErrors.inscripcion = 'Debe seleccionar una inscripción';
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
      setFormData({ calificacion: 0, inscripcion: 0 });
    } catch (error) {
      console.error('Error al guardar nota:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCalificacionChange = (_: Event, value: number | number[]) => {
    setFormData(prev => ({
      ...prev,
      calificacion: value as number,
    }));
    if (errors.calificacion) {
      setErrors(prev => {
        const { calificacion: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleInscripcionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      inscripcion: Number(e.target.value),
    }));
    if (errors.inscripcion) {
      setErrors(prev => {
        const { inscripcion: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const getCalificacionColor = (value: number): string => {
    if (value < 60) return '#d32f2f';
    if (value < 75) return '#ed6c02';
    if (value < 90) return '#0288d1';
    return '#2e7d32';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditMode ? 'Editar Nota' : 'Nueva Nota'}</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              select
              label="Inscripción"
              value={formData.inscripcion}
              onChange={handleInscripcionChange}
              error={Boolean(errors.inscripcion)}
              helperText={errors.inscripcion || 'Seleccione la inscripción del estudiante'}
              required
              disabled={isEditMode}
            >
              <MenuItem value={0} disabled>
                Seleccionar inscripción
              </MenuItem>
              {inscripciones.map((inscripcion) => (
                <MenuItem key={inscripcion.idInscripcion} value={inscripcion.idInscripcion}>
                  {inscripcion.estudiante_detail
                    ? `${inscripcion.estudiante_detail.nombre} ${inscripcion.estudiante_detail.apellido}`
                    : `ID: ${inscripcion.estudiante}`}
                  {' - '}
                  {inscripcion.curso_detail?.nombre_curso || `Curso ID: ${inscripcion.curso}`}
                </MenuItem>
              ))}
            </TextField>

            <Box>
              <Typography gutterBottom>
                Calificación: 
                <Typography 
                  component="span" 
                  sx={{ 
                    ml: 2, 
                    fontWeight: 'bold', 
                    fontSize: '1.5rem',
                    color: getCalificacionColor(formData.calificacion)
                  }}
                >
                  {formData.calificacion}
                </Typography>
              </Typography>
              
              <Slider
                value={formData.calificacion}
                onChange={handleCalificacionChange}
                min={0}
                max={100}
                step={1}
                marks={[
                  { value: 0, label: '0' },
                  { value: 60, label: '60' },
                  { value: 75, label: '75' },
                  { value: 90, label: '90' },
                  { value: 100, label: '100' },
                ]}
                sx={{
                  color: getCalificacionColor(formData.calificacion),
                  '& .MuiSlider-markLabel': {
                    fontSize: '0.75rem',
                  },
                }}
              />
              
              {errors.calificacion && (
                <Typography color="error" variant="caption">
                  {errors.calificacion}
                </Typography>
              )}

              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  <strong>Escala de calificación:</strong><br />
                  0-59: Reprobado<br />
                  60-74: Aprobado básico<br />
                  75-89: Aprobado satisfactorio<br />
                  90-100: Excelente
                </Typography>
              </Box>
            </Box>
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