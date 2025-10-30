// src/commons/nota/components/NotaTable.tsx

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
import type { Nota } from '../../../types';

interface NotaTableProps {
  notas: Nota[];
  onEdit: (nota: Nota) => void;
  onDelete: (id: number) => void;
}

const getCalificacionColor = (calificacion: number): 'error' | 'warning' | 'info' | 'success' => {
  if (calificacion < 60) return 'error';       // Reprobado
  if (calificacion < 75) return 'warning';     // Aprobado básico
  if (calificacion < 90) return 'info';        // Aprobado satisfactorio
  return 'success';                             // Excelente
};

const getCalificacionLabel = (calificacion: number): string => {
  if (calificacion < 60) return 'Reprobado';
  if (calificacion < 75) return 'Aprobado';
  if (calificacion < 90) return 'Satisfactorio';
  return 'Excelente';
};

export const NotaTable: FC<NotaTableProps> = ({ notas, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper} elevation={2}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'primary.main' }}>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estudiante</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Curso</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Calificación</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Estado</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {notas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                No hay notas registradas
              </TableCell>
            </TableRow>
          ) : (
            notas.map((nota) => (
              <TableRow
                key={nota.idnotas}
                sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <TableCell>{nota.idnotas}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
                  {nota.inscripcion_detail?.estudiante_detail
                    ? `${nota.inscripcion_detail.estudiante_detail.nombre} ${nota.inscripcion_detail.estudiante_detail.apellido}`
                    : `Inscripción ID: ${nota.inscripcion}`}
                </TableCell>
                <TableCell>
                  {nota.inscripcion_detail?.curso_detail?.nombre_curso || 'N/A'}
                </TableCell>
                <TableCell align="center">
                  <Typography variant="h6" fontWeight="bold" color={
                    nota.calificacion >= 60 ? 'success.main' : 'error.main'
                  }>
                    {nota.calificacion}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={getCalificacionLabel(nota.calificacion)}
                    color={getCalificacionColor(nota.calificacion)}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Editar">
                    <IconButton size="small" color="primary" onClick={() => onEdit(nota)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton size="small" color="error" onClick={() => onDelete(nota.idnotas)}>
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

// Import faltante
import { Typography } from '@mui/material';