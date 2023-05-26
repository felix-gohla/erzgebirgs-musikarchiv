import React from 'react';

import { File, getFile,getImage, Image } from '@/services';

export const useGetImage = (imageId: string) => {
  const [image, setImage] = React.useState<Image | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    let active = true;
    setIsLoading(true);

    (async () => {
      const image = await getImage(imageId);
      if (active) {
        setImage(image);
        setIsLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [imageId]);

  return {
    image,
    isLoading,
  };
};


export const useGetFile = (fileId: string) => {
  const [file, setFile] = React.useState<File | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    let active = true;
    setIsLoading(true);

    (async () => {
      const file = await getFile(fileId);
      if (active) {
        setFile(file);
        setIsLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [fileId]);

  return {
    file,
    isLoading,
  };
};
