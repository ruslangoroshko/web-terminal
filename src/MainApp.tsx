import React, { useEffect, FC } from 'react';
import { Global, css } from '@emotion/core';
import { reboot } from './styles/reboot';
import Helmet from 'react-helmet';
import RoutingLayout from './routing/RoutingLayout';
import { BrowserRouter as Router } from 'react-router-dom';
import { slickSliderStyles } from './styles/slickSlider';
import 'react-dates/lib/css/_datepicker.css';
import reactDatePickerOverrides from './styles/react-date-picker-overrides';
import { useStores } from './hooks/useStores';
import NetworkErrorPopup from './components/NetworkErrorPopup';
import SocketErrorPopup from './components/SocketErrorPopup';
import { useTranslation } from 'react-i18next';
import { autorun } from 'mobx';
import { logger } from './helpers/ConsoleLoggerTool';
import OneSignal from 'react-onesignal';

declare const window: any;

const MainApp: FC = () => {
  const { mainAppStore } = useStores();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    window.stopPongDebugMode = function () {
      logger('DEBUG: Stop listen pong');
      mainAppStore.debugSocketMode = true;
    };

    window.stopPingDebugMode = function () {
      logger('DEBUG: Stop send ping');
      mainAppStore.debugDontPing = true;
    };

    window.startSocketInitError = function () {
      logger('DEBUG: Open connection has error');
      mainAppStore.debugSocketReconnect = true;
    };

    window.stopSocketInitError = function () {
      logger('DEBUG: Stop Socket Init Error');
      mainAppStore.debugSocketReconnect = false;
    };

    window.debugSocketServerError = () => {
      logger('DEBUG: Test servererror message');
      const response = {
        data: { reason: 'Test Server error' },
        now: 'test',
      };
      mainAppStore.handleSocketServerError(response);
    };

    window.debugSocketCloseError = () => {
      logger('DEBUG: Stop Socket with Error');
      mainAppStore.handleSocketCloseError(Error('Socket close error'));
    };

    autorun(() => {
      if (mainAppStore.lang) {
        i18n.changeLanguage(mainAppStore.lang);
      }
    });
  }, []);

  useEffect(() => {
    OneSignal.init({
      appId: "6cebaf4d-407b-491e-acb3-65a27855c428"
    });
  }, []);

  return (
    <>
      <NetworkErrorPopup />
      <SocketErrorPopup />
      <Helmet>
        <link rel="shortcut icon" href={mainAppStore.initModel.favicon} />
        <script
          src={`https://www.google.com/recaptcha/api.js?render=${mainAppStore.initModel.recaptchaToken}`}
        ></script>
      </Helmet>
      <Router>
        <RoutingLayout></RoutingLayout>
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
            overflow: hidden;
          }

          .grecaptcha-badge {
            visibility: hidden;
          }

          .input-border {
            border: 1px solid #494b50;
            &.error {
              border-color: #ed145b !important;
            }
          }

          ${reactDatePickerOverrides};
        `}
      />
    </>
  );
};

export default MainApp;
