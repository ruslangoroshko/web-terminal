export const unparsingSearchUrl = (searchUrl: URLSearchParams) => {
  return {
    paramsAsset: searchUrl.get('asset'),
    paramsMarkets: searchUrl.get('markets'),
    paramsPortfolioTab: searchUrl.get('portfolio'),
    paramsPortfolioActive: searchUrl.get('portfolioActive'),
    paramsPortfolioOrder: searchUrl.get('portfolioPending'),
    paramsPortfolioHistory: searchUrl.get('portfolioClosed'),
    paramsWithdraw: searchUrl.get('withdraw') !== null,
    paramsBalanceHistory: searchUrl.get('balanceHistory') !== null,
    paramsDeposit: searchUrl.get('deposit') !== null,
    paramsSettings: searchUrl.get('settings') !== null,
    paramsKYC: searchUrl.get('KYC') !== null
  };
};
