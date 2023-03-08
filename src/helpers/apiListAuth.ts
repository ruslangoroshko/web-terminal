const AUTH_API_LIST = {
  TRADER: {
    REGISTER: '/api/auth/v1/Register',
    AUTHENTICATE: '/api/auth/v1/Authenticate',
    CHANGE_PASSWORD: '/api/auth/v1/ChangePassword',
    FORGOT_PASSWORD: '/api/auth/v1/ForgotPassword',
    PASSWORD_RECOVERY: '/api/auth/v1/PasswordRecovery',
    REFRESH_TOKEN: '/api/auth/v1/RefreshToken',
    LP_LOGIN: '/api/auth/v1/LpLogin',
    ADDITIONAL_FIELDS: '/api/personaldata/v1/AdditionalFields',
  },
  PERSONAL_DATA: {
    CONFIRM: '/api/personaldata/v1/Confirm',
    GET: '/api/personaldata/v1',
    POST: '/api/personaldata/v1',
    ON_VERIFICATION: '/api/personaldata/v1/OnVerification',
  },
  COMMON: {
    COUNTRIES: '/api/common/v1/Countries',
    SERVER_INFO: '/api/common/v1/ServerInfo',
    GEOLOCATION_INFO: '/api/common/v1/GeolocationInfo',
  },
  DOCUMENT: {
    POST: '/auth/v1/Documents/Identity',
  },
};

Object.freeze(AUTH_API_LIST);
export default AUTH_API_LIST;
