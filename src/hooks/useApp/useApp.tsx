import { type UploadProps, message } from 'antd';
import { FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { bilinearInterpolation, decoderGB7, getFileType, hasAlphaChannel, nearestNeighborInterpolation } from '@utils';

import { useTools } from '@hooks';
import { appContext } from './context';
import { Layer, PipetteColors, ResizeParams } from './types';

const { Provider } = appContext;

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [autoScaled, setAutoScaled] = useState(true);
  const [scale, setScale] = useState(100);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [pipetteColors, setPipetteColors] = useState<PipetteColors>({} as PipetteColors);
  const { activeTool, setActiveTool } = useTools();

  // Состояние для слоев и альфа-каналов
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string>('');

  // Обработчик загрузки изображения для нового слоя
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

          addLayer('image', imageData, {
            format: 'gb7',
            colorDepth: colorDepth,
          });

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

            addLayer('image', imageData, {
              format: fileType,
              colorDepth: colorDepth,
            });

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

  // Добавление нового слоя
  const addLayer = useCallback(
    (type: 'image' | 'color', data: ImageData, options: Pick<Layer, 'format' | 'colorDepth' | 'color'>) => {
      setLayers((prevLayers) => {
        if (prevLayers.length >= 2) {
          message.error('Максимум 2 слоя!');
          return prevLayers;
        }

        const hasAlpha = data ? hasAlphaChannel(data) : false;

        const newLayer: Layer = {
          id: uuidv4(),
          name: `Слой ${prevLayers.length + 1}`,
          visible: true,
          opacity: 100,
          blendMode: 'normal',
          imageData: data,
          offsetX: 0,
          offsetY: 0,
          hasAlpha,
          alphaVisible: hasAlpha,
          ...options,
        };

        setActiveLayerId(newLayer.id);
        return [...prevLayers, newLayer];
      });
    },
    [],
  );

  // Обновление координат слоя
  const updateLayerOffset = useCallback((id: string, offsetX: number, offsetY: number) => {
    setLayers((prevLayers) => prevLayers.map((layer) => (layer.id === id ? { ...layer, offsetX, offsetY } : layer)));
  }, []);

  // Изменение порядка слоев
  const moveLayer = useCallback(
    (fromIndex: number, toIndex: number) => {
      const newLayers = [...layers];
      const [movedLayer] = newLayers.splice(fromIndex, 1);
      newLayers.splice(toIndex, 0, movedLayer);
      setLayers(newLayers);
    },
    [layers],
  );

  // Переключение видимости слоя
  const toggleLayerVisibility = useCallback(
    (id: string) => {
      setLayers(layers.map((layer) => (layer.id === id ? { ...layer, visible: !layer.visible } : layer)));
    },
    [layers],
  );

  // Удаление слоя
  const deleteLayer = useCallback(
    (id: string) => {
      if (layers.length <= 1) {
        message.error('Нельзя удалить последний слой!');
        return;
      }

      setLayers((prevState) => prevState.filter((layer) => layer.id !== id));
      setActiveLayerId(layers[0].id);
    },
    [layers],
  );

  // Изменение прозрачности слоя
  const updateLayerOpacity = useCallback(
    (id: string, value: number) => {
      setLayers(layers.map((layer) => (layer.id === id ? { ...layer, opacity: value } : layer)));
    },
    [layers],
  );

  // Изменение режима наложения
  const updateLayerBlendMode = useCallback(
    (id: string, value: Layer['blendMode']) => {
      setLayers(layers.map((layer) => (layer.id === id ? { ...layer, blendMode: value } : layer)));
    },
    [layers],
  );

  // Переключение видимости альфа-канала
  const toggleAlphaChannelVisibility = useCallback((id: string) => {
    setLayers((prevState) =>
      prevState.map((layer) => {
        if (layer.id !== id) return layer;
        layer.alphaVisible = !layer.alphaVisible;
        return layer;
      }),
    );
  }, []);

  console.log(layers);

  // Удаление альфа-канала
  const deleteAlphaChannel = useCallback((id: string) => {
    setLayers((prevState) =>
      prevState.map((layer) => {
        if (layer.id !== id) return layer;
        layer.alphaVisible = false;
        layer.hasAlpha = false;
        return layer;
      }),
    );
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

  const applyCurvesCorrection = useCallback(
    (correctedData: ImageData) => {
      if (!activeLayerId) {
        message.error('Не выбран активный слой!');
        return;
      }

      setLayers((prevLayers) =>
        prevLayers.map((layer) => (layer.id === activeLayerId ? { ...layer, imageData: correctedData } : layer)),
      );

      message.success('Коррекция кривых применена успешно!');
    },
    [activeLayerId, setLayers],
  );

  const handleResize = async ({ width, height, method }: ResizeParams) => {
    const activeLayer = layers.find((layer) => layer.id === activeLayerId);

    if (!activeLayer?.imageData) {
      message.error('Не найден активный слой с изображением!');
      return;
    }

    const resizedData =
      method === 'nearest'
        ? await nearestNeighborInterpolation(activeLayer.imageData, width, height)
        : await bilinearInterpolation(activeLayer.imageData, width, height);

    const newImageData = new ImageData(resizedData.data, resizedData.width, resizedData.height);

    setLayers((prevState) =>
      prevState.map((layer) => {
        if (layer.id !== activeLayerId) return layer;

        return {
          ...layer,
          imageData: newImageData,
        };
      }),
    );
  };

  useEffect(() => {
    setAutoScaled(true);
    setScale(100);
  }, []);

  const providerValue = useMemo(
    () => ({
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
      activeTool,
      setActiveTool,
      setPipetteColors,
      pipetteColors,
      layers,
      setLayers,
      activeLayerId,
      setActiveLayerId,
      addLayer,
      moveLayer,
      toggleLayerVisibility,
      deleteLayer,
      updateLayerOpacity,
      updateLayerBlendMode,
      applyCurvesCorrection,
      toggleAlphaChannelVisibility,
      deleteAlphaChannel,
      updateLayerOffset,
    }),
    [
      onFileSelect,
      onScaleChange,
      openModal,
      closeModal,
      isOpenModal,
      handleResize,
      scale,
      setScale,
      autoScaled,
      setAutoScaled,
      activeTool,
      setActiveTool,
      setPipetteColors,
      pipetteColors,
      layers,
      setLayers,
      activeLayerId,
      setActiveLayerId,
      addLayer,
      moveLayer,
      toggleLayerVisibility,
      deleteLayer,
      updateLayerOpacity,
      updateLayerBlendMode,
      applyCurvesCorrection,
      toggleAlphaChannelVisibility,
      deleteAlphaChannel,
      updateLayerOffset,
    ],
  );

  return <Provider value={providerValue}>{children}</Provider>;
};

export const useApp = () => useContext(appContext);
