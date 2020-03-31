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
import apiResponseCodeMessages from '../constants/apiResponseCodeMessages';
import { RootStore } from './RootStore';
import Fields from '../constants/fields';
import { ResponseFromWebsocket } from '../types/ResponseFromWebsocket';
import { PersonalDataKYCEnum } from '../enums/PersonalDataKYCEnum';

interface MainAppStoreProps {
  token: string;
  isAuthorized: boolean;
  signIn: (credentials: UserAuthenticate) => void;
  signUp: (credentials: UserRegistration) => Promise<unknown>;
  activeSession?: HubConnection;
  isLoading: boolean;
  isInitLoading: boolean;
  activeAccount?: AccountModelWebSocketDTO;
  accounts: AccountModelWebSocketDTO[];
  setActiveAccount: (acc: AccountModelWebSocketDTO) => void;
  activeAccountId: string;
  profileStatus: PersonalDataKYCEnum;
}

// TODO: think about application initialization
// describe step by step init, loaders, async behaviour in app
// think about loader flags - global, local

export class MainAppStore implements MainAppStoreProps {
  @observable isLoading = true;
  @observable isInitLoading = true;
  @observable isAuthorized = false;
  @observable activeSession?: HubConnection;
  @observable activeAccount?: AccountModelWebSocketDTO;
  @observable accounts: AccountModelWebSocketDTO[] = [];
  @observable activeAccountId: string = '';
  @observable profileStatus: PersonalDataKYCEnum = PersonalDataKYCEnum.NotVerified;
  token = '';
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY) || '';
    Axios.defaults.headers[RequestHeaders.AUTHORIZATION] = this.token;
    if (this.token) {
      this.handleInitConnection(this.token);
    } else {
      this.isInitLoading = false;
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
        this.isInitLoading = false;
      }
    } catch (error) {
      this.isInitLoading = false;
      this.isAuthorized = false;
    }

    connection.on(Topics.UNAUTHORIZED, () => {
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
      this.isAuthorized = false;
    });

    connection.on(
      Topics.ACCOUNTS,
      (response: ResponseFromWebsocket<AccountModelWebSocketDTO[]>) => {
        this.accounts = response.data;
        this.getActiveAccount();
      }
    );

    connection.on(
      Topics.UPDATE_ACCOUNT,
      (response: ResponseFromWebsocket<AccountModelWebSocketDTO>) => {
        this.rootStore.quotesStore.available = response.data.balance;
        this.setActiveAccount(response.data);
      }
    );
    connection.onclose(error => {
      console.log(error);
      this.handleInitConnection(token);
    });
  };

  getActiveAccount = async () => {
    try {
      const activeAccountId = await API.getKeyValue(
        KeysInApi.ACTIVE_ACCOUNT_ID
      );
      const activeAccount = this.accounts.find(
        item => item.id === activeAccountId
      );
      this.setActiveAccount(activeAccount || this.accounts[0]);
      this.isInitLoading = false;
    } catch (error) {
      this.isInitLoading = false;
    }
  };

  @action
  setActiveAccount(account: AccountModelWebSocketDTO) {
    this.activeAccount = account;
    this.rootStore.quotesStore.available = account.balance;

    this.activeSession?.send(Topics.SET_ACTIVE_ACCOUNT, {
      [Fields.ACCOUNT_ID]: account.id,
    });

    API.setKeyValue({
      key: KeysInApi.ACTIVE_ACCOUNT_ID,
      value: account.id,
    });
  }

  @action
  signIn = async (credentials: UserAuthenticate) => {
    const response = await API.authenticate(credentials);

    if (response.result === OperationApiResponseCodes.Ok) {
      this.isAuthorized = true;
      this.setTokenHandler(response.data.token);
      this.handleInitConnection(response.data.token);
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
    this.token = '';
    this.isAuthorized = false;
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
