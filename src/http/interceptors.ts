import axios, { AxiosError, AxiosResponse } from 'axios';
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

      switch (error.response?.status) {
        case 400:
        case 500:
          function requestAgain() {
            mainAppStore.rootStore.badRequestPopupStore.setMessage(
              error.response?.statusText || 'error'
            );
            mainAppStore.rootStore.badRequestPopupStore.openModal();
            mainAppStore.isLoading = false;
          }
          setTimeout(requestAgain, +mainAppStore.connectTimeOut);
          mainAppStore.isLoading = false;
          break;

        case 401:
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
          break;

        default:
          break;
      }

      return Promise.reject(error);
    }
  );
};
export default injectInerceptors;
