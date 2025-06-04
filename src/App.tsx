import { Canvas, Header, Info } from '@components';
import { AppProvider } from '@hooks';
import { FC } from 'react';

import { StyledLayout } from './styled';

export const App: FC = () => {
  return (
    <AppProvider>
      <StyledLayout>
        <Header />
        <Canvas />
        <Info />
        {/* <Layers /> */}
      </StyledLayout>
    </AppProvider>
  );
};
