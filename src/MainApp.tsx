import React from 'react';
import { Global, css } from '@emotion/core';
import { reboot } from './styles/reboot';
import injectInerceptors from './http/interceptors';
import Helmet from 'react-helmet';
import favicon from './assets/images/favicon.ico';
import RoutingLayout from './routing/RoutingLayout';
import { Router, Switch } from 'react-router-dom';
import { appHistory } from './routing/history';

interface Props {}

function MainApp(props: Props) {
  const {} = props;
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
          ${reboot};
          @import url('https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap&subset=cyrillic,cyrillic-ext');
          html {
            font-size: 14px;
            line-height: 1.4;
          }
          .group-wWM3zP_M- {
            background: red !important;
          }
        `}
      />
    </>
  );
}

export default MainApp;
