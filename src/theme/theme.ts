// src/theme/theme.ts

import { createTheme } from '@mui/material/styles';

/**
 * Configuración personalizada del tema Material-UI
 * Paleta de colores institucional (ajustar según branding)
 */

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Azul principal
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ff9800', // Naranja (SENA)
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: '#000',
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ed6c02',
    },
    success: {
      main: '#2e7d32',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Desactiva mayúsculas automáticas
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
        },
      },
    },
  },
});