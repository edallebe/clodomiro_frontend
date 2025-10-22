// src/commons/usuario/components/UsuarioFormDialog.tsx

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
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import type { Usuario, Rol } from '../../../types';

interface UsuarioFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Usuario, 'idUsuario' | 'rol_detail'>) => Promise<void>;
  usuario?: Usuario | null;
  roles: Rol[];
}

export const UsuarioFormDialog: FC<UsuarioFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  usuario,
  roles,
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    rol: 0,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = Boolean(usuario);

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        password: '', // No mostramos password en edición
        rol: usuario.rol,
      });
    } else {
      setFormData({ nombre: '', apellido: '', correo: '', password: '', rol: 0 });
    }
    setErrors({});
  }, [usuario, open]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es requerido';
    } else if (!emailRegex.test(formData.correo)) {
      newErrors.correo = 'Formato de correo inválido';
    }

    // Password requerido solo en creación
    if (!isEditMode && !formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.rol === 0) {
      newErrors.rol = 'Debe seleccionar un rol';
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
      setFormData({ nombre: '', apellido: '', correo: '', password: '', rol: 0 });
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'rol' ? Number(e.target.value) : e.target.value,
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
      <DialogTitle>{isEditMode ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Nombre"
              value={formData.nombre}
              onChange={handleChange('nombre')}
              error={Boolean(errors.nombre)}
              helperText={errors.nombre}
              required
              autoFocus
            />

            <TextField
              fullWidth
              label="Apellido"
              value={formData.apellido}
              onChange={handleChange('apellido')}
              error={Boolean(errors.apellido)}
              helperText={errors.apellido}
              required
            />

            <TextField
              fullWidth
              label="Correo Electrónico"
              type="email"
              value={formData.correo}
              onChange={handleChange('correo')}
              error={Boolean(errors.correo)}
              helperText={errors.correo}
              required
            />

            <TextField
              fullWidth
              label={isEditMode ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange('password')}
              error={Boolean(errors.password)}
              helperText={errors.password || (isEditMode ? 'Dejar vacío para mantener la actual' : '')}
              required={!isEditMode}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              select
              label="Rol"
              value={formData.rol}
              onChange={handleChange('rol')}
              error={Boolean(errors.rol)}
              helperText={errors.rol || 'Seleccione el rol del usuario'}
              required
            >
              <MenuItem value={0} disabled>
                Seleccionar rol
              </MenuItem>
              {roles.map((rol) => (
                <MenuItem key={rol.idRol} value={rol.idRol}>
                  {rol.nombre_rol}
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