const AUTH_API_LIST = {
  TRADER: {
    REGISTER: '/api/auth/v1/Trader/Register',
    AUTHENTICATE: '/api/auth/v1/Trader/Authenticate',
    CHANGE_PASSWORD: '/api/auth/v1/Trader/ChangePassword',
    FORGOT_PASSWORD: '/api/auth/v1/Trader/ForgotPassword',
    PASSWORD_RECOVERY: '/api/auth/v1/Trader/PasswordRecovery',
    REFRESH_TOKEN: '/api/auth/v1/Trader/RefreshToken',
    LP_LOGIN: '/api/auth/v1/Trader/LpLogin',
    ADDITIONAL_FIELDS: '/api/auth/v1/Trader/AdditionalRegistrationFields',
  },
  PERSONAL_DATA: {
    CONFIRM: '/api/personaldata/v1/Confirm',
    GET: '/api/personaldata/v1',
    POST: '/api/personaldata/v1',
    ON_VERIFICATION: '/personaldata/v1/OnVerification',
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
