import React, { FC } from 'react';
import MainApp from './MainApp';
import QuotesProvider from './store/QuotesProvider';
import BuySellProvider from './store/BuySellProvider';
import UserAccountProvider from './store/UserAccountProvider';
interface Props {}

const AppWithProviders: FC<Props> = () => {
  return (
    <QuotesProvider>
      <BuySellProvider>
        <UserAccountProvider>
          <MainApp></MainApp>
        </UserAccountProvider>
      </BuySellProvider>
    </QuotesProvider>
  );
};

export default AppWithProviders;
