import { UserAuthenticate, UserRegistration } from '../types/UserInfo';
import { HubConnection } from '@aspnet/signalr';
import { AccountModelWebSocketDTO } from '../types/Accounts';
import { LOCAL_STORAGE_TOKEN_KEY } from '../constants/global';
import { action, observable, computed } from 'mobx';
import API from '../helpers/API';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import initConnection from '../services/websocketService';
import Topics from '../constants/websocketTopics';
import Axios from 'axios';
import RequestHeaders from '../constants/headers';
import KeysInApi from '../constants/keysInApi';
import { FirstLoginEnum } from '../enums/FirstLogin';
import apiResponseCodeMessages from '../constants/apiResponseCodeMessages';

interface MainAppStoreProps {
  token: string;
  isAuthorized: boolean;
  firstLogin: boolean;
  signIn: (credentials: UserAuthenticate) => void;
  signUp: (credentials: UserRegistration) => Promise<unknown>;
  activeSession?: HubConnection;
  isLoading: boolean;
  activeAccount?: AccountModelWebSocketDTO;
  accounts: AccountModelWebSocketDTO[];
  setActiveAccount: (acc: AccountModelWebSocketDTO) => void;
}

export class MainAppStore implements MainAppStoreProps {
  @observable isLoading = true;
  @observable isAuthorized = false;
  @observable firstLogin = false;
  @observable activeSession?: HubConnection;
  @observable activeAccount?: AccountModelWebSocketDTO;
  @observable accounts: AccountModelWebSocketDTO[] = [];
  token = '';

  constructor() {
    this.token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY) || '';
    Axios.defaults.headers[RequestHeaders.AUTHORIZATION] = this.token;
    if (this.token) {
      this.handleInitConnection(this.token);
    } else {
      this.isLoading = false;
    }
  }

  handleInitConnection = async (token: string) => {
    const connection = initConnection(WS_HOST);

    try {
      await connection.start();
      try {
        await connection.send(Topics.INIT, token);
        this.activeSession = connection;
        this.isAuthorized = true;
      } catch (error) {
        this.isAuthorized = false;
      }
    } catch (error) {
      this.isAuthorized = false;
    }

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
  setActiveAccount(account: AccountModelWebSocketDTO) {
    // console.log('TCL: MainAppStore -> setActiveAccount -> account', account);
    this.activeAccount = account;
  }

  @action
  signIn = async (credentials: UserAuthenticate) => {
    const response = await API.authenticate(credentials);

    if (response.result === OperationApiResponseCodes.Ok) {
      this.isAuthorized = true;
      this.setTokenHandler(response.data.token);
      this.handleInitConnection(response.data.token);
      try {
        const response = await API.getKeyValue(KeysInApi.FIRST_LOGIN);
        this.firstLogin = !!JSON.parse(response);
      } catch (error) {}
    }

    if (
      response.result === OperationApiResponseCodes.InvalidUserNameOrPassword
    ) {
      this.isAuthorized = false;
    }

    return response.result;
  };

  @action
  signOut = () => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
  };

  setTokenHandler = (token: string) => {
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
    Axios.defaults.headers[RequestHeaders.AUTHORIZATION] = token;
    this.token = token;
  };

  @action
  signUp = (credentials: UserRegistration) =>
    new Promise(async (resolve, reject) => {
      const response = await API.signUpNewTrader(credentials);
      if (response.result === OperationApiResponseCodes.Ok) {
        this.isAuthorized = true;
        this.setTokenHandler(response.data.token);
        this.handleInitConnection(response.data.token);
        await API.setKeyValue({
          key: KeysInApi.FIRST_LOGIN,
          value: JSON.stringify(FirstLoginEnum.FirstLogin),
        });
        resolve();
      } else {
        reject(apiResponseCodeMessages[response.result]);
      }
    });

  @computed
  get sortedAccounts() {
    return this.accounts.reduce(
      (acc, prev) =>
        prev.id === this.activeAccount?.id ? [prev, ...acc] : [...acc, prev],
      [] as AccountModelWebSocketDTO[]
    );
  }
}
