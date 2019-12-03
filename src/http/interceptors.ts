import axios, { AxiosRequestConfig, AxiosError } from 'axios';

const injectInerceptors = () => {
  axios.interceptors.request.use(
    function(config: AxiosRequestConfig) {
      return config;
    },
    function(error: AxiosError) {
      return Promise.reject(error);
    }
  );
};
export default injectInerceptors;
