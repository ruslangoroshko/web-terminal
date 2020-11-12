import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import apiResponseCodeMessages from '../constants/apiResponseCodeMessages';
import { MainAppStore } from '../store/MainAppStore';
import RequestHeaders from '../constants/headers';

const injectInerceptors = (mainAppStore: MainAppStore) => {
  // TODO: research init flow
  mainAppStore.isInterceptorsInjected = true;
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

    async function (error: AxiosError) {
      if (!error.response?.status) {
        mainAppStore.rootStore.badRequestPopupStore.setRecconect();
        setTimeout(() => {
          axios.request(error.config);
          mainAppStore.rootStore.badRequestPopupStore.stopRecconect();
        }, +mainAppStore.connectTimeOut);
      }
      if (error.response?.status === 500) {
        mainAppStore.rootStore.badRequestPopupStore.setMessage(
          error.response?.statusText
        );
        mainAppStore.rootStore.badRequestPopupStore.openModal();
        mainAppStore.isLoading = false;
      } else if (error.response?.status === 401) {
        if (mainAppStore.refreshToken) {
          return mainAppStore
            .postRefreshToken()
            .then(() => {
              axios.defaults.headers[RequestHeaders.AUTHORIZATION] =
                mainAppStore.token;

              error.config.headers[RequestHeaders.AUTHORIZATION] =
                mainAppStore.token;

              return axios.request(error.config);
            })
            .catch(() => {
              mainAppStore.refreshToken = '';
            });
        } else {
          mainAppStore.signOut();
        }
      }
      return Promise.reject(error);
    }
  );
  axios.interceptors.request.use(function (config: AxiosRequestConfig) {
    if (
      IS_LIVE &&
      mainAppStore.initModel.tradingUrl &&
      config.url &&
      !config.url.includes('auth/')
    ) {
      if (config.url.includes('://')) {
        const arrayOfSubpath = config.url.split('://')[1].split('/');
        const subPath = arrayOfSubpath.slice(1).join('/');
        config.url = `${mainAppStore.initModel.tradingUrl}/${subPath}`;
      } else {
        config.url = `${mainAppStore.initModel.tradingUrl}${config.url}`;
      }
    }
    config.headers[RequestHeaders.ACCEPT_LANGUAGE] = `${mainAppStore.lang}`;
    return config;
  });
};
export default injectInerceptors;
