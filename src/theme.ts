import { createTheme, responsiveFontSizes } from '@mui/material';

export const generateTheme = (prefersDarkMode: boolean) => responsiveFontSizes(createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides(theme) {
        console.log(theme.typography)
        return {
          blockquote: {
            position: 'relative',
            padding: '4px 16px',
            margin: 0,
            borderLeft: '4px solid',
            borderColor: theme.palette.primary.dark,
            '& p': {
              color: theme.palette.text.secondary,
              fontStyle: 'italic',
              fontWeight: theme.typography.fontWeightMedium,
              textIndent: '12px',
              lineHeight: '1.5rem',
              margin: 0,
            },
            '&::before': {
              position: 'absolute',
              color: theme.palette.primary.dark,
              content: '"“"',
              fontSize: '2.25rem',
              lineHeight: '0.5',
              marginLeft: '-6px',
              top: '8px',
            },
          },
        }
      },
    }
  },
  shape: {
    borderRadius: 2.5,
  },
  palette: {
    mode: prefersDarkMode ? 'dark' : 'light',
  },
  typography: {
    fontWeightBold: 700,
    fontWeightMedium: 600,
    fontWeightRegular: 400,
    h1: {
      fontSize: 80,
      fontWeight: 600,
      marginBottom: 3,
    },
    h2: {
      fontWeight: 500,
      marginBottom: 2,
    },
    h3: {
      fontWeight: 400,
      marginBottom: 1.5,
    },
    h4: {
      fontWeight: 400,
      marginBottom: 1,
    },
    h5: {
      fontWeight: 400,
      marginBottom: 1,
    },
    h6: {
      fontWeight: 400,
      marginBottom: 1,
    }
  },
}), { factor: 2.5 });
