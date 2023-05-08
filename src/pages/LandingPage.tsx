import { Box, Button, Card, CardActions, CardContent, Container, Grid, Typography, useTheme } from '@mui/material'
import { LandingLayout } from '../components'
import { SearchField } from '../components/SearchField'

export const LandingPage: React.FC = () => {
  const theme = useTheme();
  const bull = (
    <Box
      component="span"
      sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
      •
    </Box>
  );

  const TestCard: React.FC = () => (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Word of the Day
        </Typography>
        <Typography variant="h5" component="div">
          be{bull}nev{bull}o{bull}lent
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          adjective
        </Typography>
        <Typography variant="body2">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  )

  return (
    <LandingLayout>
      <Container>
        <Box sx={{ pt: theme.spacing(16), width: '100%', mx: 'auto' }}>
          <SearchField />
        </Box>
        <Box sx={{ mt: theme.spacing(4) }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TestCard />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TestCard />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TestCard />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TestCard />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </LandingLayout>
  )
}
