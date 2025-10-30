import type { FC } from 'react';
import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Paper,
  Card,
  CardContent,
  Grid, // ✅ Grid moderno de MUI 7
} from '@mui/material';
import {
  Add as AddIcon,
  Security as SecurityIcon,
  People as PeopleIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useRoles } from '../hooks/useRol';
import { RolTable } from '../components/RolTable';
import { RolFormDialog } from '../components/RolFormDialog';
import type { Rol } from '../../../types';

export const RolList: FC = () => {
  // ===== HOOKS =====
  const {
    roles,
    loading,
    error,
    estadisticas,
    createRol,
    updateRol,
    deleteRol,
  } = useRoles();

  // ===== STATE LOCAL =====
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning',
  });

  // ===== COMPUTED VALUES =====
  const totalUsuarios = Object.values(estadisticas).reduce(
    (sum, stat) => sum + stat.cantidad,
    0
  );
  const rolesEnUso = Object.values(estadisticas).filter(
    (stat) => stat.cantidad > 0
  ).length;
  const rolesSinUsar = roles.length - rolesEnUso;

  // ===== EVENT HANDLERS =====
  const handleOpenDialog = (rol?: Rol) => {
    setSelectedRol(rol || null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRol(null);
  };

  const handleSubmit = async (data: Omit<Rol, 'idRol'>) => {
    try {
      if (selectedRol) {
        await updateRol(selectedRol.idRol, data);
        showSnackbar('Rol actualizado exitosamente', 'success');
      } else {
        await createRol(data);
        showSnackbar('Rol creado exitosamente', 'success');
      }
      handleCloseDialog();
    } catch (err: any) {
      showSnackbar(err.message || 'Error al guardar el rol', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (id <= 3) {
      showSnackbar('No se puede eliminar un rol del sistema', 'warning');
      return;
    }

    const cantidadUsuarios = estadisticas[id]?.cantidad || 0;
    if (cantidadUsuarios > 0) {
      showSnackbar(
        `No se puede eliminar un rol con ${cantidadUsuarios} usuarios asignados`,
        'warning'
      );
      return;
    }

    if (window.confirm('¿Está seguro de eliminar este rol?')) {
      try {
        await deleteRol(id);
        showSnackbar('Rol eliminado exitosamente', 'success');
      } catch (err: any) {
        showSnackbar(err.message || 'Error al eliminar el rol', 'error');
      }
    }
  };

  const showSnackbar = (
    message: string,
    severity: 'success' | 'error' | 'warning'
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // ===== EARLY RETURN - LOADING STATE =====
  if (loading === 'loading' && roles.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // ===== RENDER =====
  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'background.default' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Gestión de Roles
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total de roles: {roles.length}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            size="large"
          >
            Nuevo Rol
          </Button>
        </Box>
      </Paper>

      {/* Dashboard Cards - Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <CategoryIcon color="primary" fontSize="large" />
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Total de Roles
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {roles.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <PeopleIcon color="success" fontSize="large" />
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Usuarios Totales
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {totalUsuarios}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <SecurityIcon color="info" fontSize="large" />
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Roles en Uso
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="info.main">
                    {rolesEnUso}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <CategoryIcon color="warning" fontSize="large" />
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Roles Sin Usar
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {rolesSinUsar}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Informational Alert */}
      <Alert severity="info" sx={{ mb: 2 }}>
        <strong>Nota:</strong> Los roles Admin (ID: 1), Docente (ID: 2) y Estudiante (ID: 3) son roles del sistema 
        y no pueden ser eliminados. Solo pueden editarse si no tienen usuarios asignados.
      </Alert>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
      )}

      {/* Data Table */}
      <RolTable
        roles={roles}
        estadisticas={estadisticas}
        onEdit={handleOpenDialog}
        onDelete={handleDelete}
      />

      {/* Form Dialog */}
      <RolFormDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        rol={selectedRol}
      />

      {/* Notification Snackbar */}
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
