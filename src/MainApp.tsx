import React, { useState, useEffect } from 'react';
import { Global, css } from '@emotion/core';
import { reboot } from './styles/reboot';
import injectInerceptors from './http/interceptors';
import Helmet from 'react-helmet';
import favicon from './assets/images/favicon.ico';
import RoutingLayout from './routing/RoutingLayout';
import { BrowserRouter as Router } from 'react-router-dom';
import { slickSliderStyles } from './styles/slickSlider';
import 'react-dates/lib/css/_datepicker.css';
import reactDatePickerOverrides from './styles/react-date-picker-overrides';
import LoaderFullscreen from './components/LoaderFullscreen';
import API from './helpers/API';
import { useStores } from './hooks/useStores';

const MainApp = () => {
  const [tradingUrl, setTradingUrl] = useState('');

  const { mainAppStore } = useStores();

  useEffect(() => {
    async function fetchTradingUrl() {
      try {
        const response = await API.getTradingUrl();
        mainAppStore.setTradingUrl(response.tradingUrl);
        injectInerceptors(response.tradingUrl);
        mainAppStore.handleInitConnection();
      } catch (error) {
        mainAppStore.setTradingUrl('/');
        setTradingUrl('/');
      }
    }
    if (IS_LIVE) {
      fetchTradingUrl();
    } else {
      setTradingUrl('/');
      mainAppStore.setTradingUrl('/');
      mainAppStore.handleInitConnection();
    }
  }, []);

  return (
    <>
      <LoaderFullscreen isLoading={!tradingUrl} />
      <Helmet>
        <link rel="shortcut icon" href={favicon} />
      </Helmet>
      {!!tradingUrl && (
        <Router>
          <RoutingLayout></RoutingLayout>
        </Router>
      )}
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

          ${reactDatePickerOverrides}
        `}
      />
    </>
  );
};

export default MainApp;
