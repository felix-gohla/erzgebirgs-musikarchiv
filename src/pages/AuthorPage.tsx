import { Box, Grid, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { DirectusAudioPlayer, DirectusImage, HtmlText, Loader, MainLayout } from '@/components';
import { ColumnDefinition, SearchableTable } from '@/components/SearchableTable';
import { useGetAuthorById } from '@/hooks';
import { useGetSongsByAuthorId } from '@/hooks/songs';
import { Song } from '@/types';
import { DOMPurify } from '@/utils';

export const AuthorPage: React.FC = () => {
  const { id: authorId } = useParams();

  const parsedAuthorId = parseInt(authorId || '1');

  const theme = useTheme();
  const navigate = useNavigate();

  const { data: author, isLoading: isLoadingAuthor } = useGetAuthorById(parsedAuthorId, !!authorId);
  const { data: songs, isLoading: isLoadingSongs } = useGetSongsByAuthorId(parsedAuthorId, undefined, !!authorId);

  const isLoading = isLoadingAuthor || isLoadingSongs;

  if (!authorId) {
    return (
      <MainLayout>
        <Typography variant="h1">Autor nicht gefunden.</Typography>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <Loader text="Lade Autor..." />
      </MainLayout>
    );
  }

  if (!author) {
    return (
      <MainLayout>
        <Typography variant="h1" sx={{ color: theme.palette.error.main }}>Autor konnte nicht geladen werden.</Typography>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Grid container sx={{ mb: theme.spacing(2) }} rowSpacing={2} columnSpacing={2}>
        <Grid item xs={12} lg={author.image ? 8 : 12}>
          <Typography variant='h1'>
            { author.name }
          </Typography>
          {
            author.description
              ? <HtmlText html={author.description} />
              : <Typography variant='subtitle1'>Für {author.name} wurde kein Beschreibungstext angegeben.</Typography>
          }
        </Grid>
        { author.image && (
          <Grid item xs={12} lg={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <DirectusImage
              fileId={author.image}
              style={{ maxHeight: 384 }}
            />
          </Grid>
        )}
      </Grid>
      <Box sx={{ mt: theme.spacing(4) }}>
        <SearchableTable
          title='Lieder'
          subtitle={`Folgende Lieder wurden für ${author.name} gefunden:`}
          loadData={async () => songs || []}
          totalRowCount={songs?.length || 0}
          enableSelection={false}
          onClick={(_event, songId) => { navigate(`/songs/${songId}`); }}
          columns={{
            preview_image: {
              label: 'Vorschaubild',
              align: 'center',
              sortable: false,
              renderRow: (o) => o.preview_image && (<DirectusImage fileId={o.preview_image} height={53} style={{ maxWidth: 53 }} />),
            },
            title: {
              label: 'Titel',
              align: 'left',
              sortable: true,
              minWidth: '30%',
              comparator: (order, lhs, rhs) => (order === 'asc' ? lhs.title.localeCompare(rhs.title) : rhs.title.localeCompare(lhs.title)),
            },
            text: {
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
            audio: {
              label: 'Audiovorschau',
              sortable: false,
              align: 'center',
              renderRow: (o) => {
                if (!o.audio) {
                  return null;
                }
                return (<DirectusAudioPlayer variant="mini" fileId={o.audio} />);
              },
            },
          } satisfies ColumnDefinition<Song>}
          defaultOrder="title"
        />
      </Box>
    </MainLayout>
  );
};
