import { type UploadProps, message } from 'antd';
import { FC, PropsWithChildren, useCallback, useContext, useMemo, useRef, useState } from 'react';

import { ImageMetadata } from '@types';
import { bilinearInterpolation, decoderGB7, getFileType, hasAlphaChannel, nearestNeighborInterpolation } from '@utils';

import { appContext } from './context';
import { ResizeParams } from './types';

const { Provider } = appContext;

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [metadata, setMetadata] = useState<ImageMetadata>({} as ImageMetadata);

  const [autoScaled, setAutoScaled] = useState(false);

  const [scale, setScale] = useState(100);

  const [isOpenModal, setIsOpenModal] = useState(false);

  const onFileSelect: UploadProps['customRequest'] = useCallback(({ file }) => {
    if (!(file instanceof File) || !file) {
      return message.error('Ошибка чтения файла!');
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      if (!canvasRef.current) {
        return message.error('Ошибка загрузки приложения!');
      }
      if (!reader.result) return;

      const buffer = e.target?.result as ArrayBuffer;
      const fileType = getFileType(buffer);

      const canvas = canvasRef.current;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      let imageData: ImageData;

      switch (fileType) {
        case 'gb7':
          const decoded = decoderGB7(buffer);
          const colorDepth = 7 + (decoded.hasMask ? 1 : 0);
          const hasAlpha = decoded.hasMask;

          canvas.width = decoded.width;
          canvas.height = decoded.height;

          imageData = new ImageData(decoded.pixels, decoded.width, decoded.height);

          ctx.putImageData(imageData, 0, 0);

          setMetadata((prevState) => ({
            ...prevState,
            width: decoded.width,
            height: decoded.height,
            colorDepth: colorDepth,
            hasMask: hasAlpha,
            format: 'gb7',
            imageData: imageData,
          }));
          break;

        case 'jpg':
        case 'png':
          const imgUrl = URL.createObjectURL(file);
          const img = new Image();

          img.onload = () => {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            const hasAlpha = fileType === 'png' && hasAlphaChannel(imageData);
            const colorDepth = fileType === 'png' ? (hasAlpha ? 32 : 24) : 24;

            setMetadata((prevState) => ({
              ...prevState,
              width: img.naturalWidth,
              height: img.naturalHeight,
              colorDepth: colorDepth,
              hasMask: hasAlpha,
              format: fileType,
              imageData: imageData,
            }));

            URL.revokeObjectURL(imgUrl);
          };

          img.onerror = (err) => {
            console.error('Ошибка при загрузке изображения:', err);
            URL.revokeObjectURL(imgUrl);
          };

          img.src = imgUrl;
          break;

        default:
          message.error(`Неподдерживаемый тип файла: ${fileType}`);
      }
    };

    reader.onerror = () => {
      message.error('Ошибка чтения файла!');
    };

    reader.readAsArrayBuffer(file);
  }, []);

  const onScaleChange = useCallback((value: number) => {
    setScale(value);
  }, []);

  const openModal = useCallback(() => {
    setIsOpenModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  const handleResize = async ({ width, height, method }: ResizeParams) => {
    if (!metadata.imageData) return;

    const resizedData =
      method === 'nearest'
        ? await nearestNeighborInterpolation(metadata.imageData, width, height)
        : await bilinearInterpolation(metadata.imageData, width, height);

    const newImageData = new ImageData(resizedData.data, resizedData.width, resizedData.height);

    setMetadata((prevState) => ({
      ...prevState,
      height: newImageData.height,
      width: newImageData.width,
      imageData: newImageData,
    }));
  };

  const providerValue = useMemo(
    () => ({
      metadata,
      setMetadata,
      onFileSelect,
      canvasRef,
      scale,
      setScale,
      autoScaled,
      setAutoScaled,
      onScaleChange,
      openModal,
      closeModal,
      handleResize,
      isOpenModal,
    }),
    [
      onFileSelect,
      onScaleChange,
      openModal,
      closeModal,
      isOpenModal,
      handleResize,
      metadata,
      setMetadata,
      scale,
      setScale,
      autoScaled,
      setAutoScaled,
    ],
  );

  return <Provider value={providerValue}>{children}</Provider>;
};

export const useApp = () => useContext(appContext);
