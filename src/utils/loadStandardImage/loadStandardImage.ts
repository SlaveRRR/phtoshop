import { Dispatch, RefObject, SetStateAction } from 'react';

import { ImageMetadata } from '@types';

export const loadStandardImage = (
  setMetadata: Dispatch<SetStateAction<ImageMetadata>>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  file: File,
) => {
  const reader = new FileReader();

  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      if (!canvasRef?.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      setMetadata((prevState) => ({
        ...prevState,
        width: img.width,
        height: img.height,
        colorDepth: 24,
        format: file.type.split('/')[1].toUpperCase(),
      }));
    };

    img.src = e.target?.result as string;
  };

  reader.readAsDataURL(file);
};
