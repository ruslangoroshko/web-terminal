import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import styled from '@emotion/styled';
import Dashboard from './pages/Dashboard';
import { Global, css } from '@emotion/core';
import { reboot } from './styles/reboot';
import injectInerceptors from './http/interceptors';
import Helmet from 'react-helmet';
import favicon from './assets/images/favicon.ico';
interface Props {}

function MainApp(props: Props) {
  const {} = props;
  injectInerceptors();
  return (
    <>
      <Helmet>
        <link rel="shortcut icon" href={favicon} />
      </Helmet>
      <Router>
        <Switch>
          <Route exact path="/">
            <Dashboard />
          </Route>
        </Switch>
      </Router>
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
