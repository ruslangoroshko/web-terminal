import React, { useEffect } from 'react';
import { Global, css } from '@emotion/core';
import { reboot } from './styles/reboot';
import Helmet from 'react-helmet';
import RoutingLayout from './routing/RoutingLayout';
import { BrowserRouter as Router } from 'react-router-dom';
import { slickSliderStyles } from './styles/slickSlider';
import 'react-dates/lib/css/_datepicker.css';
import reactDatePickerOverrides from './styles/react-date-picker-overrides';
import LoaderFullscreen from './components/LoaderFullscreen';
import { useStores } from './hooks/useStores';
import { Observer } from 'mobx-react-lite';
import injectInerceptors from './http/interceptors';

const MainApp = () => {
  const { mainAppStore } = useStores();

  useEffect(() => {
    if (IS_LIVE) {
      mainAppStore.fetchTradingUrl();
    } else {
      mainAppStore.setTradingUrl('/');
      injectInerceptors('/', mainAppStore);
      mainAppStore.handleInitConnection();
    }
  }, [mainAppStore.isAuthorized]);

  useEffect(() => {
    document.title = `${mainAppStore.initModel.brandName} trading platform`;
  }, []);

  return (
    <>
      <Observer>
        {() => <LoaderFullscreen isLoading={!mainAppStore.tradingUrl} />}
      </Observer>
      <Helmet>
        <link rel="shortcut icon" href={mainAppStore.initModel.favicon} />
      </Helmet>
      <Observer>
        {() => (
          <>
            {!!mainAppStore.tradingUrl && (
              <Router>
                <RoutingLayout></RoutingLayout>
              </Router>
            )}
          </>
        )}
      </Observer>

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
            overflow-y: hidden;

            @media (max-height: 700px) {
              overflow-y: auto;
            }
          }

          .grecaptcha-badge {
            visibility: hidden;
          }

          ${reactDatePickerOverrides};
        `}
      />
    </>
  );
};

export default MainApp;
