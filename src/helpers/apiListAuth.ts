const AUTH_API_LIST = {
  TRADER: {
    REGISTER: '/api/v1/Trader/Register',
    AUTHENTICATE: '/api/v1/Trader/Authenticate',
    CHANGE_PASSWORD: '/api/v1/Trader/ChangePassword',
    FORGOT_PASSWORD: '/api/v1/Trader/ForgotPassword',
    PASSWORD_RECOVERY: '/api/v1/Trader/PasswordRecovery',
  },
  PERSONAL_DATA: {
    CONFIRM: '/api/v1/PersonalData/Confirm',
    GET: '/api/v1/PersonalData',
    POST: '/api/v1/PersonalData',
    ON_VERIFICATION: '/api/v1/PersonalData/Kyc/OnVerification',
  },
};

Object.freeze(AUTH_API_LIST);
export default AUTH_API_LIST;
