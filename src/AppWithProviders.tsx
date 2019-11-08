import React, { FC } from 'react';
import MainAppProvider from './store/MainAppProvider';
import MainApp from './MainApp';

interface Props {}

const AppWithProviders: FC<Props> = () => {
  return (
    <MainAppProvider>
      <MainApp></MainApp>
    </MainAppProvider>
  );
};

export default AppWithProviders;
