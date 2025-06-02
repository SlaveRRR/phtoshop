import { Uploader } from './components';
import { StyledHeader, Title } from './styled';

export const Header = () => {
  return (
    <StyledHeader>
      <Uploader />
      <Title level={3} style={{ color: 'white', margin: 0 }}>
        Imagix
      </Title>
    </StyledHeader>
  );
};
