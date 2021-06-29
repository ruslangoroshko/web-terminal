import React, { useEffect, useState, FC } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import TVChartContainer from '../containers/ChartContainer';
import SvgIcon from '../components/SvgIcon';
import IconAddInstrument from '../assets/svg/icon-instrument-add.svg';
import ActiveInstrument from '../components/ActiveInstrument';
import BuySellPanel from '../components/BuySellPanel/BuySellPanel';
import ChartIntervalTimeScale from '../components/Chart/ChartTimeScale';
import ChartSettingsButtons from '../components/Chart/ChartSettingsButtons';
import ChartTimeFomat from '../components/Chart/ChartTimeFomat';
import { useStores } from '../hooks/useStores';
import Toggle from '../components/Toggle';
import AddInstrumentsPopup from '../components/AddInstrumentsPopup';
import { Observer, observer } from 'mobx-react-lite';
import InstrumentsScrollWrapper from '../components/InstrumentsScrollWrapper';
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

const Dashboard: FC = observer(() => {
  const {
    mainAppStore,
    instrumentsStore,
    notificationStore,
    phoneVerificationStore,
    tradingViewStore,
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
          <>{mainAppStore.isDemoRealPopup && !mainAppStore.isOnboarding && !mainAppStore.isPromoAccount && <DemoRealPopup></DemoRealPopup>}</>
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
      <FlexContainer flexDirection="column">
        
      <FavoriteInstrumetsBar />

        <Observer>
          {() => (
            <FlexContainer position="relative">
              {instrumentsStore.activeInstrument && (
                <ActiveInstrument
                  instrument={instrumentsStore.activeInstrument.instrumentItem}
                />
              )}
            </FlexContainer>
          )}
        </Observer>
      </FlexContainer>

      <Observer>
        {() => (
          <>
            {instrumentsStore.activeInstrument && (
              <>
                <FlexContainer
                  width="100%"
                  height="100%"
                  maxHeight={`calc(100vh - ${instrumentsStore.activeInstruments.length !== 0 ? '123px' : '83px'})`}
                >
                  <FlexContainer
                    width="100%"
                    maxWidth="calc(100% - 175px)"
                    maxHeight={`calc(100vh - ${instrumentsStore.activeInstruments.length !== 0 ? '175px' : '135px'})`}
                    flexDirection="column"
                  >
                    <ChartWrapper
                      padding="0 0 0 0"
                      height="100%"
                      maxHeight={`calc(100vh - ${instrumentsStore.activeInstruments.length !== 0 ? '200px' : '160px'})`}
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

                    <ChartInstruments justifyContent="space-between">
                      <ChartSettingsButtons></ChartSettingsButtons>
                      <ChartIntervalTimeScale></ChartIntervalTimeScale>
                      <ChartTimeFomat></ChartTimeFomat>
                    </ChartInstruments>
                  </FlexContainer>

                  <FlexContainer flexDirection="column" width="175px">
                    <BuySellPanel
                      instrument={
                        instrumentsStore.activeInstrument.instrumentItem
                      }
                    ></BuySellPanel>
                  </FlexContainer>
                </FlexContainer>
              </>
            )}
          </>
        )}
      </Observer>
    </FlexContainer>
  );
});

export default Dashboard;



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
