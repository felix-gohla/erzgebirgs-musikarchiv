import AudioFileIcon from '@mui/icons-material/AudioFile';
import { Button, IconButton } from '@mui/material';
import React from 'react';

import { DIRECTUS_BASE_URL } from '@/services/directus';
import { Song } from '@/types';

interface AudioDownloadButtonProps {
    /**
     * The song to create the download button for.
     */
    song: Song,

    /**
     * Whether to only show an icon.
     */
    variant?: 'icon' | 'icon-with-text'
}

export const AudioDownloadButton: React.FC<AudioDownloadButtonProps> = ({ song, variant = 'icon-with-text' }) => {
  const audio = song.audio;

  if (!audio) {
    return null;
  }

  const url = `${DIRECTUS_BASE_URL}/assets/${audio}?download`;

  if (variant === 'icon-with-text') {
    return (
      <Button
        aria-label='Audio-Download'
        color='primary'
        startIcon={<AudioFileIcon />}
        fullWidth
        variant="contained"
        target="_top"
        href={url}
      >
        Audio-Download
      </Button>
    );
  }
  return (
    <IconButton
      aria-label='Audio-Download'
      color='primary'
      href={url}
    >
      <AudioFileIcon />
    </IconButton>
  );
};
