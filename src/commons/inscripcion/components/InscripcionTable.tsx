// src/commons/inscripcion/components/InscripcionTable.tsx

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
import { Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import type { Inscripcion } from '../../../types';

interface InscripcionTableProps {
  inscripciones: Inscripcion[];
  onView: (inscripcion: Inscripcion) => void;
  onDelete: (id: number) => void;
}

export const InscripcionTable: FC<InscripcionTableProps> = ({ 
  inscripciones, 
  onView, 
  onDelete 
}) => {
  return (
    <TableContainer component={Paper} elevation={2}>
      <Table sx={{ minWidth: 750 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'primary.main' }}>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estudiante</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Curso</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Asignatura</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Estado</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inscripciones.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                No hay inscripciones registradas
              </TableCell>
            </TableRow>
          ) : (
            inscripciones.map((inscripcion) => (
              <TableRow
                key={inscripcion.idInscripcion}
                sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <TableCell>{inscripcion.idInscripcion}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
                  {inscripcion.estudiante_detail
                    ? `${inscripcion.estudiante_detail.nombre} ${inscripcion.estudiante_detail.apellido}`
                    : `ID: ${inscripcion.estudiante}`}
                </TableCell>
                <TableCell>
                  {inscripcion.curso_detail?.nombre_curso || `Curso ID: ${inscripcion.curso}`}
                </TableCell>
                <TableCell>
                  {inscripcion.asignatura_detail?.nombre || `Asignatura ID: ${inscripcion.asignatura}`}
                </TableCell>
                <TableCell align="center">
                  <Chip label="Activa" color="success" size="small" sx={{ fontWeight: 500 }} />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Ver detalles">
                    <IconButton size="small" color="primary" onClick={() => onView(inscripcion)}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton size="small" color="error" onClick={() => onDelete(inscripcion.idInscripcion)}>
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