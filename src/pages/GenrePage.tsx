import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { DirectusImage, Loader, MainLayout } from '@/components';
import { SearchableTable } from '@/components/SearchableTable';
import { useGetGenreById, useGetSongsByGenreId } from '@/hooks';
import { DOMPurify } from '@/utils';

export const GenrePage: React.FC = () => {
  const { id: genreId } = useParams();

  const parsedGenreId = parseInt(genreId || '1');

  const theme = useTheme();
  const navigate = useNavigate();

  const { data: genre, isLoading: isLoadingAuthor } = useGetGenreById(parsedGenreId, !!genreId);
  const { data: songs, isLoading: isLoadingSongs } = useGetSongsByGenreId(parsedGenreId, undefined, !!genreId);

  const isLoading = isLoadingAuthor || isLoadingSongs;

  if (!genreId) {
    return (
      <MainLayout>
        <Typography variant="h1">Genre nicht gefunden.</Typography>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <Loader text="Lade Genre..." />
      </MainLayout>
    );
  }

  if (!genre) {
    return (
      <MainLayout>
        <Typography variant="h1" sx={{ color: theme.palette.error.main }}>Genre konnte nicht geladen werden.</Typography>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Typography variant='h1' sx={{ mb: theme.spacing(2) }}>
        { genre.name }
      </Typography>

      <Box>
        <SearchableTable
          tableTitle='Lieder'
          subtitle={`Folgende Lieder wurden für ${genre.name} gefunden:`}
          data={songs || []}
          enableSelection={false}
          onClick={(songId) => { navigate(`/songs/${songId}`); }}
          columns={[
            {
              id: 'preview_image',
              label: 'Vorschaubild',
              align: 'center',
              sortable: false,
              renderRow: (o) => o.preview_image && (<DirectusImage fileId={o.preview_image} height={53} style={{ maxWidth: 53 }} />),
            },
            {
              id: 'title',
              label: 'Titel',
              align: 'left',
              sortable: true,
              minWidth: '30%',
              comparator: (order, lhs, rhs) => (order === 'asc' ? lhs.title.localeCompare(rhs.title) : rhs.title.localeCompare(lhs.title)),
            },
            {
              id: 'text',
              label: 'Text',
              sortable: false,
              minWidth: '100%',
              renderRow: (o) => {
                return (
                  <Typography
                    sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '800px', display: 'inline-block' }}
                    variant="inherit"
                  >
                    {DOMPurify.sanitize(o.text, { RETURN_DOM_FRAGMENT: true }).textContent || ''}
                  </Typography>
                );
              },
            },
          ]}
          defaultOrder="title"
        />
      </Box>
    </MainLayout>
  );
};
