// src/commons/usuario/screens/UsuarioList.tsx

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useUsuarios } from '../hooks/useUsuarios';
import { UsuarioTable } from '../components/UsuarioTable';
import { UsuarioFormDialog } from '../components/UsuarioFormDialog';
import type { Usuario, Rol } from '../../../types';
import api from '../../../api/axios';
import { endpoints } from '../../../api/endpoints';

export const UsuarioList: FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const { usuarios, loading, error, createUsuario, updateUsuario, deleteUsuario, fetchUsuarios } = useUsuarios();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const { data } = await api.get<Rol[]>(endpoints.roles.list);
        setRoles(data);
      } catch (err) {
        console.error('Error cargando roles:', err);
      }
    };
    fetchRoles();
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Filtrar por rol: 0=Todos, 1=Admin, 2=Docente, 3=Estudiante
    if (newValue === 0) {
      fetchUsuarios();
    } else {
      fetchUsuarios(newValue);
    }
  };

  const handleOpenDialog = (usuario?: Usuario) => {
    setSelectedUsuario(usuario || null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUsuario(null);
  };

  const handleSubmit = async (data: Omit<Usuario, 'idUsuario' | 'rol_detail'>) => {
    try {
      if (selectedUsuario) {
        await updateUsuario(selectedUsuario.idUsuario, data);
        showSnackbar('Usuario actualizado exitosamente', 'success');
      } else {
        await createUsuario(data);
        showSnackbar('Usuario creado exitosamente', 'success');
      }
      handleCloseDialog();
    } catch (err) {
      showSnackbar('Error al guardar el usuario', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      try {
        await deleteUsuario(id);
        showSnackbar('Usuario eliminado exitosamente', 'success');
      } catch (err) {
        showSnackbar('Error al eliminar el usuario', 'error');
      }
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading === 'loading' && usuarios.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'background.default' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Gestión de Usuarios
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total de usuarios: {usuarios.length}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            size="large"
          >
            Nuevo Usuario
          </Button>
        </Box>
      </Paper>

      {/* Tabs para filtrar por rol */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Todos" />
          <Tab label="Administradores" />
          <Tab label="Docentes" />
          <Tab label="Estudiantes" />
        </Tabs>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
      )}

      <UsuarioTable usuarios={usuarios} onEdit={handleOpenDialog} onDelete={handleDelete} />

      <UsuarioFormDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        usuario={selectedUsuario}
        roles={roles}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};