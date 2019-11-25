import React, { FC } from 'react';
import MainAppProvider from './store/MainAppProvider';
import MainApp from './MainApp';
import QuotesProvider from './store/QuotesProvider';

interface Props {}

const AppWithProviders: FC<Props> = () => {
  return (
    <MainAppProvider>
      <QuotesProvider>
        <MainApp></MainApp>
      </QuotesProvider>
    </MainAppProvider>
  );
};

export default AppWithProviders;
