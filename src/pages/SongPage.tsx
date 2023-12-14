import { Chip, Grid, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { AudioDownloadButton, DirectusAudioPlayer, DirectusImage, HtmlText, Loader, MainLayout, PdfDownloadButton } from '@/components';
import { useGetSongById } from '@/hooks';

export const SongPage: React.FC = () => {
  const { id: songId } = useParams();

  const theme = useTheme();
  const { data: song, isLoading } = useGetSongById(parseInt(songId || '-1'), !!songId);

  const authors = React.useMemo(
    () => song?.authors.map((ar) => ar.authors_id).sort((lhs, rhs) => lhs.name.localeCompare(rhs.name)) || [],
    [song],
  );
  const genres = React.useMemo(
    () => song?.genres.map((gr) => gr.genres_id).sort((lhs, rhs) => lhs.name.localeCompare(rhs.name)) || [],
    [song],
  );

  if (!songId) {
    return (
      <MainLayout>
        <Typography variant="h1">Lied nicht gefunden.</Typography>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <Loader text="Lade Lied…" />
      </MainLayout>
    );
  }

  if (!song) {
    return (
      <MainLayout>
        <Typography variant="h1">Lied konnte nicht geladen werden.</Typography>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Grid container spacing={2} sx={{ maxWidth: '100%' }}>
        <Grid item xs={12} lg={song.preview_image ? 8 : 12}>
          <Typography variant='h1'>
            { song.title }
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: theme.spacing(1) }} flexWrap="wrap" useFlexGap>
            { genres.map((genre) => (<Chip size="small" label={genre.name} key={genre.id} clickable component={Link} to={`/genres/${genre.id}`} />)) }
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            { authors.map((author) => (<Chip size="small" label={`${author.first_name} ${author.name}`} key={author.id} clickable component={Link} to={`/authors/${author.id}`} />)) }
          </Stack>
        </Grid>
        { song.preview_image && (
          <Grid item xs={12} lg={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <DirectusImage
              fileId={song.preview_image}
              style={{ maxHeight: 384, maxWidth: '100%' }}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <HtmlText html={song.text} />
        </Grid>
        { song.audio &&
            <Grid item xs={12}>
              <DirectusAudioPlayer
                fileId={song.audio}
                title="Audiovorschau"
              />
            </Grid>
        }
        { song.pdf &&
        <Grid item xs={12} sm={4} md={3} lg={2}>
          <PdfDownloadButton song={song} />
        </Grid>
        }
        { song.audio &&
          <Grid item xs={12} sm={4} md={3} lg={2}>
            <AudioDownloadButton song={song} />
          </Grid>
        }
      </Grid>
    </MainLayout>
  );
};
