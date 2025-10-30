// src/commons/nota/screens/NotaList.tsx

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
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { Add as AddIcon, TrendingUp, CheckCircle, Cancel, Assessment } from '@mui/icons-material';
import { useNotas } from '../hooks/useNotas';
import { NotaTable } from '../components/NotaTable';
import { NotaFormDialog } from '../components/NotaFormDialog';
import type { Nota, Inscripcion } from '../../../types';
import api from '../../../api/axios';
import { endpoints } from '../../../api/endpoints';

export const NotaList: FC = () => {
  const { notas, loading, error, estadisticas, createNota, updateNota, deleteNota } = useNotas();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedNota, setSelectedNota] = useState<Nota | null>(null);
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  });

  useEffect(() => {
    const fetchInscripciones = async () => {
      try {
        const { data } = await api.get<Inscripcion[]>(endpoints.inscripciones.list);
        setInscripciones(data);
      } catch (err) {
        console.error('Error cargando inscripciones:', err);
      }
    };
    fetchInscripciones();
  }, []);

  const handleOpenDialog = (nota?: Nota) => {
    setSelectedNota(nota || null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedNota(null);
  };

  const handleSubmit = async (data: Omit<Nota, 'idnotas'>) => {
    try {
      if (selectedNota) {
        await updateNota(selectedNota.idnotas, data);
        showSnackbar('Nota actualizada exitosamente', 'success');
      } else {
        await createNota(data);
        showSnackbar('Nota creada exitosamente', 'success');
      }
      handleCloseDialog();
    } catch (err) {
      showSnackbar('Error al guardar la nota', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar esta nota?')) {
      try {
        await deleteNota(id);
        showSnackbar('Nota eliminada exitosamente', 'success');
      } catch (err) {
        showSnackbar('Error al eliminar la nota', 'error');
      }
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading === 'loading' && notas.length === 0) {
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
              Gestión de Notas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total de calificaciones: {notas.length}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            size="large"
          >
            Nueva Nota
          </Button>
        </Box>
      </Paper>

      {/* Tarjetas de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <TrendingUp color="primary" fontSize="large" />
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Promedio General
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {estadisticas.promedio.toFixed(1)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <CheckCircle color="success" fontSize="large" />
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Aprobados
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {estadisticas.aprobados}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Cancel color="error" fontSize="large" />
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Reprobados
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="error.main">
                    {estadisticas.reprobados}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Assessment color="info" fontSize="large" />
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Total Evaluaciones
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="info.main">
                    {estadisticas.total}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
      )}

      <NotaTable notas={notas} onEdit={handleOpenDialog} onDelete={handleDelete} />

      <NotaFormDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        nota={selectedNota}
        inscripciones={inscripciones}
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