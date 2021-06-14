import axios, { AxiosResponse } from 'axios';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import apiResponseCodeMessages from '../constants/apiResponseCodeMessages';
import { MainAppStore } from '../store/MainAppStore';
import RequestHeaders from '../constants/headers';
import Page from '../constants/Pages';
import API_LIST from '../helpers/apiList';
import requestOptions from '../constants/requestOptions';
import { logger } from '../helpers/ConsoleLoggerTool';

const repeatRequest = (error: any, mainAppStore: MainAppStore) => {
  axios.request(error.config);
  mainAppStore.requestReconnectCounter += 1;
  logger(mainAppStore.requestReconnectCounter);

  if (mainAppStore.requestReconnectCounter > 3) {
    mainAppStore.rootStore.badRequestPopupStore.setRecconect();
    mainAppStore.rootStore.badRequestPopupStore.setNetwork(true);
    mainAppStore.rootStore.badRequestPopupStore.initConectionReload();
  }
  // setTimeout(() => {
  //   mainAppStore.rootStore.badRequestPopupStore.setRecconect();
  //   mainAppStore.rootStore.badRequestPopupStore.stopRecconect();
  // }, +mainAppStore.connectTimeOut);
};

const injectInerceptors = (mainAppStore: MainAppStore) => {
  // for multiple requests
  let isRefreshing = false;
  let failedQueue: any[] = [];

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

  axios.interceptors.response.use(
    function (config: AxiosResponse) {
      if (config.data.result === OperationApiResponseCodes.TechnicalError) {
        return Promise.reject(
          apiResponseCodeMessages[OperationApiResponseCodes.TechnicalError]
        );
      }
      if (
        config.data.result ===
        OperationApiResponseCodes.InvalidUserNameOrPassword
      ) {
        mainAppStore.signOut();
      }
      return config;
    },

    async function (error) {
      // Dont check onboarding Errors and open Demo/Real popup
      if (error.response?.config?.url.includes(API_LIST.ONBOARDING.STEPS)) {
        return Promise.reject(error);
      }
      // ---

      let isTimeOutError = error.message === requestOptions.TIMEOUT;
      let isReconnectedRequest =
        JSON.parse(error.config.data).initBy === requestOptions.BACKGROUND;

      if (isTimeOutError && !isReconnectedRequest) {
        mainAppStore.rootStore.notificationStore.setNotification(
          'Timeout connection error'
        );
        mainAppStore.rootStore.notificationStore.setIsSuccessfull(false);
        mainAppStore.rootStore.notificationStore.openNotification();
      }
      if (isTimeOutError && isReconnectedRequest) {
        return repeatRequest(error, mainAppStore);
      }

      const originalRequest = error.config;

      switch (error.response?.status) {
        case 500:
          if (isReconnectedRequest) {
            return repeatRequest(error, mainAppStore);
          }

          mainAppStore.rootStore.badRequestPopupStore.setMessage(
            error.response?.statusText || 'error'
          );
          mainAppStore.rootStore.badRequestPopupStore.openModal();

          break;

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
          mainAppStore.rootStore.badRequestPopupStore.closeModal();
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
