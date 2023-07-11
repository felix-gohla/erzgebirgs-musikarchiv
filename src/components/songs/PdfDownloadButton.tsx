import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Button, IconButton } from '@mui/material';
import React from 'react';

import { DIRECTUS_BASE_URL } from '@/services/directus';
import { Song } from '@/types';

interface PdfDownloadButtonProps {
    /**
     * The song to create the download button for.
     */
    song: Song,

    /**
     * Whether to only show an icon.
     */
    variant?: 'icon' | 'icon-with-text'
}

export const PdfDownloadButton: React.FC<PdfDownloadButtonProps> = ({ song, variant = 'icon-with-text' }) => {
  const pdfName = song.title.toLowerCase().replaceAll(/[^A-Za-z0-9]/g, '-') + '.pdf';

  const pdf = song.pdf;

  if (!pdf) {
    return null;
  }

  const url = `${DIRECTUS_BASE_URL}/assets/${pdf}?download`;

  if (variant === 'icon-with-text') {
    return (
      <Button
        aria-label='PDF Download'
        color='primary'
        startIcon={<PictureAsPdfIcon />}
        fullWidth
        variant="contained"
        target="_top"
        href={url}
        download={pdfName}
      >
        Noten-Download
      </Button>
    );
  }
  return (
    <IconButton
      aria-label='PDF Download'
      color='primary'
      href={url}
      download={pdfName}
    >
      <PictureAsPdfIcon />
    </IconButton>
  );
};
