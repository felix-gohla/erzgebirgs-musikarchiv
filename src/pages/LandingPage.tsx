import RightArrowIcon from '@mui/icons-material/ArrowForward';
import MusicIcon from '@mui/icons-material/MusicNote';
import PersonIcon from '@mui/icons-material/Person';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import { Box, Button, Card, CardActions, CardContent, Grid, Stack, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

import { DatabaseSearchField } from '@/components/DatabaseSearchField';
import { LandingLayout } from '@/components/layouts/';
import { Logo } from '@/components/Logo';

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
      <Button component={Link} to={'/songs/'}  size="small" startIcon={<RightArrowIcon />}>Durchsuchen</Button>
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
      <Button component={Link} to={'/authors/'} size="small" startIcon={<RightArrowIcon />}>Durchsuchen</Button>
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
      <Button component={Link} to={'/genres/'} size="small" startIcon={<RightArrowIcon />}>Durchsuchen</Button>
    </CardActions>
  </Card>
);

export const LandingPage: React.FC = () => {
  const theme = useTheme();
  return (
    <LandingLayout>
      <Box sx={{ pt: { md: theme.spacing(4), lg: theme.spacing(8) }, width: '100%', mx: 'auto' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ mb: 2 }} justifyContent="center" alignContent="center" useFlexGap columnGap={4} rowGap={2}>
          <Box>
            <Logo width={150} variant='text-below' />
          </Box>
          <Box>
            <Typography variant="h1">
              Erzgebirgsmusik
            </Typography>
            <Typography variant="h2" sx={{ mb: theme.spacing(2) }}>
              Liederarchiv
            </Typography>
          </Box>
        </Stack>
        <Typography variant="body1" sx={{ mb: theme.spacing(4) }}>
          <strong>Willkommen im Erzgebirgs-Musikarchiv</strong>, einer Sammlung authentischer Melodien, zusammengetragen durch Monika Knauth.<br />
          Über Jahrzehnte hinweg hat sie diese Lieder liebevoll gesammelt und digitalisiert.
          Hier können Sie in die reiche musikalische Geschichte des Erzgebirges eintauchen, von traditionellen Volks- und Bergarbeitsliedern bis hin zu festlichen Weihnachtsklängen.
          Entdecken Sie die Vielfalt dieser einzigartigen Sammlung und lassen Sie sich von den charmanten Klängen dieser Region verzaubern.
          Das Erzgebirgische Liederarchiv lädt Sie ein, die musikalische Seele dieser traditionsreichen Gegend zu erkunden.
          Viel Spaß beim Stöbern und Musizieren!
        </Typography>
        <DatabaseSearchField label="Suchen…" />
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
