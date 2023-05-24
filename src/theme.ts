import { createTheme, responsiveFontSizes } from '@mui/material';

export const generateTheme = (prefersDarkMode: boolean) => responsiveFontSizes(createTheme({
  palette: {
    mode: prefersDarkMode ? 'dark' : 'light',
  },
}));
