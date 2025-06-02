import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';

import { useApp } from '@hooks';

export const Uploader = () => {
  const { onFileSelect } = useApp();

  return (
    <Upload showUploadList={false} customRequest={onFileSelect}>
      <Button iconPosition="end" icon={<UploadOutlined />}>
        Файл
      </Button>
    </Upload>
  );
};
