// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#228b22', // adjust to your brand color
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FFBF00', // Amber
    },
    secondary: {
      main: '#558B2F', // Hops Green
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#555555',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  // Add transitions to components if desired.
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFBF00',
    },
    secondary: {
      main: '#558B2F',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#bbbbbb',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
  },
});

export default theme;
