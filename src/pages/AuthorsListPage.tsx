import { Box,FormControlLabel,Link as MuiLink,List, ListItem, ListItemText, ListSubheader,Switch, Typography, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
import { createSearchParams,Link } from 'react-router-dom';

import { Loader, MainLayout } from '@/components';
import { useGetAuthorsOverview } from '@/hooks';
import { AuthorOverview } from '@/types';

export const AuthorsListPage: React.FC = () => {
  const theme = useTheme();

  const { data: authors, error: loadAuthorsError, isLoading: isLoadingAuthors } = useGetAuthorsOverview();

  const isLoading = isLoadingAuthors;

  const [sortOrder, setSortOrder] = React.useState<'first_name' | 'last_name'>('last_name');
  const sortByLastName = sortOrder === 'last_name';

  const authorsByLetter = useMemo(() => {
    if (isLoading || !authors) {
      return {};
    }
    return authors
      .slice()
      .sort((a, b) => sortByLastName ? a.name.localeCompare(b.name) : a.first_name.localeCompare(b.first_name))
      .reduce((acc, author) => {
        const letter = sortByLastName ? author.name.charAt(0).toUpperCase() : author.first_name.charAt(0).toUpperCase();
        acc[letter] ??= [];
        acc[letter].push(author);
        return acc;
      }, {} as Record<string, AuthorOverview[]>);
  }, [authors, isLoading, sortByLastName]);

  if (!authors && isLoading) {
    return (
      <MainLayout>
        <Loader text="Lade Autoren…" />
      </MainLayout>
    );
  }
  if (loadAuthorsError || !authors) {
    return (
      <MainLayout>
        <Typography variant="h1" sx={{ color: theme.palette.error.main }}>Autoren konnten nicht geladen werden.</Typography>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Typography variant="h1">
        Autoren von A-Z
      </Typography>
      <Box display="flex" justifyContent="right">
        <FormControlLabel
          control={<Switch checked={sortByLastName} onChange={(_e, checked) => setSortOrder(checked ? 'last_name' : 'first_name')} />}
          label="Sortiere nach Nachname"
        />
      </Box>
      <List
        sx={{ width: '100%' }}
        component="div"
      >
        {
          Object.keys(authorsByLetter)
            .sort((a, b) => a.localeCompare(b))
            .map((letter) => {
              const authors = authorsByLetter[letter];
              return (
                <List
                  key={`list-letter-${letter}`}
                  component="div"
                  aria-labelledby={`authors-with-letter-${letter}`}
                  subheader={
                    <ListSubheader component="div" id={`authors-with-letter-${letter}`}>
                      <Typography variant='subtitle1'>{ letter }</Typography>
                    </ListSubheader>
                  }
                >
                  {
                    authors.map((author) => {
                      const authorFilter = createSearchParams({filter: JSON.stringify({ authors: [author.id] })});
                      return (
                        <ListItem
                          dense
                          disablePadding
                          key={`author-${author.id}`}
                          sx={{ pl: theme.spacing(4) }}
                        >
                          <MuiLink component={Link} to={{ pathname: '/songs', search: `?${authorFilter}` }}>
                            <ListItemText>
                              { author.first_name }
                              { ' ' }
                              { author.name }
                              {' '}
                              ({ author.songs_count } { author.songs_count !== 1 ? 'Lieder' : 'Lied' })
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
