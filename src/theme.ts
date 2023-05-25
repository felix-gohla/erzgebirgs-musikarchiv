import { createTheme, responsiveFontSizes } from '@mui/material';

export const generateTheme = (prefersDarkMode: boolean) => responsiveFontSizes(createTheme({
  shape: {
    borderRadius: 2.5,
  },
  palette: {
    mode: prefersDarkMode ? 'dark' : 'light',
  },
}), { factor: 2.5 });
