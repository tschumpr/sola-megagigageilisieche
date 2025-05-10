import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: 'rgb(51, 243, 51)',
      contrastText: '#000000',
    },
    secondary: {
      main: '#f50057',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ff262b',
    },
    warning: {
      main: '#ff892e',
    },
    success: {
      main: '#00da09',
    },
    info: {
      main: '#00a5ff',
    },
  },
});
