import React, { useState, FC } from 'react';
import { UserAuthenticate } from '../types/UserInfo';
import API from '../helpers/API';
import initConnection from '../services/websocketService';
import { HubConnection } from '@aspnet/signalr';

interface ContextProps {
  token: string;
  isAuthorized: boolean;
  signIn: (credentials: UserAuthenticate) => void;
  activeSession: HubConnection | undefined;
  isLoading: boolean;
}
// TODO: find out how to avoid typo hack;
export const MainAppContext = React.createContext<ContextProps>(
  {} as ContextProps
);

export const MainAppConsumer = MainAppContext.Consumer;

interface Props {}

const MainAppProvider: FC<Props> = ({ children }) => {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSession, setActiveSession] = useState<HubConnection>();

  const signIn = (credentials: UserAuthenticate) => {
    API.authenticate(credentials).then(async response => {
      // TODO: find out enums of response
      if (response.result !== -1) {
        setAuthorized(true);
        setToken(response.data.token);
        handleInitConnection(response.data.token);
      }
    });
  };

  const handleInitConnection = (token: string) => {
    const connection = initConnection(WS_HOST, token);
    connection.start().then(asd => {
      setActiveSession(connection);
      setIsLoading(false);
    });

    connection.onclose(error => {
      console.log(error);
    });
  };

  const [isAuthorized, setAuthorized] = useState(false);

  return (
    <MainAppContext.Provider
      value={{
        token,
        signIn,
        isAuthorized,
        activeSession,
        isLoading,
      }}
    >
      {children}
    </MainAppContext.Provider>
  );
};

export default MainAppProvider;
