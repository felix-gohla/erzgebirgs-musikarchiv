import { Chip, Stack, Typography,useTheme } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { AudioDownloadButton, DirectusImage, Loader, MainLayout, PdfDownloadButton } from '@/components';
import { ColumnDefinition, type FilterModelFromColumnDefinition, SearchableTable } from '@/components/SearchableTable';
import { useCountSongs, useGetSongs } from '@/hooks';
import { findAuthors, findGenres } from '@/services';
import { Song } from '@/types';
import { DOMPurify } from '@/utils';

const columns = {
  preview_image: {
    align: 'center',
    sortable: false,
    maxWidth: '128px',
    label: 'Vorschaubild',
    renderRow: (song) => song.preview_image ? <DirectusImage fileId={song.preview_image} thumbnail={{ height: 32, quality: 75 }} height={32} /> : null,
  },
  title: {
    align: 'left',
    sortable: true,
    minWidth: 'fit-content',
    comparator: (order, lhs, rhs) => order === 'asc' ? lhs.title.localeCompare(rhs.title) : rhs.title.localeCompare(lhs.title),
    label: 'Titel',
    renderRow: (o) => <Typography variant="body2" whiteSpace="nowrap">{ o.title }</Typography>,
    filterSettings: {
      type: 'text',
      order: 0,
      title: 'Titel enthält',
    },
  },
  text: {
    label: 'Beschreibung',
    sortable: false,
    renderRow: (o) => (
      <Typography
        sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300, display: 'inline-block' }}
        variant="inherit"
      >
        {DOMPurify.sanitize(o.text, { RETURN_DOM_FRAGMENT: true }).textContent || ''}
      </Typography>
    ),
    filterSettings: {
      type: 'text',
      title: 'Beschreibung enthält',
      order: 5,
    },
  },
  genres: {
    align: 'left',
    sortable: false,
    label: 'Genres',
    maxWidth: '250px',
    renderRow: (song) => (
      <Stack direction="row" spacing={1} sx={(theme) => ({ mb: theme.spacing(1), overflowX: 'scroll' })} useFlexGap>
        { song.genres.map((genre) => (<Chip size='small' key={genre.genres_id.id} label={genre.genres_id.name} />)) }
      </Stack>
    ),
    filterSettings: {
      type: 'multi-select',
      options: async () => {
        const genres = await findGenres({ fields: ['id', 'name'] });
        return genres.map((genre) => ({ id: genre.id, label: genre.name }));
      },
      dropdownTitle: 'Genre',
      order: 1,
    },
  },
  authors: {
    align: 'left',
    sortable: false,
    label: 'Autoren',
    maxWidth: '250px',
    renderRow: (song) => (
      <Stack direction="row" spacing={1} sx={(theme) => ({ mb: theme.spacing(1), overflowX: 'scroll' })} useFlexGap>
        { song.authors.map((author) => (<Chip size='small' key={author.authors_id.id} label={author.authors_id.name} />)) }
      </Stack>
    ),
    filterSettings: {
      type: 'multi-select',
      options: async () => {
        const authors = await findAuthors({ fields: ['id', 'name'] });
        return authors.map((author) => ({ id: author.id, label: author.name }));
      },
      dropdownTitle: 'Autor',
      order: 2,
    },
  },
  pdf: {
    align: 'center',
    sortable: false,
    label: 'PDF-Download',
    renderRow: (song) => (<PdfDownloadButton song={song} variant='icon' />),
    filterSettings: {
      type: 'boolean',
      toggleTitle: 'PDF',
      order: 3,
    },
  },
  audio: {
    align: 'center',
    sortable: false,
    label: 'Audio-Download',
    renderRow: (song) => (<AudioDownloadButton song={song} variant='icon' />),
    filterSettings: {
      type: 'boolean',
      toggleTitle: 'Audiovorschau',
      order: 4,
    },
  },
} satisfies ColumnDefinition<Song>;

export const SongListPage: React.FC = () => {
  const theme = useTheme();

  const [filterModel, setFilterModel] = React.useState<FilterModelFromColumnDefinition<typeof columns, Song>>();

  const fetchFilter = React.useMemo(() => {
    const authorsFilter = Array.from(filterModel?.authors?.filterValue || []);
    const genresFilter = Array.from(filterModel?.genres?.filterValue || []);
    const titleFilter = filterModel?.title?.filterValue;
    const textFilter = filterModel?.text?.filterValue;
    const shallHavePdf = filterModel?.pdf?.filterValue;
    const shallHaveAudio = filterModel?.audio?.filterValue;
    return {
      authors: authorsFilter.length > 0 ? { authors_id: { id: { '_in': Array.from(authorsFilter) } } } : undefined,
      genres: genresFilter.length > 0 ? { genres_id: { id: { '_in': Array.from(genresFilter) } } } : undefined,
      pdf: shallHavePdf ? { '_neq': null } : undefined,
      audio: shallHaveAudio ? { '_neq': null } : undefined,
      title: titleFilter ? { '_icontains': titleFilter } : undefined,
      text: textFilter ? { '_icontains': textFilter } : undefined,
    };
  }, [filterModel]);

  const { data: songCount } = useCountSongs(fetchFilter);
  const { data: songs, error: loadSongsError, isLoading: isLoadingSongs } = useGetSongs({
    filter: fetchFilter,
  });

  const navigate = useNavigate();

  const isLoading = isLoadingSongs;

  if (!songs && isLoading) {
    return (
      <MainLayout>
        <Loader text="Lade Lieder…" />
      </MainLayout>
    );
  }
  if (loadSongsError || !songs) {
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
        title="Alle Lieder"
        totalRowCount={songCount || 10}
        loadData={async () => new Promise<Song[]>((resolve) => resolve(songs)) }
        defaultOrder='title'
        columns={columns}
        enableSelection={false}
        sx={{ mt: theme.spacing(4) }}
        onClick={(_event, songId) => { navigate(`/songs/${songId}`); }}
        onFilterChange={setFilterModel}
        noDataText='Keine Lieder gefunden'
        isLoading={isLoading}
        filter={filterModel}
      />
    </MainLayout>
  );
};
