import React, { useContext, FunctionComponent } from 'react';
import { Route, Redirect, useLocation } from 'react-router';
import Page from '../constants/Pages';
import { MainAppContext } from '../store/MainAppProvider';

interface IProps {
  component: FunctionComponent<any>;
}

type Props = IProps;

function RouteWrapper(props: Props) {
  const { component: Component } = props;
  const { isAuthorized } = useContext(MainAppContext);
  const location = useLocation();
  if (isAuthorized && location.pathname === Page.SIGN_IN) {
    return <Redirect to={Page.DASHBOARD} />;
  } else if (!isAuthorized && location.pathname !== Page.SIGN_IN) {
    return <Redirect to={Page.SIGN_IN} />;
  }

  return (
    <Route {...props} render={routeProps => <Component {...routeProps} />} />
  );
}

export default RouteWrapper;
