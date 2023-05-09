import { createTheme } from '@mui/material';

export const generateTheme = (prefersDarkMode: boolean) => createTheme({
  palette: {
    mode: prefersDarkMode ? 'dark' : 'light',
  },
});
