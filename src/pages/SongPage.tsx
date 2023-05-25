import AudioFileIcon from '@mui/icons-material/AudioFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Button, Chip, Grid, Stack, Typography,useTheme } from '@mui/material';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { DirectusAudioPlayer, DirectusImage, HtmlText, Loader, MainLayout } from '@/components';
import { useGetSongById } from '@/hooks';
import { DIRECTUS_BASE_URL } from '@/services/directus';

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

  const songPdfDownloadLink = song.pdf ? `${DIRECTUS_BASE_URL}/assets/${song.pdf}?download` : null;
  const pdfName = song.title.toLowerCase().replaceAll(/[^A-Za-z0-9]/g, '-') + '.pdf';
  const songAudioDownloadLink = song.audio ? `${DIRECTUS_BASE_URL}/assets/${song.audio}?download` : null;

  return (
    <MainLayout>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={song.preview_image ? 8 : 12}>
          <Typography variant='h1'>
            { song.title }
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: theme.spacing(1) }}>
            { genres.map((genre) => (<Chip label={genre.name} key={genre.id} clickable component={Link} to={`/genres/${genre.id}`} />)) }
          </Stack>
          <Stack direction="row" spacing={1}>
            { authors.map((author) => (<Chip label={author.name} key={author.id} clickable component={Link} to={`/authors/${author.id}`} />)) }
          </Stack>
        </Grid>
        { song.preview_image && (
          <Grid item xs={12} lg={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <DirectusImage
              fileId={song.preview_image}
              style={{ maxHeight: 384 }}
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
        {
          songPdfDownloadLink && (
            <Grid item xs={12} sm={4} md={3} lg={2}>
              <Button
                startIcon={<PictureAsPdfIcon />}
                fullWidth
                variant="contained"
                target="_top"
                href={songPdfDownloadLink}
                download={pdfName}
              >
                Noten-Download
              </Button>
            </Grid>
          )
        }
        {
          songAudioDownloadLink && (
            <Grid item xs={12} sm={4} md={3} lg={2}>
              <Button
                startIcon={<AudioFileIcon />}
                fullWidth
                variant="contained"
                target="_top"
                href={songAudioDownloadLink}
              >
                Audio-Download
              </Button>
            </Grid>
          )
        }
      </Grid>
    </MainLayout>
  );
};
