import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import RequestHeaders from '../constants/headers';

const injectInerceptors = () => {
  axios.interceptors.request.use(
    function(config: AxiosRequestConfig) {
      // config.headers[
      //   RequestHeaders.AUTHORIZATION
      // ] = `Bearer ntwBx1TIP/X8GJcbIAVoYVLCPwOmVjMYKxalHLUu8H/4AGy3ttCiWygi0TrvzNwGuE5GVdVHhAk92WcSOzPiJg==`;
      return config;
    },
    function(error: AxiosError) {
      return Promise.reject(error);
    }
  );
};
export default injectInerceptors;
