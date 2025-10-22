// src/App.tsx

import { ThemeProvider, CssBaseline } from '@mui/material';
import { AppRouter } from './routes/AppRouter';
import { theme } from './theme/theme';

/**
 * Componente raíz de la aplicación
 * Providers:
 * - ThemeProvider: Tema Material-UI personalizado
 * - CssBaseline: Normalización CSS
 * - Router: Sistema de navegación
 */

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;