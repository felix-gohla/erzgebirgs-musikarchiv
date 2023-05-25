import React from 'react';

import { File, getFile,getImage, Image } from '@/services';

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


export const useGetFile = (fileId: string) => {
  const [file, setFile] = React.useState<File | null>(null);

  React.useEffect(() => {
    let active = true;

    (async () => {
      const file = await getFile(fileId);
      if (active) {
        setFile(file);
      }
    })();

    return () => {
      active = false;
    };
  }, [fileId]);

  return file;
};
