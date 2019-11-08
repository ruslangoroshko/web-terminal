import React, { useState, FC } from 'react';

export const MainAppContext = React.createContext({});

export const MainAppConsumer = MainAppContext.Consumer;

interface Props {}

const MainAppProvider: FC<Props> = ({ children }) => {
  const [state] = useState({});

  return (
    <MainAppContext.Provider value={state}>{children}</MainAppContext.Provider>
  );
};

export default MainAppProvider;
