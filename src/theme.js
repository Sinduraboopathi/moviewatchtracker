import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => createTheme({
  palette: { mode }
});

const theme = createTheme({
  palette: {
    mode: 'dark', 
    primary: {
      main: '#1976d2', 
    },
    secondary: {
      main: '#ff4081', 
    },
    background: {
      default: '#121212', 
      paper: '#1e1e1e', 
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;
