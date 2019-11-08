import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import styled from '@emotion/styled';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { Global, css } from '@emotion/core';
import { reboot } from './styles/reboot';

interface Props {}

function MainApp(props: Props) {
  const {} = props;

  return (
    <>
      <Router>
        <Navbar>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </Navbar>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
        </Switch>
      </Router>
      <Global
        styles={css`
          ${reboot};
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
