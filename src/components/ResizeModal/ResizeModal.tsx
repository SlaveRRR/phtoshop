import { useApp } from '@hooks';
import { InterpolationMethod } from '@utils';
import { Checkbox, Form, InputNumber, Select, Space, Typography } from 'antd';
import { useEffect, useMemo } from 'react';
import { interpolationDescriptions } from './constants';
import { Modal } from './styled';
import { FormValues } from './types';

export const ResizeModal = () => {
  const { isOpenModal, handleResize, closeModal, layers, activeLayerId } = useApp();

  const activeLayer = layers[layers.findIndex((layer) => layer.id === activeLayerId)] ?? {
    imageData: { height: 0, width: 0 },
  };
  console.log(activeLayer);

  const {
    imageData: { height: originalHeight, width: originalWidth },
  } = activeLayer;

  const [form] = Form.useForm<FormValues>();
  const aspectRatio = originalWidth / originalHeight;

  const formValues = Form.useWatch([], form);

  const handleWidthChange = (value: number | null) => {
    if (!value) return;

    const maintainAspectRatio = form.getFieldValue('maintainAspectRatio');

    if (maintainAspectRatio) {
      const newHeight = Math.round(value / aspectRatio);
      form.setFieldValue('height', newHeight);
    }
  };

  const handleHeightChange = (value: number | null) => {
    if (!value) return;

    const maintainAspectRatio = form.getFieldValue('maintainAspectRatio');

    if (maintainAspectRatio) {
      const newWidth = Math.round(value * aspectRatio);
      form.setFieldValue('width', newWidth);
    }
  };

  const handleSubmit = (values: FormValues) => {
    let finalWidth = values.width;
    let finalHeight = values.height;

    if (values.unit === 'percent') {
      finalWidth = Math.round((originalWidth * values.width) / 100);
      finalHeight = Math.round((originalHeight * values.height) / 100);
    }

    handleResize({
      width: finalWidth,
      height: finalHeight,
      method: values.method,
    });
    closeModal();
  };

  const getImageSize = () => {
    const values = form.getFieldsValue();
    const width = values.width || originalWidth;
    const height = values.height || originalHeight;

    if (values.unit === 'percent') {
      return {
        width: Math.round((originalWidth * width) / 100),
        height: Math.round((originalHeight * height) / 100),
        megapixels: ((((originalWidth * width) / 100) * ((originalHeight * height) / 100)) / 1000000).toFixed(2),
      };
    }

    return {
      width,
      height,
      megapixels: ((width * height) / 1000000).toFixed(2),
    };
  };

  const newSize = useMemo(() => getImageSize(), [formValues]);
  const originalMegapixels = ((originalWidth * originalHeight) / 1000000).toFixed(2);

  useEffect(() => {
    if (isOpenModal) {
      form.setFieldsValue({
        width: originalWidth,
        height: originalHeight,
        unit: 'pixels',
        maintainAspectRatio: true,
        method: 'bilinear',
      });
    }
  }, [isOpenModal, originalWidth, originalHeight, form]);

  const currentUnit = Form.useWatch('unit', form);
  const maxValue = currentUnit === 'percent' ? 300 : 10000;
  const unitSuffix = currentUnit === 'pixels' ? 'px' : '%';

  return (
    <Modal
      title="Изменить размер изображения"
      open={isOpenModal}
      onCancel={closeModal}
      onOk={form.submit}
      okText="Применить"
      cancelText="Отмена"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          width: originalWidth,
          height: originalHeight,
          unit: 'pixels',
          maintainAspectRatio: true,
          method: 'bilinear',
        }}
      >
        <Form.Item>
          <Typography.Text>
            Исходный размер: {originalMegapixels} МП ({originalWidth}x{originalHeight})
          </Typography.Text>
          <br />
          <Typography.Text type="secondary">
            Новый размер: {newSize.megapixels} МП ({newSize.width}x{newSize.height})
          </Typography.Text>
        </Form.Item>

        <Form.Item name="unit" label="Единицы измерения">
          <Select>
            <Select.Option value="pixels">Пиксели</Select.Option>
            <Select.Option value="percent">Проценты</Select.Option>
          </Select>
        </Form.Item>

        <Space direction="vertical" style={{ width: '100%' }}>
          <Form.Item name="width" label="Ширина" rules={[{ required: true }]}>
            <InputNumber
              min={1}
              max={maxValue}
              style={{ width: 200 }}
              onChange={handleWidthChange}
              addonAfter={unitSuffix}
            />
          </Form.Item>

          <Form.Item name="height" label="Высота" rules={[{ required: true }]}>
            <InputNumber
              min={1}
              max={maxValue}
              style={{ width: 200 }}
              onChange={handleHeightChange}
              addonAfter={unitSuffix}
            />
          </Form.Item>
        </Space>

        <Form.Item name="maintainAspectRatio" valuePropName="checked">
          <Checkbox>Сохранять пропорции</Checkbox>
        </Form.Item>

        <Form.Item
          name="method"
          label="Метод интерполяции"
          tooltip={{
            title: interpolationDescriptions[form.getFieldValue('method') as InterpolationMethod],
          }}
        >
          <Select>
            <Select.Option value="nearest">Метод ближайшего соседа</Select.Option>
            <Select.Option value="bilinear">Билинейная интерполяция</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
