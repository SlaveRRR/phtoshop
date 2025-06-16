import { Button, Checkbox, Col, InputNumber, message, Modal, Row, Select } from 'antd';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { KERNEL_PRESETS } from './constants';
import { KernelModalProps } from './types';

export const KernelModal: FC<KernelModalProps> = ({ visible, onClose, onApply, activeLayer }) => {
  const [kernel, setKernel] = useState([0, 0, 0, 0, 1, 0, 0, 0, 0]);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState(0);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const kernelSum = useMemo(() => {
    return kernel.reduce((sum, val) => sum + val, 0);
  }, [kernel]);

  useEffect(() => {
    if (preview && activeLayer?.imageData) {
      updatePreview();
    }
  }, [kernel, scale, offset, preview, activeLayer]);

  const handlePresetChange = (value: string) => {
    const preset = KERNEL_PRESETS.find((p) => p.name === value);
    if (preset) {
      setKernel(preset.values);
      setScale(preset.scale);
    }
  };

  const handleKernelValueChange = (index: number, value: number | null) => {
    const newKernel = [...kernel];
    newKernel[index] = value || 0;
    setKernel(newKernel);
  };

  const handleScaleChange = (value: number | null) => {
    const newScale = value || 1;
    setScale(newScale);
  };

  const handleOffsetChange = (value: number | null) => {
    setOffset(value || 0);
  };

  const drawPreview = (imageData: ImageData) => {
    if (!previewCanvasRef.current) return;
    const ctx = previewCanvasRef.current.getContext('2d');
    if (!ctx) return;

    previewCanvasRef.current.width = imageData.width;
    previewCanvasRef.current.height = imageData.height;
    ctx.putImageData(imageData, 0, 0);
  };

  const updatePreview = async () => {
    if (!preview || !activeLayer?.imageData) return;

    setLoading(true);

    try {
      // Проверяем, что imageData корректно
      if (!activeLayer.imageData.data || activeLayer.imageData.data.length === 0) {
        throw new Error('Invalid image data');
      }

      const imageDataCopy = new ImageData(
        new Uint8ClampedArray(activeLayer.imageData.data),
        activeLayer.imageData.width,
        activeLayer.imageData.height,
      );

      const { applyKernel } = await import('../../utils');

      const result = applyKernel(imageDataCopy, kernel, scale, offset);
      drawPreview(result);
    } catch (error) {
      message.error('Filter error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewChange = (e: any) => {
    setPreview(e.target.checked);
  };

  const handleReset = () => {
    setKernel([0, 0, 0, 0, 1, 0, 0, 0, 0]);
    setScale(1);
    setOffset(0);
    setPreview(false);
  };

  const handleApply = async () => {
    if (!activeLayer?.imageData) {
      message.error('No active layer or image data available');
      return;
    }

    if (kernel.length !== 9) {
      message.error('Kernel must have exactly 9 values');
      return;
    }

    if (scale === 0) {
      message.error('Scale cannot be zero');
      return;
    }

    const imageDataCopy = new ImageData(
      new Uint8ClampedArray(activeLayer.imageData.data),
      activeLayer.imageData.width,
      activeLayer.imageData.height,
    );
    const { applyKernel } = await import('../../utils');

    const result = applyKernel(imageDataCopy, kernel, scale, offset);
    onApply(result);

    onClose();
  };

  return (
    <Modal
      title="Фильтрация с использованием ядра"
      open={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="back" onClick={onClose}>
          Закрыть
        </Button>,
        <Button key="reset" onClick={handleReset}>
          Сбросить
        </Button>,
        <Button key="apply" type="primary" onClick={handleApply} disabled={loading || !activeLayer?.imageData}>
          Применить
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <Select
          style={{ width: '100%' }}
          placeholder="Выберите преднастроенное ядро"
          options={KERNEL_PRESETS.map((p) => ({ label: p.name, value: p.name }))}
          onChange={handlePresetChange}
          allowClear
        />
      </div>

      <Row gutter={16}>
        <Col span={12}>
          <div style={{ marginBottom: 16 }}>
            <h4>Матрица ядра 3×3:</h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 8,
                maxWidth: 200,
              }}
            >
              {kernel.map((value, index) => (
                <InputNumber
                  key={index}
                  value={value}
                  onChange={(val) => handleKernelValueChange(index, val)}
                  style={{ width: '100%' }}
                  step={0.1}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            <div>
              <label>Масштаб (Scale):</label>
              <InputNumber
                value={scale}
                onChange={handleScaleChange}
                min={0.1}
                step={0.1}
                style={{ width: '100%', marginTop: 4 }}
              />
            </div>

            <div>
              <label>Смещение (Offset):</label>
              <InputNumber
                value={offset}
                onChange={handleOffsetChange}
                step={1}
                style={{ width: '100%', marginTop: 4 }}
              />
            </div>

            <Checkbox checked={preview} onChange={handlePreviewChange}>
              Предпросмотр
            </Checkbox>
          </div>

          <div
            style={{
              padding: 12,
              backgroundColor: '#f5f5f5',
              borderRadius: 4,
              fontSize: '12px',
            }}
          >
            <p>
              <strong>Сумма ядра:</strong> {kernelSum}
            </p>
            <p>
              <strong>Нормализация:</strong> {scale}
            </p>
            <p>
              <strong>Смещение:</strong> {offset}
            </p>
          </div>
        </Col>

        <Col span={12}>
          {preview ? (
            <div>
              <h4>Предпросмотр:</h4>
              {loading && <div>Обработка...</div>}
              <canvas
                ref={previewCanvasRef}
                style={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  border: '1px solid #d9d9d9',
                  marginTop: 8,
                }}
              />
              {activeLayer?.imageData && (
                <p style={{ textAlign: 'center', marginTop: 8, fontSize: '12px' }}>
                  {activeLayer.imageData.width} × {activeLayer.imageData.height} px
                </p>
              )}
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
                color: 'rgba(0, 0, 0, 0.25)',
                border: '1px dashed #d9d9d9',
                borderRadius: 2,
              }}
            >
              Включите предпросмотр для просмотра результата
            </div>
          )}
        </Col>
      </Row>
    </Modal>
  );
};
