import {
  LOCAL_HISTORY_DATERANGE,
  LOCAL_HISTORY_PAGE,
  LOCAL_HISTORY_POSITION,
  LOCAL_HISTORY_TIME,
  LOCAL_INSTRUMENT_ACTIVE,
  LOCAL_MARKET_TABS,
  LOCAL_PENDING_POSITION,
  LOCAL_PENDING_POSITION_SORT,
  LOCAL_PORTFOLIO_TABS,
  LOCAL_POSITION,
  LOCAL_POSITION_SORT,
  LOCAL_STORAGE_IS_NEW_USER,
  LOCAL_STORAGE_LANGUAGE,
  LOCAL_STORAGE_MT,
  LOCAL_STORAGE_REFRESH_TOKEN_KEY,
  LOCAL_STORAGE_SIDEBAR,
  LOCAL_STORAGE_TOKEN_KEY,
} from './../constants/global';
import {
  LpLoginParams,
  UserAuthenticate,
  UserRegistration,
} from '../types/UserInfo';
import { HubConnection } from '@aspnet/signalr';
import {
  AccountModelWebSocketDTO,
  AccountUpdateTypeModelWebSocketDTO,
} from '../types/AccountsTypes';
import { action, makeAutoObservable } from 'mobx';
import API from '../helpers/API';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import initConnection from '../services/websocketService';
import Topics from '../constants/websocketTopics';
import Axios, { AxiosRequestConfig } from 'axios';
import RequestHeaders from '../constants/headers';
import KeysInApi from '../constants/keysInApi';
import { RootStore } from './RootStore';
import Fields from '../constants/fields';
import { ResponseFromWebsocket } from '../types/ResponseFromWebsocket';
import { PersonalDataKYCEnum } from '../enums/PersonalDataKYCEnum';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../constants/mixpanelEvents';
import {
  InstrumentModelWSDTO,
  PriceChangeWSDTO,
} from '../types/InstrumentsTypes';
import { AskBidEnum } from '../enums/AskBid';
import { ServerError } from '../types/ServerErrorType';
import { InitModel } from '../types/InitAppTypes';
import { CountriesEnum } from '../enums/CountriesEnum';
import mixapanelProps from '../constants/mixpanelProps';
import injectInerceptors from '../http/interceptors';
import { ShowDatesDropdownEnum } from '../enums/ShowDatesDropdownEnum';
import moment from 'moment';
import { PortfolioTabEnum } from '../enums/PortfolioTabEnum';
import { SortByProfitEnum } from '../enums/SortByProfitEnum';
import { SortByPendingOrdersEnum } from '../enums/SortByPendingOrdersEnum';
import { languagesList } from '../constants/languagesList';
import { PositionModelWSDTO } from '../types/Positions';
import { PendingOrderWSDTO } from '../types/PendingOrdersTypes';
import { BrandEnum } from '../constants/brandingLinksTranslate';
import { DebugTypes } from '../types/DebugTypes';
import { debugLevel } from '../constants/debugConstants';
import { getProcessId } from '../helpers/getProcessId';
import { getCircularReplacer } from '../helpers/getCircularReplacer';
import { getStatesSnapshot } from '../helpers/getStatesSnapshot';
import { HintEnum } from '../enums/HintsEnum';
import { OrderBookDTOType } from '../types/OrderBookTypes';

interface MainAppStoreProps {
  token: string;
  refreshToken: string;
  isAuthorized: boolean;
  signIn: (credentials: UserAuthenticate) => void;
  signUp: (credentials: UserRegistration) => Promise<unknown>;
  activeSession?: HubConnection;
  isLoading: boolean;
  isInitLoading: boolean;
  activeAccount?: AccountModelWebSocketDTO;
  accounts: AccountModelWebSocketDTO[];
  setActiveAccount: (acc: AccountModelWebSocketDTO) => void;
  profileStatus: PersonalDataKYCEnum;
  isDemoRealPopup: boolean;
  isOnboarding: boolean;
  signalRReconnectTimeOut: string;
  initModel: InitModel;
  lang: CountriesEnum;
  activeAccountId: string;
  isPromoAccount: boolean;
  websocketConnectionTries: number;

  requestReconnectCounter: number;

  debugSocketMode: boolean;
  debugDontPing: boolean;
  debugSocketReconnect: boolean;
}

// TODO: think about application initialization
// describe step by step init, loaders, async behaviour in app
// think about loader flags - global, local

export class MainAppStore implements MainAppStoreProps {
  initModel: InitModel = {
    aboutUrl: '',
    androidAppLink: '',
    brandCopyrights: '',
    brandName: '',
    brandProperty: BrandEnum.Monfex,
    faqUrl: '',
    withdrawFaqUrl: '',
    favicon: '',
    gaAsAccount: '',
    iosAppLink: '',
    logo: '',
    policyUrl: '',
    supportUrl: '',
    termsUrl: '',
    tradingUrl: '/',
    authUrl: '',
    mixpanelToken: '582507549d28c813188211a0d15ec940',
    recaptchaToken: '',
    miscUrl: 'https://trading-api-test.mnftx.biz/misc',
  };
  isLoading = true;
  isInitLoading = true;
  isDemoRealPopup = false;
  isOnboarding = false;
  isAuthorized = false;
  activeSession?: HubConnection;
  accounts: AccountModelWebSocketDTO[] = [];
  profileStatus: PersonalDataKYCEnum = PersonalDataKYCEnum.NotVerified;
  profilePhone = '';
  profileName = '';
  profileEmail = '';
  lang = CountriesEnum.EN;
  token = '';
  refreshToken = '';
  socketError = false;
  activeAccountId: string = '';
  signUpFlag: boolean = false;
  lpLoginFlag: boolean = false;
  websocketConnectionTries = 0;
  requestErrorStack: string[] = [];
  canCheckEducation: boolean = false;

  paramsAsset: string | null = null;
  paramsMarkets: string | null = null;
  paramsPortfolioTab: string | null = null;
  paramsPortfolioActive: string | null = null;
  paramsPortfolioOrder: string | null = null;
  paramsPortfolioHistory: string | null | undefined = undefined;
  paramsDeposit: boolean = false;

  isPromoAccount = false;

  rootStore: RootStore;
  signalRReconnectTimeOut = '';

  connectTimeOut = 10000; // 5000;
  requestReconnectCounter = 0;
  signalRReconectCounter = 0;

  debugSocketMode = false;
  debugDontPing = false;
  debugSocketReconnect = false;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {
      rootStore: false,
      connectTimeOut: false,
      signalRReconnectTimeOut: false,
    });
    this.rootStore = rootStore;

    this.token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY) || '';
    this.refreshToken =
      localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY) || '';
    Axios.defaults.headers[RequestHeaders.AUTHORIZATION] = this.token;
    Axios.defaults.timeout = this.connectTimeOut;

    const newLang =
      localStorage.getItem(LOCAL_STORAGE_LANGUAGE) ||
      (window.navigator.language &&
      languagesList.includes(
        window.navigator.language.slice(0, 2).toLowerCase()
      )
        ? window.navigator.language.slice(0, 2).toLowerCase()
        : CountriesEnum.EN);
    // @ts-ignore
    this.lang = newLang;
    const langToHtml =
      newLang === CountriesEnum.ES &&
      window.navigator.language.slice(0, 2).toLowerCase() === CountriesEnum.ES
        ? window.navigator.language
        : newLang;
    document.querySelector('html')?.setAttribute('lang', langToHtml);
    injectInerceptors(this);
  }

  initApp = async () => {
    try {
      const initModel = await API.getInitModel();
      this.initModel = initModel;
      this.setInterceptors();
    } catch (error) {
      await this.initApp();
      // this.rootStore.badRequestPopupStore.openModal();
      // this.rootStore.badRequestPopupStore.setMessage(error);
    }
  };

  setInterceptors = () => {
    Axios.interceptors.request.use((config: AxiosRequestConfig) => {
      if (
        IS_LIVE &&
        this.initModel.tradingUrl &&
        config.url &&
        !config.url.includes('auth/') &&
        !config.url.includes('misc')
      ) {
        if (config.url.includes('://')) {
          const arrayOfSubpath = config.url.split('://')[1].split('/');
          const subPath = arrayOfSubpath.slice(1).join('/');
          config.url = `${this.initModel.tradingUrl}/${subPath}`;
        } else {
          config.url = `${this.initModel.tradingUrl}${config.url}`;
        }
      }

      config.headers[RequestHeaders.ACCEPT_LANGUAGE] = `${this.lang}`;
      return config;
    });
  };

  // For socket
  handleSocketServerError = (response: ResponseFromWebsocket<ServerError>) => {
    this.setInitLoading(false);
    this.setIsLoading(false);
    this.rootStore.badRequestPopupStore.openModal();
    this.rootStore.badRequestPopupStore.setMessage(response.data.reason);

    this.handleInitConnection(this.token);
  };

  handleSocketCloseError = (error: any) => {
    if (error) {
      if (this.websocketConnectionTries < 3) {
        this.websocketConnectionTries = this.websocketConnectionTries + 1;
        this.handleInitConnection();
      } else {
        window.location.reload();
        return;
      }
    }
    if (this.isAuthorized) {
      const objectToSend = {
        context: 'socket',
        urlAPI: this.initModel.tradingUrl,
        urlMiscAPI: this.initModel.miscUrl,
        urlAuthAPI: this.initModel.authUrl,
        platform: 'Web',
        config: error?.config || 'config is missing',
        message: error?.message || 'message is empty',
        name: error?.name || 'name is empty',
        stack: error?.stack || 'stack is empty',
      };
      const jsonLogObject = {
        error: JSON.stringify(objectToSend),
        snapShot: JSON.stringify(
          getStatesSnapshot(this),
          getCircularReplacer()
        ),
      };
      const params: DebugTypes = {
        level: debugLevel.TRANSPORT,
        processId: getProcessId(),
        message: error?.message || 'unknown error',
        jsonLogObject: JSON.stringify(jsonLogObject),
      };
      API.postDebug(params, API_STRING);
    }
  };

  handleNewInitConnection = async (token = this.token) => {
    this.setIsLoading(true);
    const connectionString = IS_LOCAL
      ? WS_HOST
      : `${this.initModel.tradingUrl}/signalr`;
    const connection = initConnection(connectionString);

    const debugSocketReconnectFunction = () => {
      if (this.debugSocketReconnect) {
        console.log('Return error socket init');
        return Promise.reject('Error socket init');
      }
    };

    const connectToWebocket = async () => {
      console.log('connectToWebocket');
      try {
        await debugSocketReconnectFunction();
        await connection.start();
        try {
          await connection.send(Topics.INIT, token);
          this.rootStore.badRequestPopupStore.closeModal();
          this.setIsAuthorized(true);
          this.activeSession = connection;
          this.pingPongConnection();
        } catch (error) {
          this.setInitLoading(false);
          this.setIsAuthorized(false);
        }
      } catch (error) {
        this.setInitLoading(false);
        setTimeout(
          connectToWebocket,
          this.signalRReconnectTimeOut ? +this.signalRReconnectTimeOut : 3000
        );
      }
    };
    connectToWebocket();

    connection.on(Topics.UNAUTHORIZED, () => {
      if (this.refreshToken) {
        this.postRefreshToken().then(() => {
          Axios.defaults.headers[RequestHeaders.AUTHORIZATION] = this.token;
          this.handleInitConnection();
        });
      } else {
        this.signOut();
      }
    });

    connection.on(
      Topics.ACCOUNTS,
      (response: ResponseFromWebsocket<AccountModelWebSocketDTO[]>) => {
        this.setAccounts(response.data);

        this.getActiveAccount();

        mixpanel.people.set({
          [mixapanelProps.ACCOUNTS]: response.data.map((item) => item.id),
          [mixapanelProps.FUNDED_TRADER]: `${response.data.some(
            (item) => item.isLive && item.balance > 0
          )}`,
        });
      }
    );

    connection.on(
      Topics.UPDATE_ACCOUNT,
      (response: ResponseFromWebsocket<AccountModelWebSocketDTO>) => {
        // this.setActiveAccountId(response.data.id);
        const isCurrentAcc =
          this.activeAccount?.id === response.data.id ? response.data : null;
        if (isCurrentAcc !== null) {
          this.setActiveAccount(isCurrentAcc);
          if (
            isCurrentAcc.balance !== 0 &&
            this.rootStore.bonusStore.showBonus() &&
            this.rootStore.bonusStore.bonusData !== null &&
            !this.isPromoAccount
          ) {
            try {
              this.rootStore.bonusStore.getUserBonus();
            } catch (error) {}
          }
        }
        this.setAccounts(
          this.accounts.map((account) =>
            account.id === response.data.id ? response.data : account
          )
        );
      }
    );

    connection.stream;

    connection.on(
      Topics.UPDATE_ACCOUNT_TYPE,
      (response: ResponseFromWebsocket<AccountUpdateTypeModelWebSocketDTO>) => {
        const actualType =
          response.data.accountTypeModels.find(
            (item) => item.id === response.data.currentAccountTypeId
          ) || null;
        const sortedListOfAccountTypes = response.data.accountTypeModels.sort(
          (a, b) => a.order - b.order
        );
        const indexOfActualType =
          actualType !== null
            ? response.data.accountTypeModels.indexOf(actualType)
            : null;

        this.rootStore.accountTypeStore.setActualType(actualType);
        this.rootStore.accountTypeStore.setAllTypes(
          response.data.accountTypeModels
        );
        this.rootStore.accountTypeStore.setAmount(
          response.data.amountToNextAccountType
        );
        this.rootStore.accountTypeStore.setPercentage(
          response.data.currentAccountTypeProgressPercentage
        );
        if (indexOfActualType !== null) {
          this.rootStore.accountTypeStore.setNextType(
            sortedListOfAccountTypes[indexOfActualType + 1] || null
          );
        }

        this.rootStore.accountTypeStore.checkActiveAccount(
          response.data.currentAccountTypeId
        );

        // set default status
        this.rootStore.accountTypeStore.setKVActiveStatus(
          response.data.currentAccountTypeId,
          true
        );
      }
    );

    connection.on(
      Topics.INSTRUMENTS,
      (response: ResponseFromWebsocket<InstrumentModelWSDTO[]>) => {
        if (
          this.activeAccount &&
          response.accountId === this.activeAccount.id
        ) {
          response.data.forEach((item) => {
            this.rootStore.quotesStore.setQuote({
              ask: {
                c: item.ask || 0,
                h: 0,
                l: 0,
                o: 0,
              },
              bid: {
                c: item.bid || 0,
                h: 0,
                l: 0,
                o: 0,
              },
              dir: AskBidEnum.Buy,
              dt: Date.now(),
              id: item.id,
            });
          });
          this.rootStore.instrumentsStore.setInstruments(response.data);
        }
      }
    );

    connection.on(
      Topics.SERVER_ERROR,
      (response: ResponseFromWebsocket<ServerError>) => {
        this.handleSocketServerError(response);
      }
    );

    connection.onclose((error: any) => {
      this.handleSocketCloseError(error);

      //this.socketError = true;
      this.isLoading = false;
      this.isInitLoading = false;

      console.log('=====/=====');

      this.signalRReconectCounter = 0;
      this.rootStore.badRequestPopupStore.stopRecconect();
    });

    connection.on(
      Topics.PENDING_ORDERS,
      (response: ResponseFromWebsocket<PendingOrderWSDTO[]>) => {
        if (this.activeAccountId === response.accountId) {
          this.rootStore.quotesStore.setPendingOrders(response.data);
        }
      }
    );

    connection.on(
      Topics.INSTRUMENT_GROUPS,
      (response: ResponseFromWebsocket<InstrumentModelWSDTO[]>) => {
        if (this.activeAccountId === response.accountId) {
          this.rootStore.instrumentsStore.setInstrumentGroups(response.data);
          if (response.data.length) {
            const lastMarketTab = localStorage.getItem(LOCAL_MARKET_TABS);
            this.rootStore.instrumentsStore.setActiveInstrumentGroupId(
              this.paramsMarkets || lastMarketTab || response.data[0].id
            );
          }
        }
      }
    );

    connection.on(
      Topics.ACTIVE_POSITIONS,
      (response: ResponseFromWebsocket<PositionModelWSDTO[]>) => {
        if (response.accountId === this.activeAccountId) {
          this.rootStore.quotesStore.setActivePositions(response.data);
        }
      }
    );

    connection.on(
      Topics.PRICE_CHANGE,
      (response: ResponseFromWebsocket<PriceChangeWSDTO[]>) => {
        this.rootStore.instrumentsStore.setPricesChanges(response.data);
      }
    );

    connection.on(
      Topics.UPDATE_ACTIVE_POSITION,
      (response: ResponseFromWebsocket<PositionModelWSDTO>) => {
        if (response.accountId === this.activeAccountId) {
          this.rootStore.quotesStore.setActivePositions(
            this.rootStore.quotesStore.activePositions.map((item) =>
              item.id === response.data.id ? response.data : item
            )
          );
        }
      }
    );

    connection.on(
      Topics.UPDATE_PENDING_ORDER,
      (response: ResponseFromWebsocket<PendingOrderWSDTO>) => {
        if (response.accountId === this.activeAccount?.id) {
          this.rootStore.quotesStore.setPendingOrders(
            this.rootStore.quotesStore.pendingOrders.map((item) =>
              item.id === response.data.id ? response.data : item
            )
          );
        }
      }
    );

    connection.on(Topics.PONG, (response: ResponseFromWebsocket<any>) => {
      if (this.debugSocketMode) {
        console.log('cancel ping');
        return;
      }

      if (response.now) {
        this.signalRReconectCounter = 0;
        this.rootStore.badRequestPopupStore.stopRecconect();
      }
    });

    connection.on(
      Topics.ORDER_BOOK,
      (response: ResponseFromWebsocket<OrderBookDTOType>) => {
        const { market, bids, asks, isUpdate } = response.data;
        if (!isUpdate) {
          this.rootStore.orderBookStore.setMarket(market);
          this.rootStore.orderBookStore.setBids(bids);
          this.rootStore.orderBookStore.setAsks(asks);
        }
      }
    );
  };

  deleteOrderBookInstrument = async (instrumentId: string) => {
    if (this.activeSession) {
      try {
        await this.activeSession.send('UnsubscribeOrderBook', instrumentId);
      } catch (error) {}
    }
  };

  setOrderBookInstrument = async (instrumentId: string) => {
    if (this.activeSession) {
      try {
        await this.activeSession.send('SubscribeOrderBook', instrumentId);
      } catch (error) {}
    }
  };

  handleInitConnection = async (token = this.token) => {
    if (this.activeSession) {
      this.activeSession
        .stop()
        .finally(() => this.handleNewInitConnection(token));
    } else {
      this.handleNewInitConnection(token);
    }
  };

  postRefreshToken = async () => {
    try {
      const result = await API.refreshToken(
        { refreshToken: this.refreshToken },
        this.initModel.authUrl
      );
      if (result.refreshToken) {
        this.setRefreshToken(result.refreshToken);
        this.setTokenHandler(result.token);
      }
    } catch (error) {
      this.setRefreshToken('');
      this.setTokenHandler('');
    }
  };

  @action
  socketPing = () => {
    if (this.activeSession) {
      try {
        this.activeSession?.send(Topics.PING);
      } catch (error) {}
    }
  };

  @action
  pingPongConnection = () => {
    let timer: any;

    if (
      this.activeSession &&
      this.isAuthorized &&
      !this.rootStore.badRequestPopupStore.isNetwork
    ) {
      console.log('ping pong counter: ', this.signalRReconectCounter);
      if (this.signalRReconectCounter > 3) {
        this.rootStore.badRequestPopupStore.setRecconect();

        this.activeSession?.stop().finally(() => {
          this.handleInitConnection();
          this.debugSocketMode = false;
          this.debugDontPing = false;
        });

        return;
      }

      if (!this.debugDontPing) {
        this.socketPing();
      }

      timer = setTimeout(() => {
        this.signalRReconectCounter = this.signalRReconectCounter + 1;
        this.pingPongConnection();
      }, 3000);
    } else {
      clearTimeout(timer);
    }
  };

  @action
  checkOnboardingShow = async () => {
    try {
      //
      const onBoardingKey = await API.getKeyValue(KeysInApi.SHOW_ONBOARDING);
      const showOnboarding = onBoardingKey === 'true';
      if (showOnboarding) {
        this.isOnboarding = true;
      }
      return showOnboarding;
      //
    } catch (error) {
      return false;
    }
  };

  @action
  checkOnboardingShowLPLogin = async () => {
    try {
      //
      const onBoardingKey = await API.getKeyValue(KeysInApi.SHOW_ONBOARDING);
      const showOnboarding = onBoardingKey !== 'false';
      if (showOnboarding) {
        this.isOnboarding = true;
      }
      return showOnboarding;
      //
    } catch (error) {
      return false;
    }
  };

  getActiveAccount = async () => {
    try {
      await this.checkOnboardingShow();

      const activeAccountTarget = await API.getKeyValue(
        KeysInApi.ACTIVE_ACCOUNT_TARGET
      );

      this.canCheckEducation = true;

      if (activeAccountTarget === 'facebook') {
        this.isPromoAccount = true;
      } else {
        try {
          const userActiveHint = await API.getKeyValue(KeysInApi.SHOW_HINT);
          // @ts-ignore
          if (Object.values(HintEnum).includes(userActiveHint.trim())) {
            // @ts-ignore
            this.rootStore.educationStore.openHint(
              // @ts-ignore
              userActiveHint.trim(),
              false
            );
          }
        } catch {}
      }

      const activeAccount = this.accounts.find((acc) => acc.isLive);

      if (activeAccount) {
        if (this.activeAccountId !== activeAccount.id) {
          this.setActiveAccountId(activeAccount.id);
        }
      }

      this.setInitLoading(false);
      this.setIsLoading(false);
    } catch (error) {
      this.setIsLoading(false);
    }
  };

  @action
  addTriggerShowOnboarding = async () => {
    try {
      await API.setKeyValue({
        key: KeysInApi.SHOW_ONBOARDING,
        value: true,
      });
      this.isOnboarding = true;
    } catch (error) {}
  };

  @action
  addTriggerDissableOnboarding = async () => {
    this.isOnboarding = false;
    try {
      API.setKeyValue({
        key: KeysInApi.SHOW_ONBOARDING,
        value: false,
      });
    } catch (error) {}
  };

  @action
  setSignUpFlag = (value: boolean) => {
    this.signUpFlag = value;
  };

  @action
  setIsDemoReal = (value: boolean) => {
    this.isDemoRealPopup = value;
  };

  @action
  setLpLoginFlag = (value: boolean) => {
    this.lpLoginFlag = value;
  };

  @action
  setActiveAccount = (account: AccountModelWebSocketDTO) => {
    if (this.activeAccountId !== account.id) {
      this.setActiveAccountId(account.id);
    }

    // TODO: think how remove crutch
    this.rootStore.historyStore.setPositionsHistoryReport({
      ...this.rootStore.historyStore.positionsHistoryReport,
      positionsHistory: [],
    });
  };

  @action
  signIn = async (credentials: UserAuthenticate) => {
    const response = await API.authenticate(
      credentials,
      this.initModel.authUrl
    );
    if (response.result === OperationApiResponseCodes.Ok) {
      localStorage.setItem(LOCAL_STORAGE_IS_NEW_USER, 'true');
      if (response.data.mt5Enabled) {
        localStorage.setItem(LOCAL_STORAGE_MT, 'true');
        this.rootStore.accountTypeStore.setMTAvailable(true);
      }
      this.setIsAuthorized(true);
      this.signalRReconnectTimeOut = response.data.reconnectTimeOut;
      this.setConnectionTimeout(+response.data.connectionTimeOut);
      this.setTokenHandler(response.data.token);
      this.handleInitConnection(response.data.token);
      this.setRefreshToken(response.data.refreshToken);
      mixpanel.track(mixpanelEvents.LOGIN, {
        [mixapanelProps.BRAND_NAME]: this.initModel.brandProperty,
      });
    }

    if (
      response.result === OperationApiResponseCodes.InvalidUserNameOrPassword
    ) {
      this.setIsAuthorized(false);
    }

    return response.result;
  };

  @action
  signInLpLogin = async (params: LpLoginParams) => {
    if (this.isAuthorized) {
      this.signOut();
    }

    const response = await API.postLpLoginToken(params, this.initModel.authUrl);
    console.log('response LpLogin 1', response);
    if (response.result === OperationApiResponseCodes.Ok) {
      localStorage.setItem(LOCAL_STORAGE_IS_NEW_USER, 'true');
      //this.setIsAuthorized(true);
      this.signalRReconnectTimeOut = response.data.reconnectTimeOut;
      this.setConnectionTimeout(+response.data.connectionTimeOut);
      this.setTokenHandler(response.data.token);
      this.setRefreshToken(response.data.refreshToken);
      this.handleInitConnection(response.data.token);
      mixpanel.track(mixpanelEvents.LOGIN);
    }

    if (
      response.result === OperationApiResponseCodes.InvalidUserNameOrPassword
    ) {
      this.setIsAuthorized(false);
    }

    return response.result;
  };

  @action
  signUp = async (credentials: UserRegistration) => {
    const response = await API.signUpNewTrader(
      credentials,
      this.initModel.authUrl
    );
    if (response.result === OperationApiResponseCodes.Ok) {
      localStorage.setItem(LOCAL_STORAGE_IS_NEW_USER, 'true');
      if (response.data.mt5Enabled) {
        localStorage.setItem(LOCAL_STORAGE_MT, 'true');
        this.rootStore.accountTypeStore.setMTAvailable(true);
      }
      this.signalRReconnectTimeOut = response.data.reconnectTimeOut;
      this.setConnectionTimeout(+response.data.connectionTimeOut);
      this.setIsAuthorized(true);
      this.setTokenHandler(response.data.token);
      this.handleInitConnection(response.data.token);
      this.setRefreshToken(response.data.refreshToken);
    }

    if (
      response.result === OperationApiResponseCodes.InvalidUserNameOrPassword
    ) {
      this.setIsAuthorized(false);
    }
    return response.result;
  };

  @action
  signOut = () => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
    localStorage.removeItem(LOCAL_STORAGE_SIDEBAR);
    localStorage.removeItem(LOCAL_POSITION);
    localStorage.removeItem(LOCAL_POSITION_SORT);
    localStorage.removeItem(LOCAL_MARKET_TABS);
    localStorage.removeItem(LOCAL_PORTFOLIO_TABS);
    localStorage.removeItem(LOCAL_PENDING_POSITION);
    localStorage.removeItem(LOCAL_PENDING_POSITION_SORT);
    localStorage.removeItem(LOCAL_HISTORY_POSITION);
    localStorage.removeItem(LOCAL_HISTORY_TIME);
    localStorage.removeItem(LOCAL_HISTORY_DATERANGE);
    localStorage.removeItem(LOCAL_HISTORY_PAGE);
    localStorage.removeItem(LOCAL_INSTRUMENT_ACTIVE);
    localStorage.removeItem(LOCAL_STORAGE_MT);
    this.isPromoAccount = false;
    this.setInitLoading(false);
    this.setIsLoading(false);
    this.token = '';
    this.refreshToken = '';
    this.setIsAuthorized(false);
    this.profileName = '';
    this.profileEmail = '';
    this.rootStore.quotesStore.setActivePositions([]);
    this.rootStore.quotesStore.setPendingOrders([]);
    this.rootStore.tradingViewStore.setSelectedPendingPosition(undefined);
    this.rootStore.tradingViewStore.setSelectedHistory(undefined);
    this.rootStore.quotesStore.setSelectedPositionId(null);
    this.rootStore.withdrawalStore.setHistory(null);
    this.rootStore.sortingStore.setActivePositionsSortBy(
      SortByProfitEnum.NewFirstAsc
    );
    this.rootStore.sortingStore.setPendingOrdersSortBy(
      SortByPendingOrdersEnum.NewFirstAsc
    );
    this.rootStore.dateRangeStore.setDropdownValueType(
      ShowDatesDropdownEnum.Week
    );
    this.rootStore.dateRangeStore.setStartDate(moment().subtract(1, 'weeks'));
    this.rootStore.tabsStore.setPortfolioTab(PortfolioTabEnum.Portfolio);
    this.activeSession?.stop().then(() => {
      this.socketError = false;
      this.rootStore.badRequestPopupStore.setSocket(false);
    });
    this.requestReconnectCounter = 0;
    this.rootStore.badRequestPopupStore.stopRecconect();
    this.requestErrorStack = [];
    this.rootStore.bonusStore.setShowBonusPopup(false);
    this.rootStore.bonusStore.setBonusData(null);
    this.rootStore.bonusStore.setOnboardingFromDropdown(false);
    this.rootStore.bonusStore.setShowBonusDeposit(false);
    this.rootStore.bonusStore.setBonusIsLoaded(false);
    this.rootStore.bonusStore.refreshBonusParams();
    this.rootStore.educationStore.setCoursesList(null);
    this.rootStore.educationStore.setEducationIsLoaded(false);
    this.rootStore.educationStore.setActiveQuestion(null);
    this.rootStore.educationStore.setActiveCourse(null);
    this.rootStore.educationStore.setShowPopup(false);
    this.rootStore.educationStore.setQuestionsList(null);
    this.rootStore.educationStore.setHint(null, false);
    this.rootStore.tabsStore.setTabExpanded(false);
    this.rootStore.accountTypeStore.resetAccountType();
    this.rootStore.kycStore.resetKYCStore();
    this.canCheckEducation = false;
    if (this.activeAccount) {
      this.setParamsAsset(null);
      this.setParamsMarkets(null);
      this.setParamsPortfolioActive(null);
      this.setParamsPortfolioOrder(null);
      this.setParamsPortfolioHistory(null);
      this.setParamsPortfolioTab(null);
      this.setParamsDeposit(false);
    }
    delete Axios.defaults.headers[RequestHeaders.AUTHORIZATION];
    this.setActiveAccountId('');
  };

  setTokenHandler = (token: string) => {
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
    Axios.defaults.headers[RequestHeaders.AUTHORIZATION] = token;
    this.token = token;
  };

  setRefreshToken = (refreshToken: string) => {
    localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY, refreshToken);
    this.refreshToken = refreshToken;
  };

  @action
  setLanguage = (newLang: CountriesEnum) => {
    localStorage.setItem(LOCAL_STORAGE_LANGUAGE, newLang);
    document.querySelector('html')?.setAttribute('lang', newLang);
    this.lang = newLang;
  };

  get sortedAccounts() {
    // return this.accounts.reduce(
    //   (acc, prev) =>
    //     prev.id === this.activeAccount?.id ? [prev, ...acc] : [...acc, prev],
    //   [] as AccountModelWebSocketDTO[]
    // );

    return this.accounts;
  }

  @action
  setInitLoading = (isInitLoading: boolean) => {
    this.isInitLoading = isInitLoading;
  };

  @action
  setIsAuthorized = (isAuthorized: boolean) => {
    this.isAuthorized = isAuthorized;
  };

  @action
  setProfileStatus = (profileStatus: PersonalDataKYCEnum) => {
    this.profileStatus = profileStatus;
  };

  @action
  setProfilePhone = (profilePhone: string) => {
    this.profilePhone = profilePhone;
  };

  @action
  setProfileEmail = (profileEmail: string) => {
    this.profileEmail = profileEmail;
  };

  @action
  setProfileName = (profileName: string) => {
    this.profileName = profileName;
  };

  @action
  setIsLoading = (isLoading: boolean) => {
    this.isLoading = isLoading;
  };

  get activeAccount() {
    return this.accounts.find((item) => item.id === this.activeAccountId);
  }

  get realAcc() {
    return this.accounts.find((acc) => acc.isLive);
  }

  @action
  setActiveAccountId = (activeAccountId: AccountModelWebSocketDTO['id']) => {
    this.activeAccountId = activeAccountId;
  };

  @action
  setAccounts = (accounts: AccountModelWebSocketDTO[]) => {
    this.accounts = accounts;
  };

  @action
  setParamsAsset = (params: string | null) => {
    this.paramsAsset = params;
  };

  @action
  setParamsMarkets = (params: string | null) => {
    this.paramsMarkets = params;
  };

  @action
  setParamsPortfolioTab = (params: string | null) => {
    this.paramsPortfolioTab = params;
  };

  @action
  setParamsPortfolioActive = (params: string | null) => {
    this.paramsPortfolioActive = params;
  };

  @action
  setParamsPortfolioOrder = (params: string | null) => {
    this.paramsPortfolioOrder = params;
  };

  @action
  setParamsPortfolioHistory = (params: string | null | undefined) => {
    this.paramsPortfolioHistory = params;
  };

  @action
  setParamsDeposit = (params: boolean) => {
    this.paramsDeposit = params;
  };

  @action
  setConnectionTimeout = (timeout: number) => {
    this.connectTimeOut = 10000; //timeout || 5000;
  };

  @action
  setRequestErrorStack = (newStack: string[]) => {
    this.requestErrorStack = newStack;
  };
}
