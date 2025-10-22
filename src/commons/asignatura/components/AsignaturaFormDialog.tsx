// src/commons/asignatura/components/AsignaturaFormDialog.tsx

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
import type { Asignatura, Usuario } from '../../../types';

/**
 * Controlled Form Dialog para Asignatura
 * Patrón: Controlled Components + Presentational
 * Maneja tanto creación como edición (modo determinado por prop)
 */

interface AsignaturaFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Asignatura, 'idAsignatura'>) => Promise<void>;
  asignatura?: Asignatura | null; // Si existe, modo edición
  docentes: Usuario[]; // Lista de usuarios con rol Docente
}

export const AsignaturaFormDialog: FC<AsignaturaFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  asignatura,
  docentes,
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    docente: 0,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = Boolean(asignatura);

  // Populate form en modo edición
  useEffect(() => {
    if (asignatura) {
      setFormData({
        nombre: asignatura.nombre,
        docente: asignatura.docente,
      });
    } else {
      setFormData({ nombre: '', docente: 0 });
    }
    setErrors({});
  }, [asignatura, open]);

  // Validación básica
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (formData.docente === 0) {
      newErrors.docente = 'Debe seleccionar un docente';
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
      setFormData({ nombre: '', docente: 0 });
    } catch (error) {
      console.error('Error al guardar asignatura:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'docente' ? Number(e.target.value) : e.target.value,
    }));
    // Limpiar error del campo al escribir
    if (errors[field]) {
      setErrors(prev => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditMode ? 'Editar Asignatura' : 'Nueva Asignatura'}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Nombre de la Asignatura"
              value={formData.nombre}
              onChange={handleChange('nombre')}
              error={Boolean(errors.nombre)}
              helperText={errors.nombre}
              required
              autoFocus
            />

            <TextField
              fullWidth
              select
              label="Docente"
              value={formData.docente}
              onChange={handleChange('docente')}
              error={Boolean(errors.docente)}
              helperText={errors.docente || 'Seleccione el docente responsable'}
              required
            >
              <MenuItem value={0} disabled>
                Seleccionar docente
              </MenuItem>
              {docentes.map((docente) => (
                <MenuItem key={docente.idUsuario} value={docente.idUsuario}>
                  {docente.nombre} {docente.apellido} - {docente.correo}
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