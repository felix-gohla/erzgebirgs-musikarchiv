import { Box, Container, Link,Paper, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import { Link as RouterLink, To } from 'react-router-dom';

import { useGetStaticPages } from '@/hooks/staticPages';

const FooterLink: React.FC<React.PropsWithChildren<{ to: To }>> = ({ to, children }) => (
  <Link component={RouterLink} to={to} sx={{ width: { xs: '100%', sm: 'auto' }, textDecoration: 'none', textAlign: 'center' }}>
    {children}
  </Link>
);

const YearText: React.FC = () => {
  const startYear = 2023;
  const endYear = new Date().getFullYear();
  if (startYear !== endYear) {
    return <span>{startYear}&ndash;{endYear}</span>;
  }
  return <span>{endYear}</span>;
};

export const Footer: React.FC = () => {
  const theme = useTheme();

  const staticPages = useGetStaticPages();

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
            {
              staticPages.data && staticPages.data.map((page) => <FooterLink key={page.id} to={`/static_page/${page.id}`}>{page.title}</FooterLink>)
            }
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }} />
          </Stack>
          <Box sx={{ width: '100%' }} display="flex" justifyContent='center' gap={1}>
            <Typography variant="body2" sx={{ textAlign: 'center', alignSelf: 'center' }}>
              Copyright&nbsp;&copy;&nbsp;<YearText />
            </Typography>
            <Typography sx={{ width: 'fit-content', alignSelf: 'center' }} variant='body2'>|</Typography>
            <Typography sx={{ width: 'fit-content', alignSelf: 'center' }} variant='body2'>
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