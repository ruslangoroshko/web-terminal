import { UserAuthenticate, UserRegistration } from '../types/UserInfo';
import { HubConnection } from '@aspnet/signalr';
import { AccountModelWebSocketDTO } from '../types/Accounts';
import { LOCAL_STORAGE_TOKEN_KEY } from '../constants/global';
import { action } from 'mobx';
import API from '../helpers/API';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import initConnection from '../services/websocketService';
import Topics from '../constants/websocketTopics';

interface MainAppStoreProps {
  token: string;
  isAuthorized: boolean;
  signIn: (credentials: UserAuthenticate) => void;
  signUp: (credentials: UserRegistration) => Promise<unknown>;
  activeSession?: HubConnection;
  isLoading: boolean;
  account?: AccountModelWebSocketDTO;
  setAccount: (acc: AccountModelWebSocketDTO) => void;
}

export class MainAppStore implements MainAppStoreProps {
  token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY) || '';
  account?: AccountModelWebSocketDTO;
  isLoading = false;
  isAuthorized = false;
  activeSession?: HubConnection;

  constructor() {
    this.handleInitConnection(this.token);
  }

  handleInitConnection = async (token: string) => {
    const connection = initConnection(WS_HOST);
    await connection.start();
    await connection.send(Topics.INIT, token);
    this.activeSession = connection;

    this.isLoading = false;
    connection.on(Topics.UNAUTHORIZED, () => {
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
      this.isAuthorized = false;
    });
    connection.onclose(error => {
      console.log(error);
      this.handleInitConnection(token);
    });
  };

  @action
  setAccount(account: AccountModelWebSocketDTO) {
    this.account = account;
  }

  @action
  signIn = async (credentials: UserAuthenticate) => {
    const response = await API.authenticate(credentials);
    if (
      response.result === OperationApiResponseCodes.InvalidUserNameOrPassword
    ) {
      this.isAuthorized = false;
    } else {
      this.isAuthorized = true;
      this.setTokenHandler(response.data.token);
      this.handleInitConnection(response.data.token);
      console.log('TCL: MainAppStore -> this.isAuthorized', this.isAuthorized);
    }
  };

  setTokenHandler = (token: string) => {
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
    this.token = token;
  };

  @action
  signUp = (credentials: UserRegistration) =>
    new Promise(async (resolve, reject) => {
      const response = await API.signUpNewTrader(credentials);
      if (
        response.result === OperationApiResponseCodes.InvalidUserNameOrPassword
      ) {
        reject('Invalid username or password');
      } else {
        this.isAuthorized = true;
        this.setTokenHandler(response.data.token);
        this.handleInitConnection(response.data.token);
        resolve();
      }
    });
}
