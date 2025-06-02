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

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, img.width, img.height);

      if (imageData.data.length !== img.width * img.height * 4) {
        console.error('Invalid image data length');
        return;
      }

      setMetadata((prevState) => ({
        ...prevState,
        width: img.width,
        height: img.height,
        colorDepth: 24,
        format: file.type.split('/')[1].toUpperCase(),
        imageData: Array.from(imageData.data),
      }));
    };

    img.onerror = (error) => {
      console.error('Error loading image:', error);
    };

    img.src = e.target?.result as string;
  };

  reader.onerror = (error) => {
    console.error('Error reading file:', error);
  };

  reader.readAsDataURL(file);
};
