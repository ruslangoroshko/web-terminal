import axios, { AxiosResponse } from 'axios';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import apiResponseCodeMessages from '../constants/apiResponseCodeMessages';
import { MainAppStore } from '../store/MainAppStore';
import RequestHeaders from '../constants/headers';
import Page from '../constants/Pages';
import API_LIST from '../helpers/apiList';
import { DebugTypes } from '../types/DebugTypes';
import debugLevel from '../constants/debugConstants';
import { getProcessId } from '../helpers/getProcessId';
import { getCircularReplacer } from '../helpers/getCircularReplacer';
import API from '../helpers/API';
import { getStatesSnapshot } from '../helpers/getStatesSnapshot';

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
      if (error.response?.config.url.includes('Debug')) {
        return false;
      }
      if (!error.response?.status) {
        mainAppStore.rootStore.badRequestPopupStore.setRecconect();
        setTimeout(() => {
          axios.request(error.config);
          mainAppStore.rootStore.badRequestPopupStore.stopRecconect();
        }, +mainAppStore.connectTimeOut);
      }
      if (mainAppStore.isAuthorized && error.response?.status !== 401) {
        const objectToSend = {
          message: error.message,
          name: error.name,
          stack: error.stack,
          status: error.response?.status
        };
        const jsonLogObject = {
          error: JSON.stringify(objectToSend),
          snapShot: JSON.stringify(getStatesSnapshot(mainAppStore), getCircularReplacer())
        };
        const params: DebugTypes = {
          level: debugLevel.TRANSPORT,
          processId: getProcessId(),
          message: error.response?.statusText || error.message || 'unknown error',
          jsonLogObject: JSON.stringify(jsonLogObject)
        };
        API.postDebug(params, API_STRING);
      }

      const originalRequest = error.config;
      if (error.response?.config?.url.includes(API_LIST.ONBOARDING.STEPS)) {
        return Promise.reject(error);
      }

      switch (error.response?.status) {
        case 400:
        case 500:
          
          function requestAgain() {
            mainAppStore.rootStore.badRequestPopupStore.setMessage(
              error.response?.statusText || 'error'
            );
            mainAppStore.rootStore.badRequestPopupStore.openModal();
            mainAppStore.setIsLoading(false);
          }
          setTimeout(requestAgain, +mainAppStore.connectTimeOut);
          mainAppStore.setIsLoading(false);
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
