import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { applyCurvesCorrection, calculateHistogram, CorrectionPoint, createLUT } from '@utils';
import { Button, Checkbox, Input, message, Modal } from 'antd';
import { Curves } from './components';
import { CurvesModalProps } from './types';

export const CurvesModal: FC<CurvesModalProps> = ({ visible, onClose, imageData, isAlphaChannel, onApply }) => {
  const [point1, setPoint1] = useState<CorrectionPoint>({ input: 0, output: 0 });
  const [point2, setPoint2] = useState<CorrectionPoint>({ input: 255, output: 255 });
  const [previewEnabled, setPreviewEnabled] = useState(false);
  const [previewData, setPreviewData] = useState<ImageData | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);

  // Расчет гистограмм
  const histograms = useMemo(() => {
    if (!imageData) return { r: [], g: [], b: [], alpha: [] };

    return {
      r: calculateHistogram(imageData, 'r'),
      g: calculateHistogram(imageData, 'g'),
      b: calculateHistogram(imageData, 'b'),
      alpha: calculateHistogram(imageData, 'alpha'),
    };
  }, [imageData]);

  // Создание LUT и применение коррекции для предпросмотра
  const applyPreview = useCallback(() => {
    if (!imageData || !previewEnabled) {
      setPreviewData(null);
      return;
    }

    const lut = createLUT(point1, point2);
    const corrected = applyCurvesCorrection(imageData, lut, isAlphaChannel);
    setPreviewData(corrected);
  }, [imageData, point1, point2, previewEnabled, isAlphaChannel]);

  // Обновление предпросмотра при изменении параметров
  useEffect(() => {
    applyPreview();
  }, [applyPreview]);

  // Отображение оригинального изображения на канвасе
  useEffect(() => {
    if (!imageData || !originalCanvasRef.current) return;

    const canvas = originalCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Устанавливаем размеры канваса с ограничением для предпросмотра
    const maxSize = 200;
    const scale = Math.min(maxSize / imageData.width, maxSize / imageData.height);
    canvas.width = imageData.width * scale;
    canvas.height = imageData.height * scale;

    // Создаем временный канвас для оригинальных данных
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = imageData.width;
    tempCanvas.height = imageData.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCtx.putImageData(imageData, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
  }, [imageData]);

  // Отображение скорректированного изображения на канвасе
  useEffect(() => {
    if (!previewData || !previewCanvasRef.current || !previewEnabled) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Устанавливаем такие же размеры как у оригинала
    const maxSize = 200;
    const scale = Math.min(maxSize / previewData.width, maxSize / previewData.height);
    canvas.width = previewData.width * scale;
    canvas.height = previewData.height * scale;

    // Создаем временный канвас для скорректированных данных
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = previewData.width;
    tempCanvas.height = previewData.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCtx.putImageData(previewData, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
  }, [previewData, previewEnabled]);

  // Валидация ввода
  const validateInput = (value: string): number => {
    const num = parseInt(value);
    return isNaN(num) ? 0 : Math.max(0, Math.min(255, num));
  };

  // Обработчики изменения точек
  const handlePoint1Change = (field: 'input' | 'output', value: string) => {
    const validatedValue = validateInput(value);
    setPoint1((prev) => ({ ...prev, [field]: validatedValue }));
  };

  const handlePoint2Change = (field: 'input' | 'output', value: string) => {
    const validatedValue = validateInput(value);
    setPoint2((prev) => ({ ...prev, [field]: validatedValue }));
  };

  // Сброс значений
  const handleReset = () => {
    setPoint1({ input: 0, output: 0 });
    setPoint2({ input: 255, output: 255 });
    setPreviewEnabled(false);
    setPreviewData(null);

    // Очищаем канвас предпросмотра
    if (previewCanvasRef.current) {
      const ctx = previewCanvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, previewCanvasRef.current.width, previewCanvasRef.current.height);
      }
    }
  };

  // Обработка закрытия модального окна
  const handleClose = () => {
    setPreviewEnabled(false);
    setPreviewData(null);
    onClose();
  };

  // Применение коррекции
  const handleApply = () => {
    if (!imageData) {
      message.error('Нет данных изображения для коррекции');
      return;
    }

    const lut = createLUT(point1, point2);
    const corrected = applyCurvesCorrection(imageData, lut, isAlphaChannel);
    onApply(corrected);
    handleClose();
  };

  return (
    <Modal
      title="Градационная коррекция (Кривые)"
      open={visible}
      onCancel={handleClose}
      width={900}
      footer={[
        <Button key="reset" onClick={handleReset}>
          Сброс
        </Button>,
        <Button key="cancel" onClick={handleClose}>
          Отмена
        </Button>,
        <Button key="apply" type="primary" onClick={handleApply}>
          Применить
        </Button>,
      ]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Гистограммы */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {isAlphaChannel ? (
            <div>
              <h4 style={{ textAlign: 'center', margin: '0 0 10px 0' }}>Альфа-канал</h4>
              <Curves histogram={histograms.alpha} color="#666666" point1={point1} point2={point2} />
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <h4 style={{ textAlign: 'center', margin: '0 0 10px 0' }}>RGB Каналы</h4>
              {/* Легенда */}
              <div
                style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '12px' }}
              >
                <span>
                  <span style={{ color: '#ff4d4f' }}>■</span> Красный
                </span>
                <span>
                  <span style={{ color: '#52c41a' }}>■</span> Зеленый
                </span>
                <span>
                  <span style={{ color: '#1890ff' }}>■</span> Синий
                </span>
                <span>
                  <span style={{ color: '#722ed1' }}>■</span> Коррекция
                </span>
              </div>
              <div style={{ position: 'relative', height: '250px' }}>
                <svg
                  width="300"
                  height="250"
                  style={{ position: 'absolute', border: '1px solid #d9d9d9', backgroundColor: '#fafafa' }}
                >
                  {/* Сетка */}
                  <defs>
                    <pattern id="grid" width="30" height="25" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 25" fill="none" stroke="#e0e0e0" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="300" height="250" fill="url(#grid)" />

                  {/* R канал */}
                  <polyline
                    points={histograms.r
                      .map((value, index) => {
                        const x = (index / 255) * 300;
                        const y = 250 - (value / Math.max(...histograms.r)) * 200;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#ff4d4f"
                    strokeWidth="1"
                    opacity="0.7"
                  />

                  {/* G канал */}
                  <polyline
                    points={histograms.g
                      .map((value, index) => {
                        const x = (index / 255) * 300;
                        const y = 250 - (value / Math.max(...histograms.g)) * 200;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#52c41a"
                    strokeWidth="1"
                    opacity="0.7"
                  />

                  {/* B канал */}
                  <polyline
                    points={histograms.b
                      .map((value, index) => {
                        const x = (index / 255) * 300;
                        const y = 250 - (value / Math.max(...histograms.b)) * 200;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#1890ff"
                    strokeWidth="1"
                    opacity="0.7"
                  />

                  {/* Линии коррекции */}
                  {(() => {
                    const point1X = (point1.input / 255) * 300;
                    const point1Y = 250 - (point1.output / 255) * 200;
                    const point2X = (point2.input / 255) * 300;
                    const point2Y = 250 - (point2.output / 255) * 200;

                    return (
                      <>
                        <line
                          x1="0"
                          y1={250 - (point1.output / 255) * 200}
                          x2={point1X}
                          y2={point1Y}
                          stroke="#722ed1"
                          strokeWidth="2"
                        />
                        <line x1={point1X} y1={point1Y} x2={point2X} y2={point2Y} stroke="#722ed1" strokeWidth="2" />
                        <line
                          x1={point2X}
                          y1={point2Y}
                          x2="300"
                          y2={250 - (point2.output / 255) * 200}
                          stroke="#722ed1"
                          strokeWidth="2"
                        />
                        <circle cx={point1X} cy={point1Y} r="4" fill="#722ed1" stroke="#fff" strokeWidth="2" />
                        <circle cx={point2X} cy={point2Y} r="4" fill="#722ed1" stroke="#fff" strokeWidth="2" />
                      </>
                    );
                  })()}

                  {/* Оси */}
                  <text x="150" y="245" textAnchor="middle" fontSize="10" fill="#666">
                    Входные значения (0-255)
                  </text>
                  <text x="10" y="125" fontSize="10" fill="#666" transform="rotate(-90, 10, 125)">
                    Выходные значения
                  </text>
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Поля ввода точек */}
        <div style={{ display: 'flex', gap: '40px', justifyContent: 'center' }}>
          <div>
            <h4>Точка 1</h4>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span>Вход:</span>
              <Input
                type="number"
                min={0}
                max={255}
                value={point1.input}
                onChange={(e) => handlePoint1Change('input', e.target.value)}
                style={{ width: '80px' }}
              />
              <span>Выход:</span>
              <Input
                type="number"
                min={0}
                max={255}
                value={point1.output}
                onChange={(e) => handlePoint1Change('output', e.target.value)}
                style={{ width: '80px' }}
              />
            </div>
          </div>

          <div>
            <h4>Точка 2</h4>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span>Вход:</span>
              <Input
                type="number"
                min={0}
                max={255}
                value={point2.input}
                onChange={(e) => handlePoint2Change('input', e.target.value)}
                style={{ width: '80px' }}
              />
              <span>Выход:</span>
              <Input
                type="number"
                min={0}
                max={255}
                value={point2.output}
                onChange={(e) => handlePoint2Change('output', e.target.value)}
                style={{ width: '80px' }}
              />
            </div>
          </div>
        </div>

        {/* Предпросмотр */}
        <div style={{ textAlign: 'center' }}>
          <Checkbox checked={previewEnabled} onChange={(e) => setPreviewEnabled(e.target.checked)}>
            Включить предпросмотр
          </Checkbox>
        </div>

        {/* Канвас предпросмотра */}
        {imageData && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ margin: '0 0 10px 0' }}>Оригинал</h4>
              <div
                style={{
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  padding: '10px',
                  backgroundColor: '#fafafa',
                  display: 'inline-block',
                }}
              >
                <canvas
                  ref={originalCanvasRef}
                  style={{
                    maxWidth: '200px',
                    maxHeight: '200px',
                    imageRendering: 'pixelated',
                  }}
                />
              </div>
            </div>

            {previewEnabled && (
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>{isAlphaChannel ? 'Коррекция альфа-канала' : 'Коррекция RGB'}</h4>
                <div
                  style={{
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    padding: '10px',
                    backgroundColor: '#fafafa',
                    display: 'inline-block',
                  }}
                >
                  <canvas
                    ref={previewCanvasRef}
                    style={{
                      maxWidth: '200px',
                      maxHeight: '200px',
                      imageRendering: 'pixelated',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
