import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import React from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';

import { ErrorBoundary } from '@/components/ErrorBoundary';

import { AuthorPage } from './pages/AuthorPage';
import { GenrePage } from './pages/GenrePage';
import { LandingPage } from './pages/LandingPage';
import { SongListPage } from './pages/SongListPage';
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
        <ErrorBoundary>
          <Routes>
            <Route
              path="/"
              errorElement={<div>Error</div>}
            >
              <Route path="/" element={<LandingPage />} />
              <Route path="/songs/:id" element={<SongPage />} />
              <Route path="/songs/" element={<SongListPage />} />
              <Route path="/authors/:id" element={<AuthorPage />} />
              <Route path="/genres/:id" element={<GenrePage />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
