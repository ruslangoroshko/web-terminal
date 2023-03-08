const AUTH_API_LIST = {
  TRADER: {
    REGISTER: '/auth/v1/Trader/Register',
    AUTHENTICATE: '/auth/v1/Trader/Authenticate',
    CHANGE_PASSWORD: '/auth/v1/Trader/ChangePassword',
    FORGOT_PASSWORD: '/auth/v1/Trader/ForgotPassword',
    PASSWORD_RECOVERY: '/auth/v1/Trader/PasswordRecovery',
    REFRESH_TOKEN: '/auth/v1/Trader/RefreshToken',
    LP_LOGIN: '/auth/v1/Trader/LpLogin',
    ADDITIONAL_FIELDS: '/auth/v1/Trader/AdditionalRegistrationFields',
  },
  PERSONAL_DATA: {
    CONFIRM: '/personaldata/v1/Confirm',
    GET: '/personaldata/v1',
    POST: '/personaldata/v1',
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
