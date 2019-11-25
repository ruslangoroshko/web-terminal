import React from 'react';
import { Global, css } from '@emotion/core';
import { reboot } from './styles/reboot';
import injectInerceptors from './http/interceptors';
import Helmet from 'react-helmet';
import favicon from './assets/images/favicon.ico';
import RoutingLayout from './routing/RoutingLayout';

interface Props {}

function MainApp(props: Props) {
  const {} = props;
  injectInerceptors();

  return (
    <>
      <Helmet>
        <link rel="shortcut icon" href={favicon} />
      </Helmet>
      <RoutingLayout></RoutingLayout>
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
