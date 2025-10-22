// src/commons/usuario/components/UsuarioTable.tsx

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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { Usuario } from '../../../types';

interface UsuarioTableProps {
  usuarios: Usuario[];
  onEdit: (usuario: Usuario) => void;
  onDelete: (id: number) => void;
}

const getRolColor = (rolId: number): 'error' | 'primary' | 'success' => {
  switch (rolId) {
    case 1: return 'error';      // Admin
    case 2: return 'primary';    // Docente
    case 3: return 'success';    // Estudiante
    default: return 'primary';
  }
};

const getRolLabel = (rol?: { nombre_rol: string }, rolId?: number): string => {
  if (rol) return rol.nombre_rol;
  if (rolId === 1) return 'Admin';
  if (rolId === 2) return 'Docente';
  if (rolId === 3) return 'Estudiante';
  return 'Sin rol';
};

export const UsuarioTable: FC<UsuarioTableProps> = ({ usuarios, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper} elevation={2}>
      <Table sx={{ minWidth: 750 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'primary.main' }}>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre Completo</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Correo</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Rol</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usuarios.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                No hay usuarios registrados
              </TableCell>
            </TableRow>
          ) : (
            usuarios.map((usuario) => (
              <TableRow
                key={usuario.idUsuario}
                sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <TableCell>{usuario.idUsuario}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
                  {usuario.nombre} {usuario.apellido}
                </TableCell>
                <TableCell>{usuario.correo}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={getRolLabel(usuario.rol_detail, usuario.rol)}
                    color={getRolColor(usuario.rol)}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Editar">
                    <IconButton size="small" color="primary" onClick={() => onEdit(usuario)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton size="small" color="error" onClick={() => onDelete(usuario.idUsuario)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};