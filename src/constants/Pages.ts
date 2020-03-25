const Page = {
  DASHBOARD: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  EMAIL_CONFIRMATION: '/confirm/:id',
  PERSONAL_DATA: '/personal-data',
  PHONE_VERIFICATION: '/phone-verification',
  PROOF_OF_IDENTITY: '/proof-of-identity',
  MOBILE_TRADING_VIEW: '/mobile',
  ACCOUNT_PROFILE: '/account-profile',
  ACCOUNT_DEPOSIT: '/account-deposit',
  ACCOUNT_WITHDRAW: '/account-withdraw',
  ACCOUNT_BALANCE_HISTORY: '/account-balance-history',
  ACCOUNT_SETTINGS: '/account-settings',
  ACCOUNT_HISTORY_QUOTES: '/account-history-quotes',
};

Object.freeze(Page);

export default Page;
