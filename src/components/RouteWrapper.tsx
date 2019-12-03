import React, { useContext, FunctionComponent } from 'react';
import { Route, Redirect } from 'react-router';
import Page from '../constants/Pages';
import { MainAppContext } from '../store/MainAppProvider';

interface IProps {
  component: FunctionComponent<any>;
  authRequired: boolean;
}

type Props = IProps;

function RouteWrapper(props: Props) {
  const { component: Component, authRequired, ...otherProps } = props;
  const { isAuthorized } = useContext(MainAppContext);
  if (isAuthorized && !authRequired) {
    return <Redirect to={Page.DASHBOARD} />;
  } else if (!isAuthorized && authRequired) {
    return <Redirect to={Page.SIGN_IN} />;
  }

  return (
    <Route
      {...otherProps}
      render={routeProps => <Component {...routeProps} />}
    />
  );
}

export default RouteWrapper;
