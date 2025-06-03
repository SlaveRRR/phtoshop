import { Layout, Typography } from 'antd';
import styled from 'styled-components';

const { Header } = Layout;
export const { Title } = Typography;

export const StyledHeader = styled(Header)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: #001529;
  margin-bottom: 20px;
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const ToolsPanel = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;
