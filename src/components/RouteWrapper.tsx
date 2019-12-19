import React, { useContext, FunctionComponent } from 'react';
import { Route, Redirect } from 'react-router';
import Page from '../constants/Pages';
import { MainAppContext } from '../store/MainAppProvider';
import { RouteLayoutType } from '../constants/routesList';

interface IProps {
  component: FunctionComponent<any>;
  layoutType: RouteLayoutType;
}

type Props = IProps;

function RouteWrapper(props: Props) {
  const { component: Component, layoutType, ...otherProps } = props;
  const { isAuthorized } = useContext(MainAppContext);
  if (isAuthorized && layoutType === RouteLayoutType.SignUp) {
    return <Redirect to={Page.DASHBOARD} />;
  } else if (!isAuthorized && layoutType === RouteLayoutType.Authorized) {
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
