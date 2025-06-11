import { Canvas, Header, Info, LayersPanel } from '@components';
import { AppProvider } from '@hooks';
import { FC } from 'react';

import { StyledLayout } from './styled';
import { GlobalStyles } from './styles';

export const App: FC = () => {
  return (
    <AppProvider>
      <StyledLayout>
        <Header />
        <Canvas />
        <Info />
        <LayersPanel />
      </StyledLayout>
      <GlobalStyles />
    </AppProvider>
  );
};
