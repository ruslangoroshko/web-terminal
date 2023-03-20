const API_LIST = {
  POSITIONS: {
    OPEN: '/api/trading/v1/Positions/Open',
    CLOSE: '/api/trading/v1/Positions/Close',
    UPDATE_SL_TP: '/api/trading/v1/Positions/UpdateTpSl',
    UPDATE_TOPPING_UP: '/api/trading/v1/Positions/UpdateToppingUp',
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
    CANDLES: '/api/candles/v1',
    // CANDLES: '/api/v1/PriceHistory/Candles',
  },
  KEY_VALUE: {
    GET: '/api/keyvalue/v1',
    POST: '/api/keyvalue/v1',
  },
  PENDING_ORDERS: {
    ADD: '/api/v1/PendingOrders/Add',
    REMOVE: '/api/v1/PendingOrders/Remove',
  },
  REPORTS: {
    POSITIONS_HISTORY: '/api/reports/v1/PositionsHistory',
    BALANCE_HISTORY: '/api/reports/v1/BalanceHistory',
  },
  INSTRUMENTS: {
    FAVOURITES: '/api/dict/v1/FavoriteInstruments',
  },
  DEPOSIT: {
    CREATE: '/Create',
    GET_CRYPTO_WALLET: '/GetCryptoWallet',
    CREATE_INVOICE: '/CreatePciDssInvoice',
    CREATE_INVOICE_SWIFFY: '/swiffy/invoice',
    CREATE_INVOICE_DIRECTA: '/directa/invoice',
    CREATE_INVOICE_PAY_RETAILERS: '/payretailers/invoice',
    CREATE_INVOICE_PAYOP: '/payop/invoice',
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
    STEPS: '/v1/OnboardingSteps',
  },
  DEBUG: {
    POST: '/api/Debug/ClientLog',
  },
  WELCOME_BONUS: {
    GET: '/v1/welcomeBonus',
  },
  EDUCATION: {
    LIST: '/v1/educations',
  },
  MT5_ACCOUNTS: {
    GET: '/api/v1/Mt5Accounts',
    POST: '/api/v1/Mt5Accounts',
  },
  ONESIGNAL: {
    SUBSCRIBE: '/v1/oneSignal/subscribe',
  },
};

Object.freeze(API_LIST);

export default API_LIST;
