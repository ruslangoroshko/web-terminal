import React, { FC } from 'react';
import MainAppProvider from './store/MainAppProvider';
import MainApp from './MainApp';
import QuotesProvider from './store/QuotesProvider';

interface Props {}

const AppWithProviders: FC<Props> = () => {
  return <MainApp></MainApp>;
};

export default AppWithProviders;
