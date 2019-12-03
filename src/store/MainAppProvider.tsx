import React, { useState, FC, useEffect } from 'react';
import { UserAuthenticate, UserRegistration } from '../types/UserInfo';
import API from '../helpers/API';
import initConnection from '../services/websocketService';
import { HubConnection } from '@aspnet/signalr';
import Topics from '../constants/websocketTopics';
import { LOCAL_STORAGE_TOKEN_KEY } from '../constants/global';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import Axios from 'axios';
import RequestHeaders from '../constants/headers';

interface ContextProps {
  token: string;
  isAuthorized: boolean;
  signIn: (credentials: UserAuthenticate) => Promise<unknown>;
  signUp: (credentials: UserRegistration) => Promise<unknown>;
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

  const signIn = (credentials: UserAuthenticate) =>
    new Promise(async (resolve, reject) => {
      const response = await API.authenticate(credentials);
      if (
        response.result === OperationApiResponseCodes.InvalidUserNameOrPassword
      ) {
        reject();
      } else {
        setAuthorized(true);
        setTokenHandler(response.data.token);
        handleInitConnection(response.data.token);
        resolve();
      }
    });

  const signUp = (credentials: UserRegistration) =>
    new Promise(async (resolve, reject) => {
      const response = await API.signUpNewTrader(credentials);
      if (
        response.result === OperationApiResponseCodes.InvalidUserNameOrPassword
      ) {
        reject('Invalid username or password');
      } else {
        setAuthorized(true);
        setTokenHandler(response.data.token);
        handleInitConnection(response.data.token);
        resolve();
      }
    });

  const handleInitConnection = async (token: string) => {
    const connection = initConnection(WS_HOST);
    await connection.start();
    await connection.send(Topics.INIT, token);
    setActiveSession(connection);
    setIsLoading(false);
    connection.on(Topics.UNAUTHORIZED, () => {
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
      setAuthorized(false);
    });
    connection.onclose(error => {
      console.log(error);
      handleInitConnection(token);
    });
  };

  const [isAuthorized, setAuthorized] = useState(!!token);

  useEffect(() => {
    if (!activeSession) {
      handleInitConnection(token);
    }
  }, [activeSession]);

  useEffect(() => {
    Axios.defaults.headers[RequestHeaders.AUTHORIZATION] = token;
  }, [token]);
  return (
    <MainAppContext.Provider
      value={{
        token,
        signIn,
        isAuthorized,
        activeSession,
        isLoading,
        signUp,
      }}
    >
      {children}
    </MainAppContext.Provider>
  );
};

export default MainAppProvider;
