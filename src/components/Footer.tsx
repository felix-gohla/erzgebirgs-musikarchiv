import { Box, Container, Link,Paper, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import { Link as RouterLink, To } from 'react-router-dom';

const FooterLink: React.FC<React.PropsWithChildren<{ to: To }>> = ({ to, children }) => (
  <Link component={RouterLink} to={to} sx={{ width: { xs: '100%', sm: 'auto' }, textDecoration: 'none', textAlign: 'center' }}>
    {children}
  </Link>
);

const YearText: React.FC = () => {
  const startYear = 2023;
  const endYear = new Date().getFullYear();
  if (startYear !== endYear) {
    return <Typography component="span">{startYear}&ndash;{endYear}</Typography>;
  }
  return <Typography component="span">{endYear}</Typography>;
};

export const Footer: React.FC = () => {
  const theme = useTheme();

  return (
    <Paper
      component="footer"
      square
      variant="elevation"
      sx={{ width: '100%', minHeight: '128px', py: theme.spacing(3) }}
    >
      <Container maxWidth="xl">
        <Stack spacing={2} sx={{ justifyContent: 'center' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 0, sm: 2 }} sx={{ mx: 'auto', width: '100%', justifyContent: 'center', flexWrap: { sm: 'wrap' }, overflow: 'hidden' }}>
            <FooterLink to="#imprint">Impressum</FooterLink>
            <FooterLink to="#about">Über das Projekt</FooterLink>
            <FooterLink to="#gema">GEMA & Copyright</FooterLink>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }} />
            <Typography variant="body1" sx={{ width: { xs: '100%', sm: 'auto' }, textAlign: 'center' }}>Copyright&nbsp;&copy;&nbsp;<YearText /></Typography>
          </Stack>
          <Box sx={{ width: '100%' }}>
            <Typography sx={{ mx: 'auto', display:'block', width: 'fit-content' }}>
              Erstellt mit&nbsp;<Typography component="span" sx={{ color: 'red' }}>&#x2764;</Typography>&nbsp;durch
              {' '}
              <Link component={RouterLink} to="https://felixgohla.de/" target="_blank">Felix Gohla</Link>
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Paper>
  );
};