import axios, { AxiosResponse } from 'axios';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import apiResponseCodeMessages from '../constants/apiResponseCodeMessages';
import { MainAppStore } from '../store/MainAppStore';
import RequestHeaders from '../constants/headers';
import API_LIST from '../helpers/apiList';
import { DebugTypes } from '../types/DebugTypes';
import { debugLevel, doNotSendRequest } from '../constants/debugConstants';
import { getProcessId } from '../helpers/getProcessId';
import { getCircularReplacer } from '../helpers/getCircularReplacer';
import API from '../helpers/API';
import { getStatesSnapshot } from '../helpers/getStatesSnapshot';
import requestOptions from '../constants/requestOptions';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../constants/mixpanelEvents';
import mixapanelProps from '../constants/mixpanelProps';
import AUTH_API_LIST from '../helpers/apiListAuth';
import { CLIENTS_REQUEST } from '../constants/interceptorsConstants';

const openNotification = (errorText: string, mainAppStore: MainAppStore) => {
  mainAppStore.rootStore.notificationStore.setNotification(errorText);
  mainAppStore.rootStore.notificationStore.setIsSuccessfull(false);
  mainAppStore.rootStore.notificationStore.openNotification();
};

const injectInerceptors = (mainAppStore: MainAppStore) => {
  // for multiple requests
  let isRefreshing = false;
  let failedQueue: any[] = [];

  let requestErrorStack: string[] = [];

  /**
   *
   * @param url string href from requst like as "https::/api.com/api/get-test"
   * @returns clear part of string - "/api/get-test"
   *
   */
  const getApiUrl = (url: string) => {
    const urlString = new URL(url);
    if (urlString.search) {
      return urlString.href
        .split(urlString.search)[0]
        .split(urlString.origin)[1];
    }
    return urlString.href.split(urlString.origin)[1];
  };

  const addErrorUrl = (str: string) => {
    const url = getApiUrl(str);
    if (!requestErrorStack.includes(url)) {
      requestErrorStack.push(url);
    }
    console.log('add');
    console.log(requestErrorStack);
  };

  const removeErrorUrl = (str: any) => {
    const url = getApiUrl(str);
    console.log(url);
    const index = requestErrorStack.findIndex((elem) => elem === url);
    if (index !== -1) {
      requestErrorStack = [
        ...requestErrorStack.slice(0, index),
        ...requestErrorStack.slice(index + 1),
      ];
    }
    console.log('remove');
    console.log(requestErrorStack);
  };

  const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    failedQueue = [];
  };

  axios.interceptors.request.use((config) => {
    if (config.url === API_LIST.INIT.GET) {
      return config;
    }
    const isAuthorized = `${mainAppStore.isAuthorized}`;
    const request_url = getApiUrl(config?.url || "");
    const initBy = CLIENTS_REQUEST.includes(request_url) ? requestOptions.CLIENT : requestOptions.BACKGROUND;
    let newData = config.data;
    if (typeof newData === 'object') {
      if (newData instanceof FormData) {
        newData.append('initBy', initBy);
        newData.append('isAuthorized', isAuthorized);
      } else {
        newData.initBy = initBy;
        newData.isAuthorized = isAuthorized;
      }
    } else {
      const parsedData = JSON.parse(newData);
      parsedData.initBy = initBy;
      parsedData.isAuthorized = isAuthorized;
      newData = JSON.stringify(parsedData);
    }
    config.data = newData;
    return config;
  });

  axios.interceptors.response.use(
    function (response: AxiosResponse) {
      if (response.config.url === API_LIST.INIT.GET) {
        return Promise.resolve(response);
      }
      if (
        response.data.status !== OperationApiResponseCodes.TechnicalError &&
        response.data.status !==
          OperationApiResponseCodes.InvalidUserNameOrPassword &&
        response.config
      ) {
        if (requestErrorStack.length > 0) {
          removeErrorUrl(response?.config?.url);
        }
        if (requestErrorStack.length === 0) {
          mainAppStore.requestReconnectCounter = 0;
          mainAppStore.rootStore.badRequestPopupStore.stopRecconect();
        }
        return Promise.resolve(response);
      }
      switch (response.data.status) {
        case OperationApiResponseCodes.TechnicalError: {
          return Promise.reject(
            apiResponseCodeMessages[OperationApiResponseCodes.TechnicalError]
          );
        }
        case OperationApiResponseCodes.InvalidUserNameOrPassword: {
          mainAppStore.signOut();
          break;
        }

        default:
          break;
      }
      return response;
    },

    async function (error) {
      const excludeReconectList = [API_LIST.INSTRUMENTS.FAVOURITES];
      const excludeCheckErrorFlow = [
        API_LIST.DEBUG.POST,
        API_LIST.ONBOARDING.STEPS,
      ];

      const requestUrl: string = error?.config?.url === API_LIST.INIT.GET
        ? error?.request?.responseURL
        : error?.config?.url;
      const originalRequest = error.config;
      if (excludeCheckErrorFlow.includes(getApiUrl(requestUrl))) {
        return Promise.reject(error);
      }
      if (
        error.response?.status === 401 &&
        getApiUrl(requestUrl).includes(AUTH_API_LIST.TRADER.REFRESH_TOKEN)
      ) {
        mainAppStore.requestReconnectCounter = 0;
        mainAppStore.rootStore.badRequestPopupStore.closeModal();
        mainAppStore.rootStore.badRequestPopupStore.stopRecconect();
        mainAppStore.signOut();
      }

      const repeatRequest = (callback: any) => {
        mainAppStore.requestReconnectCounter += 1;
        if (
          !(excludeReconectList.includes(getApiUrl(requestUrl)) && error.config.method === 'get') &&
          mainAppStore.requestReconnectCounter > 2
        ) {
          mainAppStore.rootStore.badRequestPopupStore.setRecconect();
        }
        setTimeout(() => {
          callback(originalRequest);
        }, +mainAppStore.connectTimeOut);
      };

      // looger
      if (
        mainAppStore.isAuthorized &&
        !doNotSendRequest.includes(error.response?.status) &&
        (error.response?.status || error.config?.timeoutErrorMessage)
      ) {
        const objectToSend = {
          message: error.message,
          name: error.name,
          stack: error.stack,
          status: error.response?.status,
        };
        const jsonLogObject = {
          error: JSON.stringify(objectToSend),
          snapShot: JSON.stringify(
            getStatesSnapshot(mainAppStore),
            getCircularReplacer()
          ),
        };
        const params: DebugTypes = {
          level: debugLevel.TRANSPORT,
          processId: getProcessId(),
          message:
            error.response?.statusText || error.message || 'unknown error',
          jsonLogObject: JSON.stringify(jsonLogObject),
        };
        API.postDebug(params, API_STRING);
      }
      // --- looger

      // check for formData
      let finalJSON = '';
      if (typeof error.config.data === 'object') {
        const dataObject = {};
        error.config.data.forEach((value: any, key: any) => {
          // @ts-ignore
          dataObject[key] = value;
        });
        finalJSON = JSON.stringify(dataObject);
      } else if (typeof error.config.data === 'undefined') {
        finalJSON = JSON.stringify({ initBy: requestOptions.BACKGROUND });
      } else {
        finalJSON = error.config.data;
      }
      // ---
      console.log(finalJSON);
      console.log(error.message);
      console.log(error.config);
      let isTimeOutError = error.message === requestOptions.TIMEOUT;
      let isReconnectedRequest =
        JSON.parse(finalJSON).initBy === requestOptions.BACKGROUND;
      if (isReconnectedRequest) {
        addErrorUrl(requestUrl);
      }
      const urlString = new URL(requestUrl).href;
      // mixpanel
      if (isTimeOutError && !requestUrl.includes(API_LIST.INIT.GET)) {
        mixpanel.track(mixpanelEvents.TIMEOUT, {
          [mixapanelProps.REQUEST_URL]: urlString,
        });
      }

      if (error.response?.status && !requestUrl.includes(API_LIST.INIT.GET)) {
        if (error.response?.status.toString().includes('50')) {
          mixpanel.track(mixpanelEvents.SERVER_ERROR_50X, {
            [mixapanelProps.REQUEST_URL]: urlString,
            [mixapanelProps.ERROR_TEXT]: error.response?.status,
          });
        }
        if (error.response?.status.toString().includes('40')) {
          mixpanel.track(mixpanelEvents.SERVER_ERROR_40X, {
            [mixapanelProps.REQUEST_URL]: urlString,
            [mixapanelProps.ERROR_TEXT]: error.response?.status,
          });
        }
      }

      // --- mixpanel

      if (isTimeOutError && !isReconnectedRequest) {
        openNotification('Timeout connection error', mainAppStore);
      }

      if (isTimeOutError && isReconnectedRequest) {
        return new Promise((resolve, reject) => {
          repeatRequest(() => {
            if (JSON.parse(finalJSON).isAuthorized === `${mainAppStore.isAuthorized}`) {
              resolve(axios(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      if (!error.response?.status && !isTimeOutError && !isReconnectedRequest) {
        openNotification(error.message, mainAppStore);
      }

      if (error.response?.status) {
        if (
          (error.response?.status !== 401 &&
            (error.response?.status !== 403 || !mainAppStore.isAuthorized) &&
            error.response?.status.toString().includes('40')) ||
          error.response?.status.toString().includes('50')
        ) {
          if (isReconnectedRequest) {
            return new Promise((resolve, reject) => {
              repeatRequest(() => {
                if (JSON.parse(finalJSON).isAuthorized === `${mainAppStore.isAuthorized}`) {
                  resolve(axios(originalRequest));
                } else {
                  reject(error);
                }
              });
            });
          } else {
            mainAppStore.rootStore.badRequestPopupStore.setMessage(
              error.message
            );
            mainAppStore.rootStore.badRequestPopupStore.openModal();
          }
        }
      }

      switch (error.response?.status) {
        case 401:
          if (mainAppStore.refreshToken && !originalRequest._retry) {
            if (isRefreshing) {
              try {
                const token = await new Promise(function (resolve, reject) {
                  failedQueue.push({ resolve, reject });
                });
                originalRequest.headers[RequestHeaders.AUTHORIZATION] = token;
                return await axios(originalRequest);
              } catch (err) {
                return await Promise.reject(err);
              }
            }

            originalRequest._retry = true;
            isRefreshing = true;

            return new Promise(function (resolve, reject) {
              mainAppStore
                .postRefreshToken()
                .then(() => {
                  axios.defaults.headers[RequestHeaders.AUTHORIZATION] =
                    mainAppStore.token;

                  error.config.headers[RequestHeaders.AUTHORIZATION] =
                    mainAppStore.token;
                  originalRequest._retry = false;

                  processQueue(null, mainAppStore.token);
                  resolve(axios(originalRequest));
                })
                .catch((err) => {
                  mainAppStore.setRefreshToken('');
                  processQueue(err, null);
                  reject(err);
                })
                .finally(() => {
                  mainAppStore.setIsLoading(false);
                  isRefreshing = false;
                });
            });
          } else {
            mainAppStore.signOut();
          }
          break;

        case 403: {
          failedQueue.forEach((prom) => {
            prom.reject();
          });
          mainAppStore.requestReconnectCounter = 0;
          mainAppStore.rootStore.badRequestPopupStore.closeModal();
          mainAppStore.rootStore.badRequestPopupStore.stopRecconect();
          mainAppStore.signOut();
          break;
        }

        default:
          break;
      }

      return Promise.reject(error);
    }
  );
};
export default injectInerceptors;
