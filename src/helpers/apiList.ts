const API_LIST = {
  POSITIONS: {
    OPEN: '/api/v1/Positions/Open',
    CLOSE: '/api/v1/Positions/Close',
    UPDATE_SL_TP: '/api/v1/Positions/UpdateTpSl',
    UPDATE_TOPPING_UP: '/api/v1/Positions/UpdateToppingUp',
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
  KEY_VALUE: {
    GET: '/api/v1/KeyValue',
    POST: '/api/v1/KeyValue',
  },
  PENDING_ORDERS: {
    ADD: '/api/v1/PendingOrders/Add',
    REMOVE: '/api/v1/PendingOrders/Remove',
  },
  REPORTS: {
    POSITIONS_HISTORY: '/api/v1/Reports/PositionsHistory',
    BALANCE_HISTORY: '/api/v1/Reports/BalanceHistory',
  },
  INSTRUMENTS: {
    FAVOURITES: '/api/v1/Instruments/Favorites',
  },
  DEPOSIT: {
    CREATE: '/Create',
    GET_CRYPTO_WALLET: '/GetCryptoWallet',
    CREATE_INVOICE: '/CreatePciDssInvoice',
    CREATE_INVOICE_SWIFFY: '/swiffy/invoice',
    CREATE_INVOICE_DIRECTA: '/directa/invoice',
    CREATE_INVOICE_PAY_RETAILERS: '/payretailers/invoice',
    CREATE_INVOICE_VOLT: '/volt/invoice',
    CHECK_PAYMENT_SYSTEMS: '/supported-payment-systems',
  },
  INIT: {
    GET: '/init/',
  },
  WITHWRAWAL: {
    CREATE: '/withdrawal/create',
    HISTORY: '/withdrawal/history',
    CANCEL: '/withdrawal/cancel',
  },
  ONBOARDING: {
    STEPS: '/v1/OnboardingSteps'
  },
  DEBUG: {
    POST: '/api/Debug/ClientLog',
  },
};

Object.freeze(API_LIST);

export default API_LIST;
