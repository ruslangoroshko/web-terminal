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
        debugger;
        appHistory.push(Page.SIGN_IN);
      }
      return Promise.reject(error);
    }
  );
  axios.interceptors.request.use(function(config: AxiosRequestConfig) {
    const traditngUrl = localStorage.getItem(LOCAL_STORAGE_TRADING_URL);
    if (IS_LIVE && traditngUrl) {
      if (!config.url) {
        config.url = traditngUrl;
      } else {
        if (config.url.includes('://')) {
          const arrayOfSubpath = config.url.split('://')[1].split('/');
          const subPath = arrayOfSubpath.slice(1).join('/');
          config.url = `${traditngUrl}/${subPath}`;
        } else {
          config.url = `${traditngUrl}${config.url}`;
        }
      }
    }
    return config;
  });
};
export default injectInerceptors;
