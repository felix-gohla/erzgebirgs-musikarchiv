import RightArrowIcon from '@mui/icons-material/ArrowForward';
import MusicIcon from '@mui/icons-material/MusicNote';
import PersonIcon from '@mui/icons-material/Person';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import { Box, Button, Card, CardActions, CardContent, Grid, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { findSongs } from '@/services';
import { Song } from '@/types';

import { LandingLayout } from '../components';
import { SearchField } from '../components/SearchField';

export const LandingPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // const bull = (
  //   <Box
  //     component="span"
  //     sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  //   >
  //     •
  //   </Box>
  // );

  const AToZCard: React.FC = () => (
    <Card sx={{ minWidth: 275 }} elevation={3}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Stöbern
        </Typography>
        <Typography variant="h5" component="div">
          <MusicIcon />&nbsp;Alle Lieder von A-Z
        </Typography>
        <Typography variant="body2">
          Eine Auflistung aller verzeichneten Lieder.
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" startIcon={<RightArrowIcon />}>Durchsuchen</Button>
      </CardActions>
    </Card>
  );

  const AuthorsCard: React.FC = () => (
    <Card sx={{ minWidth: 275 }} elevation={3}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Beteiligte
        </Typography>
        <Typography variant="h5" component="div">
          <PersonIcon />&nbsp;Autorenverzeichnis
        </Typography>
        <Typography variant="body2">
          Eine Auflistung aller beteiligten Autoren.
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" startIcon={<RightArrowIcon />}>Durchsuchen</Button>
      </CardActions>
    </Card>
  );

  const GenresCard: React.FC = () => (
    <Card sx={{ minWidth: 275 }} elevation={3}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Stilrichtungen
        </Typography>
        <Typography variant="h5" component="div">
          <TheaterComedyIcon />&nbsp;Genreverzeichnis
        </Typography>
        <Typography variant="body2">
          Eine Auflistung aller Genres.
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" startIcon={<RightArrowIcon />}>Durchsuchen</Button>
      </CardActions>
    </Card>
  );

  return (
    <LandingLayout>
      <Box sx={{ pt: { md: theme.spacing(4), lg: theme.spacing(8) }, width: '100%', mx: 'auto' }}>
        <Typography variant="h1">
          Erzgebirgsmusik
        </Typography>
        <Typography variant="h3" sx={{ mb: theme.spacing(2) }}>
          Liederarchiv
        </Typography>
        <Typography variant="h6" sx={{ mb: theme.spacing(4) }}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Hic aliquam molestias quibusdam, neque quo suscipit facilis temporibus nemo cumque et accusantium dolorem, culpa fuga esse consequatur aperiam. Dolorem, cupiditate? Pariatur?
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Est repellat aut provident nesciunt illo hic ad laborum quis, recusandae eligendi. Sequi magnam aspernatur ad unde consequatur? Tenetur eius quis modi.
        </Typography>
        <SearchField
          label='Lieder Suchen…'
          fetchOptions={async (searchTerm): Promise<Song[]> => findSongs({
            filter: searchTerm !== '' ? { '_or': [
              { title: { '_icontains': searchTerm } },
              { text: { '_icontains': searchTerm } },
              { authors: { authors_id: { name: { '_icontains': searchTerm } } } },
              { genres: { genres_id: { name: { '_icontains': searchTerm } } } },
            ] } : {},
            limit: 100,
          })}
          onChange={(value): void => {
            if (!value || typeof value === 'string') {
              return;
            }
            navigate(`/songs/${value.id}`);
          }}
          getOptionLabel={(song: Song | string): string => typeof song !== 'string' ? song.title : song}
          isOptionEqualToValue={(option: Song, value: Song): boolean => option.id === value.id}
        />
      </Box>
      <Box sx={{ mt: theme.spacing(4) }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <AToZCard />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AuthorsCard />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <GenresCard />
          </Grid>
        </Grid>
      </Box>
    </LandingLayout>
  );
};
