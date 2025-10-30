// src/commons/rol/components/RolTable.tsx

import type { FC } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, People as PeopleIcon } from '@mui/icons-material';
import type { Rol } from '../../../types';

interface RolTableProps {
  roles: Rol[];
  estadisticas: { [rolId: number]: { nombre: string; cantidad: number } };
  onEdit: (rol: Rol) => void;
  onDelete: (id: number) => void;
}

const getRolColor = (rolId: number): 'error' | 'primary' | 'success' | 'warning' => {
  switch (rolId) {
    case 1: return 'error';      // Admin - Rojo
    case 2: return 'primary';    // Docente - Azul
    case 3: return 'success';    // Estudiante - Verde
    default: return 'warning';   // Otros - Naranja
  }
};

const getRolIcon = (nombre: string): string => {
  const lower = nombre.toLowerCase();
  if (lower.includes('admin')) return '👑';
  if (lower.includes('docente') || lower.includes('profesor')) return '👨‍🏫';
  if (lower.includes('estudiante') || lower.includes('alumno')) return '🎓';
  return '👤';
};

export const RolTable: FC<RolTableProps> = ({ roles, estadisticas, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper} elevation={2}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'primary.main' }}>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre del Rol</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
              Usuarios Asignados
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
              Estado
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {roles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                No hay roles registrados
              </TableCell>
            </TableRow>
          ) : (
            roles.map((rol) => {
              const cantidadUsuarios = estadisticas[rol.idRol]?.cantidad || 0;
              const isSystemRole = rol.idRol <= 3; // Admin, Docente, Estudiante

              return (
                <TableRow
                  key={rol.idRol}
                  sx={{
                    '&:hover': { backgroundColor: 'action.hover' },
                    backgroundColor: isSystemRole ? 'action.selected' : 'inherit',
                  }}
                >
                  <TableCell>
                    <Chip
                      label={rol.idRol}
                      color={getRolColor(rol.idRol)}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h6" component="span">
                        {getRolIcon(rol.nombre_rol)}
                      </Typography>
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          {rol.nombre_rol}
                        </Typography>
                        {isSystemRole && (
                          <Typography variant="caption" color="text.secondary">
                            Rol del sistema
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                      <PeopleIcon color="action" fontSize="small" />
                      <Typography variant="h6" fontWeight="bold" color="primary.main">
                        {cantidadUsuarios}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      label={cantidadUsuarios > 0 ? 'En uso' : 'Sin usar'}
                      color={cantidadUsuarios > 0 ? 'success' : 'default'}
                      size="small"
                      variant={cantidadUsuarios > 0 ? 'filled' : 'outlined'}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEdit(rol)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip 
                      title={
                        isSystemRole 
                          ? 'No se puede eliminar un rol del sistema'
                          : cantidadUsuarios > 0
                          ? 'No se puede eliminar un rol con usuarios asignados'
                          : 'Eliminar'
                      }
                    >
                      <span>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => onDelete(rol.idRol)}
                          disabled={isSystemRole || cantidadUsuarios > 0}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};