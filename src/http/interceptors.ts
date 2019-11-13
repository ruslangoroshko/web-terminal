import axios from 'axios';

const injectInerceptors = () => {
  axios.interceptors.request.use(
    function(config) {
      config.headers['Authorization'] = `Bearer ${AUTH_TOKEN}`;
      return config;
    },
    function(error) {
      return Promise.reject(error);
    }
  );
};
export default injectInerceptors;
