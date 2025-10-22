// src/commons/curso/components/CursoTable.tsx

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
import type { Curso } from '../../../types';

interface CursoTableProps {
  cursos: Curso[];
  onEdit: (curso: Curso) => void;
  onDelete: (id: number) => void;
}

export const CursoTable: FC<CursoTableProps> = ({ cursos, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper} elevation={2}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'primary.main' }}>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre del Curso</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Asignatura</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Estado</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cursos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                No hay cursos registrados
              </TableCell>
            </TableRow>
          ) : (
            cursos.map((curso) => (
              <TableRow
                key={curso.idCurso}
                sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <TableCell>{curso.idCurso}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{curso.nombre_curso}</TableCell>
                <TableCell>
                  {curso.asignatura_detail?.nombre || `Asignatura ID: ${curso.asignatura}`}
                </TableCell>
                <TableCell align="center">
                  <Chip label="Activo" color="success" size="small" />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Editar">
                    <IconButton size="small" color="primary" onClick={() => onEdit(curso)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton size="small" color="error" onClick={() => onDelete(curso.idCurso)}>
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