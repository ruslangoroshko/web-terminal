const mixpanelEvents = {
    LAST_LOGIN: 'last login',
    LOGIN_VIEW: 'login view',
    LOGIN: 'login',
    SIGN_UP_VIEW: 'sign up view',
    SIGN_UP: 'sign up',
    FIRST_NAME: '$first_name',
    LAST_NAME: '$last_name',
    EMAIL: '$email',
    PHONE: '$phone',
    AVATAR: '$avatar',
    USER_KYC_STATUS: 'user kyc status',
    ACCOUNT_CURRENCY: 'account_currency',
    ACCOUNT_TYPE: 'account_type',
    ACCOUNTS_ALL: 'accounts_all',
    REG_DATE: 'reg_date',
    TOTAL_ACCOUNT_PNL: 'total_account_p&l',
    TOTAL_ACCOUNT_DEPOSITS_NUMBER: 'total_account_deposits_number',
    TOTAL_ACCOUNT_WITHDRAW_NUMBER: 'total_account_withdraw_number',
    TOTAL_ACCOUNT_TRADES_NUMBER: 'total_account_trades_number'
}

Object.freeze(mixpanelEvents);

export default mixpanelEvents;