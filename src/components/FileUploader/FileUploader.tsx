import { UploadOutlined } from '@ant-design/icons';
import { grayBitDecoder, isGrayBitFormat } from '@utils';
import { type UploadProps, message, Upload } from 'antd';
import { PIXEL_DATA_OFFSET } from './constants';
import { Card, Text } from './styled';
import { FileUploaderProps } from './types';

export const FileUploader = ({ setMetadata, canvasRef }: FileUploaderProps) => {
  const loadStandardImage = (file: File) => {
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

        setMetadata({
          width: img.width,
          height: img.height,
          colorDepth: 24,
          format: file.type.split('/')[1].toUpperCase(),
        });
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  };

  // Render GrayBit-7 image on canvas
  const renderGrayBit7Image = (buffer: ArrayBuffer) => {
    if (!canvasRef?.current) return;

    try {
      const metadata = grayBitDecoder(buffer);
      setMetadata(metadata);

      const canvas = canvasRef.current;
      canvas.width = metadata.width;
      canvas.height = metadata.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const imageData = ctx.createImageData(metadata.width, metadata.height);
      const dataView = new DataView(buffer);

      for (let i = 0; i < metadata.width * metadata.height; i++) {
        const pixelByte = dataView.getUint8(PIXEL_DATA_OFFSET + i);

        // Extract 7-bit grayscale value (bits 0-6)
        const grayValue = pixelByte & 0x7f;

        // Scale to 8-bit (0-255) by multiplying by 2
        const scaledGrayValue = grayValue * 2;

        // извлекаем маску, если есть
        const alpha = metadata.hasMask ? (pixelByte & 0x80 ? 255 : 0) : 255;

        const idx = i * 4;
        imageData.data[idx] = scaledGrayValue; // R
        imageData.data[idx + 1] = scaledGrayValue; // G
        imageData.data[idx + 2] = scaledGrayValue; // B
        imageData.data[idx + 3] = alpha; // A
      }

      ctx.putImageData(imageData, 0, 0);
    } catch (error) {
      console.error('Error rendering GrayBit-7 image:', error);
      message.error('Failed to render GrayBit-7 image: ' + (error as Error).message);
    }
  };

  const handleFileUpload: UploadProps['customRequest'] = ({ file }) => {
    if (!(file instanceof File)) {
      message.error('Invalid file object');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;

      const view = new DataView(buffer);
      if (isGrayBitFormat(view)) {
        renderGrayBit7Image(buffer);
      } else {
        loadStandardImage(file);
      }
    };

    reader.onerror = () => {
      message.error('Error reading file');
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <Card title="Upload an Image">
      <Upload.Dragger accept=".png,.jpg,.jpeg,.gb7" showUploadList={false} customRequest={handleFileUpload}>
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>

        <Text>Click or drag an image to this area to upload</Text>
        <Text>Supports PNG, JPG, and GrayBit-7 formats</Text>
      </Upload.Dragger>
    </Card>
  );
};
