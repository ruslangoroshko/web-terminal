import React, { useState, FC, useEffect } from 'react';
import { UserAuthenticate } from '../types/UserInfo';
import API from '../helpers/API';
import initConnection from '../services/websocketService';
import { HubConnection } from '@aspnet/signalr';
import Topics from '../constants/websocketTopics';
import { LOCAL_STORAGE_TOKEN_KEY } from '../constants/global';

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
  const tokenFromStorage = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  const [token, setToken] = useState(
    tokenFromStorage === null ? '' : tokenFromStorage
  );
  const [isLoading, setIsLoading] = useState(false);
  const [activeSession, setActiveSession] = useState<HubConnection>();

  const setTokenHandler = (token: string) => {
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
    setToken(token);
  };

  const signIn = async (credentials: UserAuthenticate) => {
    const response = await API.authenticate(credentials);
    if (response.result !== -1) {
      setAuthorized(true);
      setTokenHandler(response.data.token);
      handleInitConnection(response.data.token);
    }
  };

  const handleInitConnection = async (token: string) => {
    const connection = initConnection(WS_HOST);
    await connection.start();
    await connection.send(Topics.INIT, token);
    setActiveSession(connection);
    setIsLoading(false);

    connection.onclose(error => {
      console.log(error);
    });
  };

  const [isAuthorized, setAuthorized] = useState(!!token);

  useEffect(() => {
    if (!activeSession) {
      handleInitConnection(token);
    }
  }, [activeSession]);
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
