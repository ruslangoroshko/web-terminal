import {
  LOCAL_STORAGE_TOKEN_KEY,
  LOCAL_STORAGE_REFRESH_TOKEN_KEY,
  LOCAL_STORAGE_LANGUAGE,
  LOCAL_STORAGE_SIDEBAR,
  LOCAL_POSITION,
  LOCAL_MARKET_TABS,
  LOCAL_PORTFOLIO_TABS,
  LOCAL_PENDING_POSITION,
  LOCAL_HISTORY_POSITION,
  LOCAL_STORAGE_IS_NEW_USER,
  LOCAL_HISTORY_TIME,
  LOCAL_HISTORY_DATERANGE,
  LOCAL_HISTORY_PAGE,
  LOCAL_POSITION_SORT,
  LOCAL_PENDING_POSITION_SORT,
} from './../constants/global';
import {
  UserAuthenticate,
  UserRegistration,
  LpLoginParams,
} from '../types/UserInfo';
import { HubConnection } from '@aspnet/signalr';
import { AccountModelWebSocketDTO } from '../types/AccountsTypes';
import { action, observable, computed, makeAutoObservable } from 'mobx';
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
import { polandLocalsList } from '../constants/polandLocalsList';
import { languagesList } from '../constants/languagesList';
import { PositionModelWSDTO } from '../types/Positions';
import { PendingOrderWSDTO } from '../types/PendingOrdersTypes';
import { BrandEnum } from '../constants/brandingLinksTranslate';
import { logger } from '../helpers/ConsoleLoggerTool';

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
  signalRReconnectTimeOut: string;
  initModel: InitModel;
  lang: CountriesEnum;
  activeAccountId: string;
  isPromoAccount: boolean;
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
  };
  isLoading = true;
  isInitLoading = true;
  isDemoRealPopup = false;
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
  connectTimeOut = '';

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
    // @ts-ignore
    this.lang =
      localStorage.getItem(LOCAL_STORAGE_LANGUAGE) ||
      ((window.navigator.language &&
        languagesList.includes(window.navigator.language.slice(0, 2).toLowerCase()))
        ? window.navigator.language.slice(0, 2).toLowerCase()
        : CountriesEnum.EN);
    injectInerceptors(this);
  }

  initApp = async () => {
    try {
      const initModel = await API.getInitModel();
      this.initModel = initModel;
      this.setInterceptors();
    } catch (error) {
      this.rootStore.badRequestPopupStore.openModal();
      this.rootStore.badRequestPopupStore.setMessage(error);
    }
  };

  setInterceptors = () => {
    Axios.interceptors.request.use((config: AxiosRequestConfig) => {
      if (
        IS_LIVE &&
        this.initModel.tradingUrl &&
        config.url &&
        !config.url.includes('auth/')
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

  handleInitConnection = async (token = this.token) => {
    this.setIsLoading(true);
    const connectionString = IS_LOCAL
      ? WS_HOST
      : `${this.initModel.tradingUrl}/signalr`;
    const connection = initConnection(connectionString);

    const connectToWebocket = async () => {
      try {
        await connection.start();
        try {
          await connection.send(Topics.INIT, token);
          this.setIsAuthorized(true);
          this.activeSession = connection;
        } catch (error) {
          this.setInitLoading(false);
          this.setIsAuthorized(false);
        }
      } catch (error) {
        this.setInitLoading(false);
        setTimeout(
          connectToWebocket,
          this.signalRReconnectTimeOut ? +this.signalRReconnectTimeOut : 10000
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
        const isCurrentAcc = this.activeAccount?.id === response.data.id ? response.data : null;
        if (isCurrentAcc !== null) {
          this.setActiveAccount(isCurrentAcc);
        }
        this.setAccounts(
          this.accounts.map((account) =>
            account.id === response.data.id ? response.data : account
          )
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
        this.setInitLoading(false);
        this.setIsLoading(false);
        this.rootStore.badRequestPopupStore.openModal();
        this.rootStore.badRequestPopupStore.setMessage(response.data.reason);
      }
    );

    connection.onclose((error) => {
      this.rootStore.badRequestPopupStore.setSocket(true);
      this.socketError = true;
      console.log('websocket error: ', error);
      console.log('=====/=====');
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

  getActiveAccount = async () => {
    try {
      const activeAccountTarget = await API.getKeyValue(
        KeysInApi.ACTIVE_ACCOUNT_TARGET
      );

      if (activeAccountTarget === "facebook") {
        this.isPromoAccount = true;
      }

      const activeAccountId = await API.getKeyValue(
        KeysInApi.ACTIVE_ACCOUNT_ID
      );
      
      const activeAccount = this.accounts.find(
        (item) => item.id === activeAccountId
      );
      if (activeAccount) {
        this.activeSession?.send(Topics.SET_ACTIVE_ACCOUNT, {
          [Fields.ACCOUNT_ID]: activeAccount.id,
        });

        if (this.activeAccountId !== activeAccount.id) {
          this.setActiveAccountId(activeAccount.id);
        }
      } else {
        this.isDemoRealPopup = true;
      }
      this.setInitLoading(false);
      this.setIsLoading(false);
    } catch (error) {
      this.setIsLoading(false);
      this.rootStore.badRequestPopupStore.setMessage(error);
      this.rootStore.badRequestPopupStore.openModal();
    }
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
    API.setKeyValue({
      key: KeysInApi.ACTIVE_ACCOUNT_ID,
      value: account.id,
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
      this.setIsAuthorized(true);
      this.signalRReconnectTimeOut = response.data.reconnectTimeOut;
      this.connectTimeOut = response.data.connectionTimeOut;
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
    const response = await API.postLpLoginToken(params, this.initModel.authUrl);

    if (response.result === OperationApiResponseCodes.Ok) {
      localStorage.setItem(LOCAL_STORAGE_IS_NEW_USER, 'true');
      this.setIsAuthorized(true);
      this.signalRReconnectTimeOut = response.data.reconnectTimeOut;
      this.setTokenHandler(response.data.token);
      this.handleInitConnection(response.data.token);
      this.setRefreshToken(response.data.refreshToken);
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
      this.signalRReconnectTimeOut = response.data.reconnectTimeOut;
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
    this.setInitLoading(false);
    this.setIsLoading(false);
    this.token = '';
    this.refreshToken = '';
    this.setIsAuthorized(false);
    this.rootStore.quotesStore.setActivePositions([]);
    this.rootStore.quotesStore.setPendingOrders([]);
    this.rootStore.tradingViewStore.setSelectedPendingPosition(undefined);
    this.rootStore.tradingViewStore.setSelectedHistory(undefined);
    this.rootStore.quotesStore.setSelectedPositionId(null);
    this.rootStore.withdrawalStore.setHistory(null);
    this.rootStore.sortingStore.setActivePositionsSortBy(SortByProfitEnum.NewFirstAsc);
    this.rootStore.sortingStore.setPendingOrdersSortBy(SortByPendingOrdersEnum.NewFirstAsc);
    this.rootStore.dateRangeStore.setDropdownValueType(ShowDatesDropdownEnum.Week);
    this.rootStore.dateRangeStore.setStartDate(moment().subtract(1, 'weeks'));
    this.rootStore.tabsStore.setPortfolioTab(PortfolioTabEnum.Portfolio);
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
    this.lang = newLang;
  };

  get sortedAccounts() {
    return this.accounts.reduce(
      (acc, prev) =>
        prev.id === this.activeAccount?.id ? [prev, ...acc] : [...acc, prev],
      [] as AccountModelWebSocketDTO[]
    );
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
}
