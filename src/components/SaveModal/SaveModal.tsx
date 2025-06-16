import { useApp } from '@hooks';
import { saveAsGB7, saveAsJPEG, saveAsPNG } from '@utils';
import { Button, Input, message, Modal, Select, Space } from 'antd';
import { useState } from 'react';

const { Option } = Select;

export const SaveModal = () => {
  const { isOpenSaveModal, closeSaveModal, layers, activeLayerId } = useApp();

  const activeLayer = layers[layers.findIndex((layer) => layer.id === activeLayerId)] ?? {
    imageData: null,
  };

  const { imageData } = activeLayer;

  const [fileFormat, setFileFormat] = useState<string>('png');
  const [fileName, setFileName] = useState<string>('image');
  const [jpegQuality, setJpegQuality] = useState<number>(0.92);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSave = async () => {
    if (!imageData) {
      message.error('No image data available');
      return;
    }

    setLoading(true);

    try {
      switch (fileFormat) {
        case 'gb7':
          await saveAsGB7(imageData, fileName);
          break;
        case 'png':
          await saveAsPNG(imageData, fileName);
          break;
        case 'jpeg':
          await saveAsJPEG(imageData, fileName, jpegQuality);
          break;
        default:
          message.error('Unsupported file format');
          return;
      }

      closeSaveModal();
    } catch (error) {
      message.error('Error saving file:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    closeSaveModal();
  };

  return (
    <Modal title="Сохранить изображение" open={isOpenSaveModal} onCancel={handleCancel} footer={null} width={400}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <label>Имя файла:</label>
          <Input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Введите имя файла"
            style={{ marginTop: 8 }}
          />
        </div>

        <div>
          <label>Формат файла:</label>
          <Select value={fileFormat} onChange={setFileFormat} style={{ width: '100%', marginTop: 8 }}>
            <Option value="png">PNG (с прозрачностью)</Option>
            <Option value="jpeg">JPEG (без прозрачности)</Option>
            <Option value="gb7">GB7 (кастомный формат)</Option>
          </Select>
        </div>

        {fileFormat === 'jpeg' && (
          <div>
            <label>Качество JPEG:</label>
            <Select value={jpegQuality} onChange={setJpegQuality} style={{ width: '100%', marginTop: 8 }}>
              <Option value={0.9}>Высокое (90%)</Option>
              <Option value={0.8}>Среднее (80%)</Option>
              <Option value={0.7}>Низкое (70%)</Option>
              <Option value={0.92}>По умолчанию (92%)</Option>
            </Select>
          </div>
        )}

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={handleCancel}>Отмена</Button>
          <Button type="primary" onClick={handleSave} loading={loading} disabled={!fileName.trim() || !imageData}>
            Сохранить
          </Button>
        </div>
      </Space>
    </Modal>
  );
};
