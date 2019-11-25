const API_LIST = {
  POSITIONS: {
    OPEN: '/Positions/Open',
    CLOSE: '/Positions/Close',
  },
  ACCOUNTS: {
    GET_ACCOUNTS: '/Accounts',
    GET_ACCOUNT_BY_ID: '/Accounts/ById',
    GET_HEADERS: '/Headers',
    AUTHENTICATE: '/Accounts/Authenticate',
  },
};

Object.freeze(API_LIST);

export default API_LIST;
