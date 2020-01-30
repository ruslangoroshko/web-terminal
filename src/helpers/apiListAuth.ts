const AUTH_API_LIST = {
  TRADER: {
    REGISTER: '/api/v1/Trader/Register',
    AUTHENTICATE: '/api/v1/Trader/Authenticate',
    CHANGE_PASSWORD: '/api/v1/Trader/ChangePassword',
    FORGOT_PASSWORD: '/api/v1/Trader/ForgotPassword',
    PASSWORD_RECOVERY: '/api/v1/Trader/PasswordRecovery',
  },
};

Object.freeze(AUTH_API_LIST);
export default AUTH_API_LIST;
