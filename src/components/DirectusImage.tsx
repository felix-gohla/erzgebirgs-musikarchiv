import { Typography } from '@mui/material';
import React from 'react';

import { useGetImage } from '@/hooks';
import { DIRECTUS_BASE_URL } from '@/services/directus';

interface DirectusImageProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
    fileId: string;
}

export const DirectusImage: React.FC<DirectusImageProps> = (props) => {
  const { fileId, ...rest } = props;

  const image = useGetImage(fileId);

  if (!image) {
    return (<Typography>Bild konnte nicht geladen werden.</Typography>);
  }

  return (
    <img
      src={`${DIRECTUS_BASE_URL}/assets/${fileId}/${image.filenameDownload}`}
      alt={image.description || image.title}
      {...rest}
    />
  );
};
