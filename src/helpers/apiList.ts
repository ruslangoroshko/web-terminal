const API_LIST = {
  POSITIONS: {
    OPEN: '/api/v1/Positions/Open',
    CLOSE: '/api/v1/Positions/Close',
  },
  ACCOUNTS: {
    GET_ACCOUNTS: '/api/v1/Accounts',
    GET_ACCOUNT_BY_ID: '/api/v1/Accounts/ById',
    GET_HEADERS: '/api/v1/Headers',
    AUTHENTICATE: '/api/v1/Accounts/Authenticate',
  },
  TRADER: {
    AUTHENTICATE: '/api/v1/Trader/Authenticate',
    REGISTER: '/api/v1/Trader/Register',
  },
  PRICE_HISTORY: {
    CANDLES: '/api/v1/PriceHistory/Candles',
  },
};

Object.freeze(API_LIST);

export default API_LIST;
