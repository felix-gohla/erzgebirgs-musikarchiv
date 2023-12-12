import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';

import { Loader, MainLayout } from '@/components';
import { useGetStaticPageById } from '@/hooks/staticPages';
import { DOMPurify } from '@/utils';

export const StaticPagePage: React.FC = () => {
  const { id: staticPageId } = useParams();

  const parsedStaticPageId = parseInt(staticPageId || '1');

  const theme = useTheme();

  const { data: staticPage, isLoading: isLoadingPage } = useGetStaticPageById(parsedStaticPageId, !!staticPageId);

  const isLoading = isLoadingPage;

  if (!staticPageId) {
    return (
      <MainLayout>
        <Typography variant="h1">Seite nicht gefunden.</Typography>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <Loader text="Lade Seite..." />
      </MainLayout>
    );
  }

  if (!staticPage) {
    return (
      <MainLayout>
        <Typography variant="h1" sx={{ color: theme.palette.error.main }}>Seite konnte nicht geladen werden.</Typography>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Typography variant='h1' sx={{ mb: theme.spacing(2) }}>
        { staticPage.title }
      </Typography>

      <Box>
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(staticPage.content) }} />
      </Box>
    </MainLayout>
  );
};
