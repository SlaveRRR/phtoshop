import { Button, Select, Typography } from 'antd';
import styled from 'styled-components';

const { Text } = Typography;

const { Option } = Select;

export { Option, Text };

export const LayersPanelContainer = styled.div`
  position: absolute;
  width: max-content;
  right: 0;
  bottom: 0;
  max-height: 300px;
  overflow-y: auto;
  padding: 16px;
  background-color: #f5f5f5;
  border-left: 1px solid #d9d9d9;
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
`;

export const LayerItem = styled.div<{ isActive: boolean }>`
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${(props) => (props.isActive ? '#e6f7ff' : '#ffffff')};
  border: 1px solid #d9d9d9;
  border-radius: 4px;
`;

export const LayerControls = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

export const LayerName = styled.span`
  flex: 1;
  margin-left: 8px;
  font-size: 14px;
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  border: 1px solid #d9d9d9;
`;

export const PreviewWrapper = styled.div`
  width: 60px;
  height: 60px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

export const UploadButton = styled(Button)`
  width: 100%;
  margin-bottom: 8px;
`;

export const ColorPickerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
