import React, { FC } from 'react';
import MainAppProvider from './store/MainAppProvider';
import MainApp from './MainApp';
import QuotesProvider from './store/QuotesProvider';
import BuySellProvider from './store/BuySellProvider';
import UserAccountProvider from './store/UserAccountProvider';

interface Props {}

const AppWithProviders: FC<Props> = () => {
  return (
    <MainAppProvider>
      <QuotesProvider>
        <BuySellProvider>
          <UserAccountProvider>
            <MainApp></MainApp>
          </UserAccountProvider>
        </BuySellProvider>
      </QuotesProvider>
    </MainAppProvider>
  );
};

export default AppWithProviders;
