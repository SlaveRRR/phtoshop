import { Card } from 'antd';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
  position: relative;
`;

export const CanvasContainer = styled(Card)`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: #f5f5f5;

  .ant-card-body {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export const StyledCanvas = styled.canvas`
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

export const Controls = styled(Card)`
  display: flex;
  gap: 16px;
  align-items: center;

  .ant-card-body {
    width: 100%;
    display: flex;
    gap: 16px;
    align-items: center;
  }
`;

export const ScaleControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

export const ImageInfo = styled.div`
  position: absolute;
  bottom: 24px;
  left: 24px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  color: white;
  font-size: 14px;
  z-index: 1;
`;
