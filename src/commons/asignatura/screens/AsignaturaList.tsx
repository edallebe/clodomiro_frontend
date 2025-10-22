// src/commons/asignatura/screens/AsignaturaList.tsx

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
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAsignaturas } from '../hooks/useAsignaturas';
import { AsignaturaTable } from '../components/AsignaturaTable';
import { AsignaturaFormDialog } from '../components/AsignaturaFormDialog';
import type { Asignatura, Usuario } from '../../../types';
import api from '../../../api/axios';
import { endpoints } from '../../../api/endpoints';

/**
 * Screen Container - Asignatura List
 * Patrón: Container Component (Smart Component)
 * Orquesta lógica de negocio y comunica componentes presentacionales
 */

export const AsignaturaList: FC = () => {
  const {
    asignaturas,
    loading,
    error,
    createAsignatura,
    updateAsignatura,
    deleteAsignatura,
  } = useAsignaturas();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAsignatura, setSelectedAsignatura] = useState<Asignatura | null>(null);
  const [docentes, setDocentes] = useState<Usuario[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Fetch docentes para el select del formulario
  useEffect(() => {
    const fetchDocentes = async () => {
      try {
        // Asumiendo que rol 2 = Docente (ajustar según tu DB)
        const { data } = await api.get<Usuario[]>(endpoints.usuarios.byRole(2));
        setDocentes(data);
      } catch (err) {
        console.error('Error cargando docentes:', err);
      }
    };
    fetchDocentes();
  }, []);

  // Handlers
  const handleOpenDialog = (asignatura?: Asignatura) => {
    setSelectedAsignatura(asignatura || null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedAsignatura(null);
  };

  const handleSubmit = async (data: Omit<Asignatura, 'idAsignatura'>) => {
    try {
      if (selectedAsignatura) {
        await updateAsignatura(selectedAsignatura.idAsignatura, data);
        showSnackbar('Asignatura actualizada exitosamente', 'success');
      } else {
        await createAsignatura(data);
        showSnackbar('Asignatura creada exitosamente', 'success');
      }
      handleCloseDialog();
    } catch (err) {
      showSnackbar('Error al guardar la asignatura', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar esta asignatura?')) {
      try {
        await deleteAsignatura(id);
        showSnackbar('Asignatura eliminada exitosamente', 'success');
      } catch (err) {
        showSnackbar('Error al eliminar la asignatura', 'error');
      }
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Renderizado condicional según estado de carga
  if (loading === 'loading' && asignaturas.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'background.default' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Gestión de Asignaturas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total de asignaturas: {asignaturas.length}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            size="large"
          >
            Nueva Asignatura
          </Button>
        </Box>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => {}}>
          {error.message}
        </Alert>
      )}

      {/* Tabla */}
      <AsignaturaTable
        asignaturas={asignaturas}
        onEdit={handleOpenDialog}
        onDelete={handleDelete}
      />

      {/* Dialog Form */}
      <AsignaturaFormDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        asignatura={selectedAsignatura}
        docentes={docentes}
      />

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};