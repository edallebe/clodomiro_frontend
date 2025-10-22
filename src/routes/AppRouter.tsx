// src/routes/AppRouter.tsx

import type { FC } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { MainLayout } from '../components/MainLayout';
import { AsignaturaList } from '../commons/asignatura/screens/AsignaturaList';

/**
 * Router Principal de la Aplicación
 * Patrón: Centralized Routing
 * 
 * Estructura de rutas:
 * / -> Dashboard (pendiente)
 * /asignaturas -> Gestión de asignaturas
 * /cursos -> Gestión de cursos (pendiente)
 * /usuarios -> Gestión de usuarios (pendiente)
 * /inscripciones -> Gestión de inscripciones (pendiente)
 * /notas -> Gestión de notas (pendiente)
 */

export const AppRouter: FC = () => {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          {/* Ruta por defecto - redirige a asignaturas */}
          <Route path="/" element={<Navigate to="/asignaturas" replace />} />

          {/* Módulo Asignaturas */}
          <Route path="/asignaturas" element={<AsignaturaList />} />

          {/* Placeholders para otros módulos */}
          <Route 
            path="/cursos" 
            element={
              <Box p={3}>
                <h1>Módulo de Cursos (En desarrollo)</h1>
              </Box>
            } 
          />
          
          <Route 
            path="/usuarios" 
            element={
              <Box p={3}>
                <h1>Módulo de Usuarios (En desarrollo)</h1>
              </Box>
            } 
          />

          <Route 
            path="/inscripciones" 
            element={
              <Box p={3}>
                <h1>Módulo de Inscripciones (En desarrollo)</h1>
              </Box>
            } 
          />

          <Route 
            path="/notas" 
            element={
              <Box p={3}>
                <h1>Módulo de Notas (En desarrollo)</h1>
              </Box>
            } 
          />

          {/* 404 Not Found */}
          <Route 
            path="*" 
            element={
              <Box p={3}>
                <h1>404 - Página no encontrada</h1>
              </Box>
            } 
          />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};