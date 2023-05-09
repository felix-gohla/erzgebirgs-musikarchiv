import React from 'react';

import { Image } from '@/services';
import { getImage } from '@/services/directus';

export const useGetImage = (imageId: string) => {
  const [file, setFile] = React.useState<Image | null>(null);

  React.useEffect(() => {
    let active = true;

    (async () => {
      const image = await getImage(imageId);
      if (active) {
        setFile(image);
      }
    })();

    return () => {
      active = false;
    };
  }, [imageId]);

  return file;
};