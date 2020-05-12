import { LOCAL_STORAGE_TOKEN_KEY } from './../constants/global';
import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { appHistory } from '../routing/history';
import Page from '../constants/Pages';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import apiResponseCodeMessages from '../constants/apiResponseCodeMessages';

const injectInerceptors = (tradingUrl: string) => {
  axios.interceptors.response.use(
    function(config: AxiosResponse) {
      if (config.data.result === OperationApiResponseCodes.TechnicalError) {
        return Promise.reject(
          apiResponseCodeMessages[OperationApiResponseCodes.TechnicalError]
        );
      }
      if (config.data.result === -1) {
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
        location.reload();
      }
      return config;
    },

    function(error: AxiosError) {
      if (error.response?.status === 401) {
        appHistory.push(Page.SIGN_IN);
      }
      return Promise.reject(error);
    }
  );
  axios.interceptors.request.use(function(config: AxiosRequestConfig) {
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
