import { List, ListItem, ListItemText, Typography,useTheme } from '@mui/material';
import React from 'react';

import { Loader, MainLayout } from '@/components';
import { useGetGenres } from '@/hooks';

export const GenresListPage: React.FC = () => {
  const theme = useTheme();

  const { data: genres, error: loadGenresError, isLoading: isLoadingSongs } = useGetGenres();

  const isLoading = isLoadingSongs;

  if (!genres && isLoading) {
    return (
      <MainLayout>
        <Loader text="Lade Genres…" />
      </MainLayout>
    );
  }
  if (loadGenresError || !genres) {
    return (
      <MainLayout>
        <Typography variant="h1" sx={{ color: theme.palette.error.main }}>Genres konnten nicht geladen werden.</Typography>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Typography variant="h1">
        Genres
      </Typography>
      <List>
        {
          genres.map((genre) => (
            <ListItem
              dense
              disablePadding
              key={`genre-${genre.id}`}
            >
              <ListItemText>
                { genre.name }
                {' '}
                ({ genre.songs_count } { genre.songs_count !== 1 ? 'Lieder' : 'Lied' })
              </ListItemText>
            </ListItem>
          ))
        }
      </List>
    </MainLayout>
  );
};
