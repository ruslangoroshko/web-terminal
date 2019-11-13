import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import styled from '@emotion/styled';
import Dashboard from './pages/Dashboard';
import { Global, css } from '@emotion/core';
import { reboot } from './styles/reboot';
import injectInerceptors from './http/interceptors';

interface Props {}

function MainApp(props: Props) {
  const {} = props;
  injectInerceptors();
  return (
    <>
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
