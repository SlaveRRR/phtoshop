import { Card } from 'antd';
import styled from 'styled-components';

export const ColorPanel = styled(Card)`
  position: absolute;
  top: 65px;
  right: 10px;
  z-index: 1;
  width: 300px;

  .ant-card-head-title {
    font-size: 14px;
  }
`;

export const ColorSwatch = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background-color: ${(props) => props.color};
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ColorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const ColorLabel = styled.span`
  min-width: 60px;
  color: rgba(0, 0, 0, 0.45);
`;

export const ColorValue = styled.span`
  font-family: monospace;
  color: rgba(0, 0, 0, 0.85);
`;
