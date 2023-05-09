import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import React from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';

import { LandingPage } from './pages/LandingPage';
import { SongPage } from './pages/SongPage';
import { generateTheme } from './theme';

export const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(
    () => generateTheme(prefersDarkMode),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            errorElement={<div>Error</div>}
          >
            <Route path="/" element={<LandingPage />} />
            <Route path="/song/:id" element={<SongPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
