import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import styled from '@emotion/styled';
import Dashboard from './pages/Dashboard';
import { Global, css } from '@emotion/core';
import { reboot } from './styles/reboot';
import injectInerceptors from './http/interceptors';
import Helmet from 'react-helmet';
import favicon from './assets/images/favicon.ico';
import { HubConnection } from '@aspnet/signalr';
import initConnection from './services/websocketService';
interface Props {}

function MainApp(props: Props) {
  const {} = props;
  injectInerceptors();

  const [isLoading, setIsLoading] = useState(true);
  const [activeSession, setActiveSession] = useState<HubConnection>();

  const handleInitConnection = () => {
    const connection = initConnection(WS_HOST);
    connection.start().then(() => {
      setActiveSession(connection);
      setIsLoading(false);
    });
    connection.onclose(error => {
      console.log(error);
    });
  };

  useEffect(() => {
    handleInitConnection();
  }, []);

  const renderRoutes = () => {
    if (isLoading) {
      return null;
    }

    return (
      <Switch>
        <Route
          exact
          path="/"
          render={renderProps => (
            <Dashboard {...renderProps} activeSession={activeSession!} />
          )}
        />
      </Switch>
    );
  };

  return (
    <>
      <Helmet>
        <link rel="shortcut icon" href={favicon} />
      </Helmet>
      <Router>{isLoading ? null : renderRoutes()}</Router>
      <Global
        styles={css`
          ${reboot};

          html {
            font-size: 14px;
            line-height: 1.4;
          }
        `}
      />
    </>
  );
}

export default MainApp;

const Navbar = styled.ul`
  background-color: wheat;
  margin: 0;
`;
