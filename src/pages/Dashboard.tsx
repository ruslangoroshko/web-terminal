import React, { useEffect, useState, FC } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import TVChartContainer from '../containers/ChartContainer';
import ActiveInstrument from '../components/ActiveInstrument';
import BuySellPanel from '../components/BuySellPanel/BuySellPanel';
import ChartIntervalTimeScale from '../components/Chart/ChartTimeScale';
import ChartSettingsButtons from '../components/Chart/ChartSettingsButtons';
import ChartTimeFomat from '../components/Chart/ChartTimeFomat';
import { useStores } from '../hooks/useStores';
import { Observer, observer } from 'mobx-react-lite';
import NotificationPopup from '../components/NotificationPopup';
import DemoRealPopup from '../components/DemoRealPopup';
import { useLocation } from 'react-router-dom';
import StatusPaymentPopup from '../components/DepositPopup/StatusPaymentPopup';
import { useTranslation } from 'react-i18next';
import Helmet from 'react-helmet';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../constants/mixpanelEvents';
import ShouldValidatePhonePopup from '../components/ShouldValidatePhonePopup';
import ConfirmPopup from '../components/ConfirmPopup';
import FavoriteInstrumetsBar from '../components/FavoriteInstrumetsBar';
import HintsWrapper from '../components/Hints/HintsWrapper';

import ImageTerminalBg from '../assets/images/terminal-bg/bg7.jpeg';

const Dashboard: FC = observer(() => {
  const {
    mainAppStore,
    instrumentsStore,
    notificationStore,
    phoneVerificationStore,
    tradingViewStore,
    educationStore,
    depositFundsStore,
  } = useStores();

  const { t } = useTranslation();

  const [paymentStatus, setPaymentStatus] = useState('');
  const location = useLocation();

  useEffect(() => {
    if (location.search) {
      const params = new URLSearchParams(location.search);
      const status = params.get('status');
      if (!mainAppStore.isPromoAccount && status) {
        setPaymentStatus(status);
        if (status === 'failed') {
          mixpanel.track(mixpanelEvents.DEPOSIT_FAILED);
        }
      }
    } else {
      setPaymentStatus('');
    }
  }, [location.search]);

  useEffect(() => {
    // webt-272 is this works?
    window.scrollTo(0, 0);

    return () => {
      depositFundsStore.closePopup();
    };
  }, []);

  return (
    <FlexContainer
      width="100%"
      height="100%"
      flexDirection="column"
      position="relative"
      overflow="hidden"
    >
      <Helmet>
        <title>
          {`${mainAppStore.initModel.brandName} ${t(
            !mainAppStore.isPromoAccount && !mainAppStore.isInitLoading
              ? 'trading platform'
              : ''
          )}`}
        </title>
      </Helmet>
      <Observer>
        {() => (
          <>
            {phoneVerificationStore.shouldValidatePhone && (
              <ShouldValidatePhonePopup></ShouldValidatePhonePopup>
            )}
          </>
        )}
      </Observer>

      <Observer>
        {() => (
          <>
            {mainAppStore.canCheckEducation &&
              !mainAppStore.isPromoAccount &&
              educationStore.educationHint !== null &&
              !mainAppStore.isDemoRealPopup &&
              !phoneVerificationStore.shouldValidatePhone &&
              !depositFundsStore.isActivePopup && (
                <HintsWrapper hintType={educationStore.educationHint} />
              )}
          </>
        )}
      </Observer>

      <Observer>
        {() => (
          <>
            {mainAppStore.isDemoRealPopup &&
              !mainAppStore.isOnboarding &&
              !mainAppStore.isPromoAccount &&
              !mainAppStore.isLoading && <DemoRealPopup></DemoRealPopup>}
          </>
        )}
      </Observer>
      {!!paymentStatus && (
        <StatusPaymentPopup status={paymentStatus}></StatusPaymentPopup>
      )}
      <FlexContainer
        position="absolute"
        bottom="100px"
        left="14px"
        zIndex="1005"
      >
        <Observer>
          {() => (
            <NotificationPopup
              show={
                notificationStore.isActiveNotification &&
                !notificationStore.isActiveNotificationGlobal
              }
            ></NotificationPopup>
          )}
        </Observer>
      </FlexContainer>

      <FlexContainer
        width="100%"
        height="100%"
        maxHeight="calc(100vh - 48px)"
        flex="1"
      >
        <TerminalWrap width="100%" flex="1" flexDirection="column">
          <FlexContainer flexDirection="column" zIndex="10">
            <FavoriteInstrumetsBar />
            <FlexContainer position="relative">
              {instrumentsStore.activeInstrument && (
                <ActiveInstrument
                  instrument={instrumentsStore.activeInstrument.instrumentItem}
                />
              )}
            </FlexContainer>
          </FlexContainer>

          {instrumentsStore.activeInstrument && (
            <FlexContainer
              width="100%"
              flex="1"
              flexDirection="column"
              zIndex="9"
            >
              <ChartWrapper
                padding="0 0 0 0"
                height="100%"
                maxHeight="calc(100vh - 200px)"
                minHeight="445px"
                position="relative"
              >
                {tradingViewStore.activePositionPopup && (
                  <ClosePopupWrapper>
                    <ConfirmPopup
                      toggle={tradingViewStore.toggleActivePositionPopup}
                      applyHandler={tradingViewStore.applyHandler}
                      confirmText={t(tradingViewStore?.confirmText)}
                    ></ConfirmPopup>
                  </ClosePopupWrapper>
                )}
                <TVChartContainer
                  instrumentId={
                    instrumentsStore.activeInstrument.instrumentItem.id
                  }
                  instruments={instrumentsStore.instruments}
                />
              </ChartWrapper>

              <ChartInstruments
                justifyContent="space-between"
                padding="0 0 0 52px"
              >
                {/* <ChartSettingsButtons></ChartSettingsButtons> */}
                <ChartIntervalTimeScale></ChartIntervalTimeScale>
                <ChartTimeFomat></ChartTimeFomat>
              </ChartInstruments>
            </FlexContainer>
          )}
        </TerminalWrap>

        <FlexContainer
          flexDirection="column"
          width="320px"
          maxHeight="calc(100vh - 48px)"
          justifyContent="center"
        >
          {instrumentsStore.activeInstrument && (
            <BuySellPanel
              instrument={instrumentsStore.activeInstrument.instrumentItem}
            />
          )}
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
});

export default Dashboard;

const TerminalWrap = styled(FlexContainer)`
  position: relative;
  z-index: 0;
  &:before,
  &:after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  &:before {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    background-image: ${`url(${ImageTerminalBg})`};
    z-index: -1;
  }

  &:after {
    z-index: 0;
    background-color: rgba(37, 38, 54, 0.9);
  }
`;

const ChartWrapper = styled(FlexContainer)`
  grid-row: 1 / span 1;
  grid-column: 1 / span 1;
`;

const ChartInstruments = styled(FlexContainer)`
  grid-row: 2 / span 1;
  grid-column: 1 / span 1;
`;

const ClosePopupWrapper = styled(FlexContainer)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
