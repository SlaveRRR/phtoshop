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
  overflow: auto;
  background: #f5f5f5;
  position: relative;

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

export const ToolsPanel = styled.div`
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

export const ColorPanel = styled(Card)`
  position: absolute;
  top: 0;
  right: 0;
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

export const ColorInfo = styled.div`
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
