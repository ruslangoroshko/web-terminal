import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { appHistory } from '../routing/history';
import Page from '../constants/Pages';
import { LOCAL_STORAGE_TRADING_URL } from '../constants/global';

const injectInerceptors = () => {
  axios.interceptors.response.use(
    function(config: AxiosResponse) {
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
    const tradingUrl = localStorage.getItem(LOCAL_STORAGE_TRADING_URL);

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
