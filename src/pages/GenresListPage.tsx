import { Link as MuiLink,List, ListItem, ListItemText, ListSubheader,Typography, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
import { createSearchParams,Link } from 'react-router-dom';

import { Loader, MainLayout } from '@/components';
import { useGetGenres } from '@/hooks';
import { Genre } from '@/types';

export const GenresListPage: React.FC = () => {
  const theme = useTheme();

  const { data: genres, error: loadGenresError, isLoading: isLoadingSongs } = useGetGenres();

  const isLoading = isLoadingSongs;

  const genresByLetter = useMemo(() => {
    if (isLoading || !genres) {
      return {};
    }
    return genres
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .reduce((acc, genre) => {
        const letter = genre.name.charAt(0).toUpperCase();
        acc[letter] ??= [];
        acc[letter].push(genre);
        return acc;
      }, {} as Record<string, Genre[]>);
  }, [genres, isLoading]);

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
      <Typography variant="h1" sx={(theme) => ({ mb: theme.spacing(1) })}>
        Genres
      </Typography>
      <Typography sx={(theme) => ({ mb: theme.spacing(2) })}>Stöbern Sie durch die verschiedenen Genres der Sammlung.</Typography>

      <List
        sx={{ width: '100%' }}
        component="div"
      >
        {
          Object.keys(genresByLetter)
            .sort((a, b) => a.localeCompare(b))
            .map((letter) => {
              const genres = genresByLetter[letter];
              return (
                <List
                  key={`list-letter-${letter}`}
                  component="div"
                  aria-labelledby={`genres-with-letter-${letter}`}
                  subheader={
                    <ListSubheader component="div" id={`genres-with-letter-${letter}`}>
                      <Typography variant='subtitle1'>{ letter }</Typography>
                    </ListSubheader>
                  }
                >
                  {
                    genres.map((genre) => {
                      const genreFilter = createSearchParams({filter: JSON.stringify({ genres: [genre.id] })});
                      return (
                        <ListItem
                          dense
                          disablePadding
                          key={`author-${genre.id}`}
                          sx={{ pl: theme.spacing(4) }}
                        >
                          <MuiLink component={Link} to={{ pathname: '/songs', search: `?${genreFilter}` }}>
                            <ListItemText>
                              { genre.name }
                              {' '}
                              ({ genre.songs_count } { genre.songs_count !== 1 ? 'Lieder' : 'Lied' })
                            </ListItemText>
                          </MuiLink>
                        </ListItem>
                      );
                    })
                  }
                </List>
              );
            })
        }
      </List>
    </MainLayout>
  );
};
