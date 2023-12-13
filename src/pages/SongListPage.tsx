import { FilterOperators } from '@directus/sdk';
import { Chip, Stack, Typography,useTheme } from '@mui/material';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { AudioDownloadButton, DirectusImage, Loader, MainLayout, PdfDownloadButton } from '@/components';
import { type ColumnDefinition, type FilterModelFromColumnDefinition, LoadDataCallback,SearchableTable } from '@/components/SearchableTable';
import { useGetSongs } from '@/hooks';
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
Object.freeze(columns);

type SongFilterModel = FilterModelFromColumnDefinition<typeof columns, Song>

const fetchFilterFromModel = (filterModel: SongFilterModel) => {
  const authorsFilter = Array.from(filterModel?.authors?.filterValue || []).filter((i): i is number => typeof i === 'number');
  const genresFilter = Array.from(filterModel?.genres?.filterValue || []).filter((i): i is number => typeof i === 'number');
  const titleFilter = filterModel?.title?.filterValue;
  const textFilter = filterModel?.text?.filterValue;
  const shallHavePdf = filterModel?.pdf?.filterValue;
  const shallHaveAudio = filterModel?.audio?.filterValue;
  return {
    authors: authorsFilter.length > 0 ? { authors_id: { id: { '_in': Array.from(authorsFilter) } } } : undefined,
    genres: genresFilter.length > 0 ? { genres_id: { id: { '_in': Array.from(genresFilter) } } } : undefined,
    pdf: shallHavePdf ? { '_null': false } : undefined,
    audio: shallHaveAudio ? { '_null': false } : undefined,
    title: titleFilter ? { '_icontains': titleFilter } as FilterOperators<string> : undefined,
    text: textFilter ? { '_icontains': textFilter } as FilterOperators<string> : undefined,
  };
};

export const SongListPage: React.FC = () => {
  const theme = useTheme();

  // const [filterModel, setFilterModel] = React
  // const [isLoadingSongs, setIsLoadingSongs] = React.useState(false);
  const { data: songs, error: loadSongsError, isLoading: isLoadingSongs, refetch } = useGetSongs();

  const songCount = songs?.length || 0;

  const loadDataCallback: LoadDataCallback<Song, typeof columns> = useCallback(async (
    _offset,
    _idx,
    _order,
    _sortation,
    filter,
  ) => await refetch({ filter: fetchFilterFromModel(filter) }) || [], [refetch]);

  const navigate = useNavigate();

  const isLoading = isLoadingSongs;

  const tableSx = React.useMemo(() => ({ mt: theme.spacing(4) }), [theme]);
  const clickCallback = React.useCallback((_event: React.MouseEvent, songId: Song['id']) => { navigate(`/songs/${songId}`); }, [navigate]);

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
        loadData={loadDataCallback}
        defaultOrder='title'
        columns={columns}
        enableSelection={false}
        sx={tableSx}
        onClick={clickCallback}
        noDataText='Keine Lieder gefunden'
        isLoading={isLoading}
        useUrlFiltering
      />
    </MainLayout>
  );
};
