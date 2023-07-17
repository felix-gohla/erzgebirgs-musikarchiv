import { CssBaseline,ThemeProvider as MuiThemeProvider, useMediaQuery } from '@mui/material';
import React from 'react';

import { ThemeMode, ThemeModeContext } from '@/contexts';
import { generateTheme } from '@/theme';

export const ThemeProvider: React.FC<React.PropsWithChildren<NonNullable<unknown>>> = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [themeMode, setThemeMode] = React.useState<ThemeMode>(prefersDarkMode ? 'dark' : 'light');
  React.useEffect(() => {
    setThemeMode(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode, setThemeMode]);
  const theme = React.useMemo(
    () => generateTheme(themeMode === 'dark'),
    [themeMode],
  );
  return (
    <ThemeModeContext.Provider value={{ themeMode: themeMode, setThemeMode: setThemeMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        { children }
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
};
