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
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;
