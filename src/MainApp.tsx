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

const MainApp: FC = () => {
  const { mainAppStore } = useStores();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    mainAppStore.handleInitConnection();
  }, [mainAppStore.isLoading]);

  useEffect(() => {
    if (typeof Node === 'function' && Node.prototype) {
      const originalRemoveChild = Node.prototype.removeChild;
      Node.prototype.removeChild = function(child) {
        if (child.parentNode !== this) {
          if (console) {
            console.error('Cannot remove a child from a different parent', child, this);
          }
          return child;
        }
        // @ts-ignore
        return originalRemoveChild.apply(this, arguments);
      }

      const originalInsertBefore = Node.prototype.insertBefore;
      Node.prototype.insertBefore = function(newNode, referenceNode) {
        if (referenceNode && referenceNode.parentNode !== this) {
          if (console) {
            console.error('Cannot insert before a reference node from a different parent', referenceNode, this);
          }
          return newNode;
        }
        // @ts-ignore
        return originalInsertBefore.apply(this, arguments);
      }
    }

    autorun(() => {
      if (mainAppStore.lang) {
        i18n.changeLanguage(mainAppStore.lang);
      }
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
