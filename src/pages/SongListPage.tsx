import { Typography,useTheme } from '@mui/material';
import React from 'react';

import { Loader, MainLayout } from '@/components';
import { useGetSongs } from '@/hooks';

export const SongListPage: React.FC = () => {
  const theme = useTheme();
  const { data: songs, isLoading } = useGetSongs();

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

  // const songPdfDownloadLink = song.pdf ? `${DIRECTUS_BASE_URL}/assets/${song.pdf}?download` : null;
  // const pdfName = song.title.toLowerCase().replaceAll(/[^A-Za-z0-9]/g, '-') + '.pdf';
  // const songAudioDownloadLink = song.audio ? `${DIRECTUS_BASE_URL}/assets/${song.audio}?download` : null;

  return (
    <MainLayout>
      <Typography variant="h1">
        Lieder von A-Z
      </Typography>
      <ul>
        {
          songs.map((song) => (<li key={song.id}>{ song.title }</li>))
        }
      </ul>
      {/* <Grid container spacing={2}>
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
          <Box
            component="div"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(song.text) }}
          />
        </Grid>
        {
          songPdfDownloadLink && (
            <Grid item xs={12} sm={4} md={3} lg={2}>
              <Button
                startIcon={<PictureAsPdfIcon />}
                fullWidth
                variant="contained"
                target="_blank"
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
                target="_blank"
                href={songAudioDownloadLink}
              >
                Audio-Download
              </Button>
            </Grid>
          )
        }
      </Grid> */}
    </MainLayout>
  );
};
