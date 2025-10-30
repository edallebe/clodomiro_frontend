// src/commons/rol/components/RolFormDialog.tsx

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import type { Rol } from '../../../types';

interface RolFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Rol, 'idRol'>) => Promise<void>;
  rol?: Rol | null;
}

const rolesPreestablecidos = [
  { valor: 'Administrador', icono: '👑', descripcion: 'Control total del sistema' },
  { valor: 'Docente', icono: '👨‍🏫', descripcion: 'Gestión de cursos y calificaciones' },
  { valor: 'Estudiante', icono: '🎓', descripcion: 'Acceso a cursos inscritos' },
  { valor: 'Coordinador', icono: '📋', descripcion: 'Supervisión de programas' },
  { valor: 'Secretario', icono: '📝', descripcion: 'Gestión administrativa' },
];

export const RolFormDialog: FC<RolFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  rol,
}) => {
  const [formData, setFormData] = useState({
    nombre_rol: '',
  });
  const [usarPreestablecido, setUsarPreestablecido] = useState(true);
  const [rolSeleccionado, setRolSeleccionado] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = Boolean(rol);

  useEffect(() => {
    if (rol) {
      setFormData({
        nombre_rol: rol.nombre_rol,
      });
      setUsarPreestablecido(false);
      setRolSeleccionado('');
    } else {
      setFormData({ nombre_rol: '' });
      setUsarPreestablecido(true);
      setRolSeleccionado('');
    }
    setErrors({});
  }, [rol, open]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const nombreFinal = usarPreestablecido ? rolSeleccionado : formData.nombre_rol;

    if (!nombreFinal.trim()) {
      newErrors.nombre_rol = 'El nombre del rol es requerido';
    } else if (nombreFinal.length < 3) {
      newErrors.nombre_rol = 'El nombre debe tener al menos 3 caracteres';
    } else if (nombreFinal.length > 45) {
      newErrors.nombre_rol = 'El nombre no puede exceder 45 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const nombreFinal = usarPreestablecido ? rolSeleccionado : formData.nombre_rol;
      await onSubmit({ nombre_rol: nombreFinal });
      onClose();
      setFormData({ nombre_rol: '' });
      setRolSeleccionado('');
    } catch (error) {
      console.error('Error al guardar rol:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      nombre_rol: e.target.value,
    });
    if (errors.nombre_rol) {
      setErrors({});
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditMode ? 'Editar Rol' : 'Nuevo Rol'}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {isEditMode && (
              <Alert severity="info">
                Estás editando un rol existente. Ten cuidado al cambiar roles que ya tienen usuarios asignados.
              </Alert>
            )}

            {!isEditMode && (
              <Box>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Tipo de rol</FormLabel>
                  <RadioGroup
                    value={usarPreestablecido ? 'preestablecido' : 'personalizado'}
                    onChange={(e) => setUsarPreestablecido(e.target.value === 'preestablecido')}
                  >
                    <FormControlLabel
                      value="preestablecido"
                      control={<Radio />}
                      label="Usar rol preestablecido"
                    />
                    <FormControlLabel
                      value="personalizado"
                      control={<Radio />}
                      label="Crear rol personalizado"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            )}

            {!isEditMode && usarPreestablecido ? (
              <FormControl fullWidth>
                <FormLabel>Seleccionar rol</FormLabel>
                <RadioGroup
                  value={rolSeleccionado}
                  onChange={(e) => {
                    setRolSeleccionado(e.target.value);
                    if (errors.nombre_rol) setErrors({});
                  }}
                >
                  {rolesPreestablecidos.map((rol) => (
                    <FormControlLabel
                      key={rol.valor}
                      value={rol.valor}
                      control={<Radio />}
                      label={
                        <Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <span style={{ fontSize: '1.5rem' }}>{rol.icono}</span>
                            <strong>{rol.valor}</strong>
                          </Box>
                          <Box sx={{ ml: 4, fontSize: '0.875rem', color: 'text.secondary' }}>
                            {rol.descripcion}
                          </Box>
                        </Box>
                      }
                      sx={{ py: 1 }}
                    />
                  ))}
                </RadioGroup>
                {errors.nombre_rol && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {errors.nombre_rol}
                  </Alert>
                )}
              </FormControl>
            ) : (
              <TextField
                fullWidth
                label="Nombre del Rol"
                value={formData.nombre_rol}
                onChange={handleChange}
                error={Boolean(errors.nombre_rol)}
                helperText={errors.nombre_rol || 'Ej: Monitor, Auxiliar, Tutor, etc.'}
                required
                autoFocus={isEditMode || !usarPreestablecido}
                inputProps={{ maxLength: 45 }}
              />
            )}

            {!isEditMode && (
              <Alert severity="warning">
                <strong>Nota:</strong> Los roles Admin (1), Docente (2) y Estudiante (3) son roles del sistema y no deberían duplicarse.
              </Alert>
            )}
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