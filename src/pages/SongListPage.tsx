import { Chip, Stack, Typography,useTheme } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { AudioDownloadButton, DirectusImage, Loader, MainLayout, PdfDownloadButton } from '@/components';
import { SearchableTable } from '@/components/SearchableTable';
import { useGetSongs } from '@/hooks';
import { DOMPurify } from '@/utils';

export const SongListPage: React.FC = () => {
  const theme = useTheme();

  const { data: songs, isLoading: isLoadingSongs } = useGetSongs();

  const navigate = useNavigate();

  const isLoading = isLoadingSongs;

  if (isLoading) {
    return (
      <MainLayout>
        <Loader text="Lade Lieder…" />
      </MainLayout>
    );
  }

  if (!songs) {
    return (
      <MainLayout>
        <Typography variant="h1" sx={{ color: theme.palette.error.main }}>Lieder konnten nicht geladen werden.</Typography>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Typography variant="h1">
        Lieder von A-Z
      </Typography>
      <SearchableTable
        tableTitle='Alle Lieder'
        data={songs}
        defaultOrder='title'
        columns={[
          {
            id: 'preview_image',
            align: 'center',
            sortable: false,
            maxWidth: '128px',
            label: 'Vorschaubild',
            renderRow: (song) => song.preview_image ? <DirectusImage fileId={song.preview_image} thumbnail={{ height: 32, quality: 75 }} height={32} /> : null,
          },
          {
            id: 'title',
            align: 'left',
            sortable: true,
            minWidth: 'fit-content',
            comparator: (order, lhs, rhs) => order === 'asc' ? lhs.title.localeCompare(rhs.title) : rhs.title.localeCompare(lhs.title),
            label: 'Titel',
            renderRow: (o) => <Typography variant="body2" whiteSpace="nowrap">{ o.title }</Typography>,
          },
          {
            id: 'text',
            label: 'Beschreibung',
            sortable: false,
            renderRow: (o) => (
              <Typography
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 400, display: 'inline-block' }}
                variant="inherit"
              >
                {DOMPurify.sanitize(o.text, { RETURN_DOM_FRAGMENT: true }).textContent || ''}
              </Typography>
            ),
          },
          {
            id: 'genres',
            align: 'left',
            sortable: false,
            label: 'Genres',
            maxWidth: '250px',
            renderRow: (song) => (
              <Stack direction="row" spacing={1} sx={{ mb: theme.spacing(1), overflowX: 'scroll' }} useFlexGap>
                { song.genres.map((genre) => (<Chip size='small' key={genre.genres_id.id} label={genre.genres_id.name} />)) }
              </Stack>
            ),
          },
          {
            id: 'authors',
            align: 'left',
            sortable: false,
            label: 'Autoren',
            maxWidth: '250px',
            renderRow: (song) => (
              <Stack direction="row" spacing={1} sx={{ mb: theme.spacing(1), overflowX: 'scroll' }} useFlexGap>
                { song.authors.map((author) => (<Chip size='small' key={author.authors_id.id} label={author.authors_id.name} />)) }
              </Stack>
            ),
          },
          {
            id: 'pdf',
            align: 'center',
            sortable: false,
            label: 'PDF-Download',
            renderRow: (song) => (<PdfDownloadButton song={song} variant='icon' />),
          },
          {
            id: 'audio',
            align: 'center',
            sortable: false,
            label: 'Audio-Download',
            renderRow: (song) => (<AudioDownloadButton song={song} variant='icon' />),
          },
        ]}
        enableSelection={false}
        sx={{ mt: theme.spacing(4) }}
        onClick={(_event, songId) => { navigate(`/songs/${songId}`); }}
      />
    </MainLayout>
  );
};
