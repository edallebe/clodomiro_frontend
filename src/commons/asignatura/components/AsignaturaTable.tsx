// src/commons/asignatura/components/AsignaturaTable.tsx

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
import type { Asignatura } from '../../../types/index';
import type { Usuario } from '../../../types';

/**
 * Componente de presentación para tabla de asignaturas
 * Patrón: Presentation Component (Dumb Component)
 * Props: Data + Callbacks (Dependency Injection)
 */

interface AsignaturaTableProps {
  asignaturas: Asignatura[];
  onEdit: (asignatura: Asignatura) => void;
  onDelete: (id: number) => void;
}

interface usuarioDetail {
  nombre: string;
  apellido: string;
}

export const AsignaturaTable: FC<AsignaturaTableProps> = ({
  asignaturas,
  onEdit,
  onDelete,
}) => {
  return (
    <TableContainer component={Paper} elevation={2}>
      <Table sx={{ minWidth: 650 }} aria-label="tabla de asignaturas">
        <TableHead>
          <TableRow sx={{ backgroundColor: 'primary.main' }}>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Docente</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
              Estado
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {asignaturas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                No hay asignaturas registradas
              </TableCell>
            </TableRow>
          ) : (
            asignaturas.map((asignatura) => (
              <TableRow
                key={asignatura.idAsignatura}
                sx={{
                  '&:hover': { backgroundColor: 'action.hover' },
                  transition: 'background-color 0.2s',
                }}
              >
                <TableCell>{asignatura.idAsignatura}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{asignatura.nombre}</TableCell>
                <TableCell>
                  {asignatura.docente_detail
                    ? `${asignatura.docente_detail.nombre} ${asignatura.docente_detail.apellido}`
                    : `Docente ID: ${asignatura.docente}`}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label="Activa"
                    color="success"
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onEdit(asignatura)}
                      aria-label="editar asignatura"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete(asignatura.idAsignatura)}
                      aria-label="eliminar asignatura"
                    >
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