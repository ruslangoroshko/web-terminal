import React from 'react';
import { Global, css } from '@emotion/core';
import { reboot } from './styles/reboot';
import injectInerceptors from './http/interceptors';
import Helmet from 'react-helmet';
import favicon from './assets/images/favicon.ico';
import RoutingLayout from './routing/RoutingLayout';
import { Router, Switch } from 'react-router-dom';
import { appHistory } from './routing/history';
import { slickSliderStyles } from './styles/slickSlider';

const MainApp = () => {
  injectInerceptors();

  return (
    <>
      <Helmet>
        <link rel="shortcut icon" href={favicon} />
      </Helmet>
      <Router history={appHistory}>
        <Switch>
          <RoutingLayout></RoutingLayout>
        </Switch>
      </Router>
      <Global
        styles={css`
          @import url('https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap&subset=cyrillic,cyrillic-ext');
          ${reboot};
          ${slickSliderStyles};
          html {
            font-size: 14px;
            line-height: 1.4;
            font-family: 'Roboto', sans-serif;
          }

          body {
            background-color: #1c2026;
          }
        `}
      />
    </>
  );
};

export default MainApp;
