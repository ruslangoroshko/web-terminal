import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { appHistory } from '../routing/history';
import Page from '../constants/Pages';

const injectInerceptors = () => {
  axios.interceptors.request.use(
    function(config: AxiosRequestConfig) {
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
};
export default injectInerceptors;
