import { Card, Layout, Typography } from 'antd';
import styled from 'styled-components';

const { Header, Content } = Layout;
export const { Title } = Typography;

export const StyledLayout = styled(Layout)`
  position: relative;
  align-items: center;
  height: 100vh;
`;

export const StyledHeader = styled(Header)`
  display: flex;
  align-items: center;
`;

export const StyledContent = styled(Content)`
  padding: 24px;
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  gap: 24px;
`;

export const StyledCard = styled(Card)`
  height: 100%;
  width: 100%;

  .ant-card-body {
    height: 100%;
    padding: 0;
  }
`;
