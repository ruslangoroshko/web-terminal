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
import { Observer } from 'mobx-react-lite';
import NetworkErrorPopup from './components/NetworkErrorPopup';
import { useTranslation } from 'react-i18next';
import { autorun } from 'mobx';

const MainApp: FC = () => {
  const { mainAppStore } = useStores();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    mainAppStore.handleInitConnection();
  }, []);

  useEffect(() => {
    autorun(() => {
      if (mainAppStore.lang) {
        i18n.changeLanguage(mainAppStore.lang);
      }
    });
  }, []);

  return (
    <>
      <NetworkErrorPopup />
      <Helmet>
        <title>{`${mainAppStore.initModel.brandName} ${t(
          'trading platform'
        )}`}</title>
        <link rel="shortcut icon" href={mainAppStore.initModel.favicon} />
        <script
          src={`https://www.google.com/recaptcha/api.js?render=${mainAppStore.initModel.recaptchaToken}`}
        ></script>
      </Helmet>
      <Observer>
        {() => (
          <>
            {mainAppStore.isInitLoading && (
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
