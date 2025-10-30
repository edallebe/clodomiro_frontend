// src/routes/AppRouter.tsx

import type { FC } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/MainLayout';
import { AsignaturaList } from '../commons/asignatura/screens/AsignaturaList';
import { CursoList } from '../commons/curso/screens/CursoList';
import { UsuarioList } from '../commons/usuario/screens/UsuarioList';
import { InscripcionList } from '../commons/inscripcion/screens/InscripcionList';
import { NotaList } from '../commons/nota/screens/NotaList';
import { RolList } from '../commons/rol/screens/RolList';

/**
 * Router Principal de la Aplicación
 * Patrón: Centralized Routing
 * 
 * Todos los módulos CRUD están implementados (incluido Roles)
 */

export const AppRouter: FC = () => {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          {/* Ruta por defecto */}
          <Route path="/" element={<Navigate to="/roles" replace />} />

          {/* Módulos implementados */}
          <Route path="/roles" element={<RolList />} />
          <Route path="/usuarios" element={<UsuarioList />} />
          <Route path="/asignaturas" element={<AsignaturaList />} />
          <Route path="/cursos" element={<CursoList />} />
          <Route path="/inscripciones" element={<InscripcionList />} />
          <Route path="/notas" element={<NotaList />} />

          {/* 404 Not Found */}
          <Route 
            path="*" 
            element={
              <Box p={3}>
                <Typography variant="h4">404 - Página no encontrada</Typography>
              </Box>
            } 
          />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

// Imports faltantes
import { Box, Typography } from '@mui/material';
