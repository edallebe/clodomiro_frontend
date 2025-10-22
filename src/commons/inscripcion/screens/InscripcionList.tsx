// src/commons/inscripcion/screens/InscripcionList.tsx

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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useInscripciones } from '../hooks/useInscripciones';
import { InscripcionTable } from '../components/InscripcionTable';
import { InscripcionFormDialog } from '../components/InscripcionFormDialog';
import type { Inscripcion, Usuario, Curso, Asignatura } from '../../../types';
import api from '../../../api/axios';
import { endpoints } from '../../../api/endpoints';

export const InscripcionList: FC = () => {
  const { inscripciones, loading, error, createInscripcion, deleteInscripcion } = useInscripciones();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedInscripcion, setSelectedInscripcion] = useState<Inscripcion | null>(null);
  const [estudiantes, setEstudiantes] = useState<Usuario[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch estudiantes (rol 3)
        const { data: estudiantesData } = await api.get<Usuario[]>(endpoints.usuarios.byRole(3));
        setEstudiantes(estudiantesData);

        // Fetch cursos
        const { data: cursosData } = await api.get<Curso[]>(endpoints.cursos.list);
        setCursos(cursosData);

        // Fetch asignaturas
        const { data: asignaturasData } = await api.get<Asignatura[]>(endpoints.asignaturas.list);
        setAsignaturas(asignaturasData);
      } catch (err) {
        console.error('Error cargando datos:', err);
      }
    };
    fetchData();
  }, []);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleView = (inscripcion: Inscripcion) => {
    setSelectedInscripcion(inscripcion);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedInscripcion(null);
  };

  const handleSubmit = async (data: Omit<Inscripcion, 'idInscripcion'>) => {
    try {
      await createInscripcion(data);
      showSnackbar('Inscripción creada exitosamente', 'success');
      handleCloseDialog();
    } catch (err: any) {
      showSnackbar(err.message || 'Error al crear la inscripción', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar esta inscripción?')) {
      try {
        await deleteInscripcion(id);
        showSnackbar('Inscripción eliminada exitosamente', 'success');
      } catch (err) {
        showSnackbar('Error al eliminar la inscripción', 'error');
      }
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading === 'loading' && inscripciones.length === 0) {
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
              Gestión de Inscripciones
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total de inscripciones: {inscripciones.length}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            size="large"
          >
            Nueva Inscripción
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
      )}

      <InscripcionTable 
        inscripciones={inscripciones} 
        onView={handleView} 
        onDelete={handleDelete} 
      />

      <InscripcionFormDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        estudiantes={estudiantes}
        cursos={cursos}
        asignaturas={asignaturas}
      />

      {/* Dialog de detalles */}
      <Dialog open={viewDialogOpen} onClose={handleCloseViewDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Detalles de Inscripción</DialogTitle>
        <DialogContent>
          {selectedInscripcion && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="body1" gutterBottom>
                <strong>ID:</strong> {selectedInscripcion.idInscripcion}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Estudiante:</strong> {
                  selectedInscripcion.estudiante_detail
                    ? `${selectedInscripcion.estudiante_detail.nombre} ${selectedInscripcion.estudiante_detail.apellido}`
                    : `ID: ${selectedInscripcion.estudiante}`
                }
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Curso:</strong> {
                  selectedInscripcion.curso_detail?.nombre_curso || `ID: ${selectedInscripcion.curso}`
                }
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Asignatura:</strong> {
                  selectedInscripcion.asignatura_detail?.nombre || `ID: ${selectedInscripcion.asignatura}`
                }
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>

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