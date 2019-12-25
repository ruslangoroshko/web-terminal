import React, { FC } from 'react';
import routesList, { RouteLayoutType } from '../constants/routesList';
import RouteWrapper from '../components/RouteWrapper';
import { useLocation } from 'react-router-dom';
import AuthorizedContainer from '../containers/AuthorizedContainer';
import { FlexContainer } from '../styles/FlexContainer';
import { observer, Observer } from 'mobx-react-lite';

const RoutingLayout: FC = observer(() => {
  const location = useLocation();
  
  const allRoutes = routesList.map(route => (
    <Observer key={route.path}>{() => <RouteWrapper {...route} />}</Observer>
  ));

  const currentRoute = routesList.find(item => location.pathname === item.path);

  let layoutType = RouteLayoutType.SignUp;

  if (currentRoute) {
    layoutType = currentRoute.layoutType;
  }
  console.log(layoutType);
  switch (layoutType) {
    case RouteLayoutType.Authorized:
      return <AuthorizedContainer>{allRoutes}</AuthorizedContainer>;

    case RouteLayoutType.SignUp:
      return (
        <FlexContainer height="100vh" width="100%">
          {allRoutes}
        </FlexContainer>
      );

    default:
      return (
        <FlexContainer height="100vh" width="100%">
          {allRoutes}
        </FlexContainer>
      );
  }
});

export default RoutingLayout;
