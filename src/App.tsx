import React from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';

import { ErrorBoundary, ThemeProvider } from '@/components';

import { AuthorPage } from './pages/AuthorPage';
import { GenrePage } from './pages/GenrePage';
import { GenresListPage } from './pages/GenresListPage';
import { LandingPage } from './pages/LandingPage';
import { SongListPage } from './pages/SongListPage';
import { SongPage } from './pages/SongPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
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
              <Route path="/genres/" element={<GenresListPage />} />
              <Route path="/genres/:id" element={<GenrePage />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
