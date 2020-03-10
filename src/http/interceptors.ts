import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { appHistory } from '../routing/history';
import Page from '../constants/Pages';

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
};
export default injectInerceptors;
