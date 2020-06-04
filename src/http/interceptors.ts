import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import apiResponseCodeMessages from '../constants/apiResponseCodeMessages';
import { MainAppStore } from '../store/MainAppStore';
import RequestHeaders from '../constants/headers';


const injectInerceptors = (tradingUrl: string, mainAppStore: MainAppStore) => {
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

    function (error: AxiosError) {
      if (error.response?.status === 500) {
        mainAppStore.rootStore.badRequestPopupStore.setMessage(error.response?.statusText);
        mainAppStore.rootStore.badRequestPopupStore.openModal();
        mainAppStore.isLoading = false;
      } else if (error.response?.status === 401) {
        if (mainAppStore.refreshToken) {
          mainAppStore.postRefreshToken().then(() => {
              axios.defaults.headers[RequestHeaders.AUTHORIZATION] = mainAppStore.token;
              error.config.headers[RequestHeaders.AUTHORIZATION] = mainAppStore.token;
              return axios.request(error.config);
          });
        } else {
          mainAppStore.signOut();
        }
      }
      return Promise.reject(error);
    }
  );
  axios.interceptors.request.use(function (config: AxiosRequestConfig) {
    // TODO: sink about eat
    if (IS_LIVE && tradingUrl && config.url && !config.url.includes('auth/')) {
      if (config.url.includes('://')) {
        const arrayOfSubpath = config.url.split('://')[1].split('/');
        const subPath = arrayOfSubpath.slice(1).join('/');
        config.url = `${tradingUrl}/${subPath}`;
      } else {
        config.url = `${tradingUrl}${config.url}`;
      }
    }
    return config;
  });
};
export default injectInerceptors;
