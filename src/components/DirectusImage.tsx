import { Skeleton, Typography } from '@mui/material';
import React from 'react';

import { useGetImage } from '@/hooks';
import { assetUrlFromFileId } from '@/services';

interface DirectusImageProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
    fileId: string;
}

export const DirectusImage: React.FC<DirectusImageProps> = (props) => {
  const { fileId, ...rest } = props;

  const { image, isLoading } = useGetImage(fileId);

  const url = React.useMemo(
    () => assetUrlFromFileId(fileId, { download: true, downloadFilename: image?.filenameDownload || '' }),
    [fileId, image?.filenameDownload],
  );

  if (isLoading) {
    return (
      <Skeleton variant="rounded" width="100%" height="100%" />
    );
  }

  if (!image) {
    return (<Typography>Bild konnte nicht geladen werden.</Typography>);
  }

  return (
    <img
      src={url.toString()}
      alt={image.description || image.title}
      {...rest}
    />
  );
};
