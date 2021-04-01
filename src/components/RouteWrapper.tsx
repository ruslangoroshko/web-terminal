import React, { FunctionComponent, FC, useEffect } from 'react';
import { Route, Redirect } from 'react-router';
import Page from '../constants/Pages';
import { RouteLayoutType } from '../constants/routesList';
import { observer } from 'mobx-react-lite';
import { useStores } from '../hooks/useStores';
import { LOCAL_STORAGE_IS_NEW_USER } from '../constants/global';
import { unparsingSearchUrl } from '../helpers/unparsingSearchUrl';
import { useLocation, useHistory } from 'react-router-dom';

interface IProps {
  component: FunctionComponent<any>;
  layoutType: RouteLayoutType;
}

type Props = IProps;

const RouteWrapper: FC<Props> = observer((props) => {
  const { component: Component, layoutType, ...otherProps } = props;
  const { mainAppStore } = useStores();
  const location = useLocation();
  const { push } = useHistory();
  const isOldUser = localStorage.getItem(LOCAL_STORAGE_IS_NEW_USER);

  useEffect(() => {
    if (location.search.length > 0 && mainAppStore.isAuthorized) {
      const params = new URLSearchParams(location.search);
      const unParsedData = unparsingSearchUrl(params);
      mainAppStore.setParamsAsset(unParsedData.paramsAsset);
      mainAppStore.setParamsMarkets(unParsedData.paramsMarkets);
      mainAppStore.setParamsPortfolioActive(unParsedData.paramsPortfolioActive);
      mainAppStore.setParamsPortfolioOrder(unParsedData.paramsPortfolioOrder);
      mainAppStore.setParamsPortfolioHistory(unParsedData.paramsPortfolioHistory);
      mainAppStore.setParamsPortfolioTab(unParsedData.paramsPortfolioTab);
      mainAppStore.setParamsDeposit(unParsedData.paramsDeposit);
      if (unParsedData.status === null && mainAppStore.isAuthorized) {
        push(Page.DASHBOARD);
      }
    } else {
      mainAppStore.setParamsPortfolioHistory(null);
    }
  }, []);

  if (layoutType !== RouteLayoutType.Public) {
    if (mainAppStore.isAuthorized && layoutType === RouteLayoutType.SignFlow) {
      return <Redirect to={Page.DASHBOARD} />;
    } else if (
      !mainAppStore.isAuthorized &&
      [RouteLayoutType.Authorized, RouteLayoutType.KYC].includes(layoutType)
    ) {
      console.log(layoutType);
      return <Redirect to={isOldUser ? Page.SIGN_IN : Page.SIGN_UP} />;
    }
  }
  return (
    <Route
      {...otherProps}
      render={(routeProps) => <Component {...routeProps} />}
    />
  );
});

export default RouteWrapper;
