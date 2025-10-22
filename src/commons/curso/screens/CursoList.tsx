// src/commons/curso/screens/CursoList.tsx

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
import { useCursos } from '../hooks/useCursos';
import { CursoTable } from '../components/CursoTable';
import { CursoFormDialog } from '../components/CursoFormDialog';
import type { Curso, Asignatura } from '../../../types';
import api from '../../../api/axios';
import { endpoints } from '../../../api/endpoints';

export const CursoList: FC = () => {
  const { cursos, loading, error, createCurso, updateCurso, deleteCurso } = useCursos();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  });

  useEffect(() => {
    const fetchAsignaturas = async () => {
      try {
        const { data } = await api.get<Asignatura[]>(endpoints.asignaturas.list);
        setAsignaturas(data);
      } catch (err) {
        console.error('Error cargando asignaturas:', err);
      }
    };
    fetchAsignaturas();
  }, []);

  const handleOpenDialog = (curso?: Curso) => {
    setSelectedCurso(curso || null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedCurso(null);
  };

  const handleSubmit = async (data: Omit<Curso, 'idCurso'>) => {
    try {
      if (selectedCurso) {
        await updateCurso(selectedCurso.idCurso, data);
        showSnackbar('Curso actualizado exitosamente', 'success');
      } else {
        await createCurso(data);
        showSnackbar('Curso creado exitosamente', 'success');
      }
      handleCloseDialog();
    } catch (err) {
      showSnackbar('Error al guardar el curso', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este curso?')) {
      try {
        await deleteCurso(id);
        showSnackbar('Curso eliminado exitosamente', 'success');
      } catch (err) {
        showSnackbar('Error al eliminar el curso', 'error');
      }
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading === 'loading' && cursos.length === 0) {
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
              Gestión de Cursos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total de cursos: {cursos.length}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            size="large"
          >
            Nuevo Curso
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
      )}

      <CursoTable cursos={cursos} onEdit={handleOpenDialog} onDelete={handleDelete} />

      <CursoFormDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        curso={selectedCurso}
        asignaturas={asignaturas}
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