import React from 'react';
import routesList, { RouteLayoutType } from '../constants/routesList';
import RouteWrapper from '../components/RouteWrapper';
import { useLocation, matchPath, Switch } from 'react-router-dom';
import AuthorizedContainer from '../containers/AuthorizedContainer';
import { FlexContainer } from '../styles/FlexContainer';

const RoutingLayout = () => {
  const location = useLocation();

  const allRoutes = routesList.map(route => (
    <RouteWrapper key={route.path} {...route} />
  ));
  const currentRoute = routesList.find(item => {
    const match = matchPath(location.pathname, item.path);
    return match && match.isExact;
  });
  console.log('TCL: RoutingLayout -> location.pathname', location.pathname);
  console.log('TCL: RoutingLayout -> currentRoute', currentRoute);

  let layoutType = RouteLayoutType.Page404;

  if (currentRoute) {
    layoutType = currentRoute.layoutType;
  }

  switch (layoutType) {
    case RouteLayoutType.Authorized:
      return (
        <AuthorizedContainer>
          <Switch>{allRoutes}</Switch>
        </AuthorizedContainer>
      );

    case RouteLayoutType.SignFlow:
      return (
        <FlexContainer height="100vh" width="100%">
          <Switch>{allRoutes}</Switch>
        </FlexContainer>
      );

    default:
      return (
        <FlexContainer height="100vh" width="100%">
          <Switch>{allRoutes}</Switch>
        </FlexContainer>
      );
  }
};

export default RoutingLayout;
