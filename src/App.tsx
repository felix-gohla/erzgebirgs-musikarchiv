import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import React from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';

import { AuthorPage } from './pages/AuthorPage';
import { LandingPage } from './pages/LandingPage';
import { SongPage } from './pages/SongPage';
import { generateTheme } from './theme';
import { GenrePage } from './pages/GenrePage';

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
            <Route path="/songs/:id" element={<SongPage />} />
            <Route path="/authors/:id" element={<AuthorPage />} />
            <Route path="/genres/:id" element={<GenrePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
