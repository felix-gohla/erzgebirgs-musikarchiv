import { Skeleton, Typography } from '@mui/material';
import React from 'react';

import { useGetImage } from '@/hooks';
import { assetUrlFromFileId } from '@/services';

interface DirectusImageProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
    fileId: string;
    thumbnail?: boolean | { height?: number, width?: number, quality?: number }
}

const THUMBNAIL_DEFAULT_SIZE = 128; // pixels
const THUMBNAIL_DEFAULT_QUALITY = 75; // percent

export const DirectusImage: React.FC<DirectusImageProps> = ({ fileId, thumbnail = false, ...rest }) => {
  const { image, isLoading } = useGetImage(fileId);

  let thumbnailHeight: number | undefined;
  let thumbnailWidth: number | undefined;
  let thumbnailQuality: number | undefined;
  if (thumbnail === true) {
    thumbnailHeight = THUMBNAIL_DEFAULT_SIZE;
    thumbnailWidth = THUMBNAIL_DEFAULT_SIZE;
    thumbnailQuality = THUMBNAIL_DEFAULT_QUALITY;
  } else if (typeof thumbnail !== 'boolean') {
    const height = thumbnail.height;
    const width = thumbnail.width;
    if (!height && !width) {
      thumbnailHeight = THUMBNAIL_DEFAULT_SIZE;
      thumbnailWidth = THUMBNAIL_DEFAULT_SIZE;
    } else {
      thumbnailHeight = height;
      thumbnailWidth = width;
    }
    thumbnailQuality = thumbnail.quality || THUMBNAIL_DEFAULT_QUALITY;
  }

  const url = React.useMemo(
    () => assetUrlFromFileId(
      fileId,
      {
        download: false,
        downloadFilename: image?.filenameDownload || '',
        height: thumbnailHeight,
        width: thumbnailWidth,
        quality: thumbnailQuality,
      },
    ),
    [fileId, thumbnailHeight, thumbnailWidth, thumbnailQuality, image?.filenameDownload],
  );

  if (isLoading) {
    return (
      <Skeleton variant="rounded" width="100%" height="100%" />
    );
  }

  if (!image) {
    return (<Typography variant='caption'>Bild konnte nicht geladen werden.</Typography>);
  }

  return (
    <img
      src={url.toString()}
      alt={image.description || image.title}
      {...rest}
    />
  );
};
