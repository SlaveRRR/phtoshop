import { Layout, Typography } from 'antd';
import styled from 'styled-components';

const { Header } = Layout;
export const { Title } = Typography;

export const StyledHeader = styled(Header)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
