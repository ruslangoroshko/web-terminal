import React from 'react';
import routesList, { RouteLayoutType } from '../constants/routesList';
import RouteWrapper from '../components/RouteWrapper';
import { useLocation, matchPath, Switch } from 'react-router-dom';
import AuthorizedContainer from '../containers/AuthorizedContainer';
import { FlexContainer } from '../styles/FlexContainer';
import KYCcontainer from '../containers/KYCcontainer';
import { useStores } from '../hooks/useStores';
import LoaderFullscreen from '../components/LoaderFullscreen';
import { Observer } from 'mobx-react-lite';

const RoutingLayout = () => {
  const location = useLocation();
  const { mainAppStore } = useStores();

  const allRoutes = routesList.map(route => (
    <RouteWrapper key={route.path} {...route} />
  ));
  const currentRoute = routesList.find(item => {
    const match = matchPath(location.pathname, item.path);
    return match && match.isExact;
  });

  let layoutType = RouteLayoutType.Page404;

  if (currentRoute) {
    layoutType = currentRoute.layoutType;
  }

  switch (layoutType) {
    case RouteLayoutType.Authorized:
      return (
        <AuthorizedContainer>
          <Observer>
            {() => (
              <>
                {!mainAppStore.isInitLoading && <Switch>{allRoutes}</Switch>}
                <LoaderFullscreen
                  isLoading={mainAppStore.isInitLoading}
                ></LoaderFullscreen>
              </>
            )}
          </Observer>
        </AuthorizedContainer>
      );

    case RouteLayoutType.SignFlow:
      return (
        <FlexContainer height="100vh" width="100%">
          <Observer>
            {() => (
              <>
                {!mainAppStore.isInitLoading && <Switch>{allRoutes}</Switch>}
                <LoaderFullscreen
                  isLoading={mainAppStore.isInitLoading}
                ></LoaderFullscreen>
              </>
            )}
          </Observer>
        </FlexContainer>
      );

    case RouteLayoutType.KYC:
      return (
        <KYCcontainer>
          <Observer>
            {() => (
              <>
                {!mainAppStore.isInitLoading && <Switch>{allRoutes}</Switch>}
                <LoaderFullscreen
                  isLoading={mainAppStore.isInitLoading}
                ></LoaderFullscreen>
              </>
            )}
          </Observer>
        </KYCcontainer>
      );

    default:
      return (
        <FlexContainer height="100vh" width="100%">
          <Observer>
            {() => (
              <>
                {!mainAppStore.isInitLoading && <Switch>{allRoutes}</Switch>}
                <LoaderFullscreen
                  isLoading={mainAppStore.isInitLoading}
                ></LoaderFullscreen>
              </>
            )}
          </Observer>
        </FlexContainer>
      );
  }
};

export default RoutingLayout;
