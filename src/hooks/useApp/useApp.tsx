import { type UploadProps, message } from 'antd';
import { FC, PropsWithChildren, useCallback, useContext, useMemo, useRef, useState } from 'react';

import { ImageMetadata } from '@types';
import { getGrayBitImage, isGrayBitFormat, loadStandardImage } from '@utils';

import { appContext } from './context';

const { Provider } = appContext;

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [metadata, setMetadata] = useState<ImageMetadata>({} as ImageMetadata);

  const onFileSelect: UploadProps['customRequest'] = useCallback(({ file }) => {
    if (!(file instanceof File)) {
      message.error('Ошибка чтения файла!');
      return;
    }
    const reader = new FileReader();

    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      const view = new DataView(buffer);
      if (isGrayBitFormat(view)) {
        getGrayBitImage(setMetadata, canvasRef, buffer);
      } else {
        loadStandardImage(setMetadata, canvasRef, file);
      }
    };

    reader.onerror = () => {
      message.error('Ошибка чтения файла!');
    };

    reader.readAsArrayBuffer(file);
  }, []);

  const providerValue = useMemo(
    () => ({
      metadata,
      setMetadata,
      onFileSelect,
      canvasRef,
    }),
    [onFileSelect, metadata, setMetadata],
  );

  return <Provider value={providerValue}>{children}</Provider>;
};

export const useApp = () => useContext(appContext);
