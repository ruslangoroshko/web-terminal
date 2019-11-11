const API_LIST = {
  POSITIONS: {
    OPEN: '/api/Positions/Open',
    CLOSE: '/api/Positions/Close',
  },
  ACCOUNTS: {
    GET_ACCOUNTS: '/api/Accounts',
    GET_ACCOUNT_BY_ID: '/api/Accounts/ById',
    GET_HEADERS: '/api/Headers',
  },
};

Object.freeze(API_LIST);

export default API_LIST;
