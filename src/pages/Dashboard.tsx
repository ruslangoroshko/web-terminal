import React, { useEffect, useState, FC } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { ResponseFromWebsocket } from '../types/ResponseFromWebsocket';
import Topics from '../constants/websocketTopics';
import TVChartContainer from '../containers/ChartContainer';
import {
  InstrumentModelWSDTO,
  PriceChangeWSDTO,
} from '../types/InstrumentsTypes';
import { PositionModelWSDTO } from '../types/Positions';
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
import { PendingOrderWSDTO } from '../types/PendingOrdersTypes';
import { useLocation } from 'react-router-dom';
import StatusPaymentPopup from '../components/DepositPopup/StatusPaymentPopup';
import { useTranslation } from 'react-i18next';

// TODO: refactor dashboard observer to small Observers (isLoading flag)

const Dashboard: FC = observer(() => {
  const {
    mainAppStore,
    quotesStore,
    instrumentsStore,
    notificationStore,
  } = useStores();

  const { t, i18n } = useTranslation();

  const [paymentStatus, setPaymentStatus] = useState('');
  const location = useLocation();

  useEffect(() => {
    if (mainAppStore.activeAccount) {
      mainAppStore.activeSession?.on(
        Topics.ACTIVE_POSITIONS,
        (response: ResponseFromWebsocket<PositionModelWSDTO[]>) => {
          if (response.accountId === mainAppStore.activeAccount?.id) {
            quotesStore.activePositions = response.data;
          }
        }
      );

      mainAppStore.activeSession?.on(
        Topics.PENDING_ORDERS,
        (response: ResponseFromWebsocket<PendingOrderWSDTO[]>) => {
          if (mainAppStore.activeAccount?.id === response.accountId) {
            quotesStore.pendingOrders = response.data;
          }
        }
      );

      mainAppStore.activeSession?.on(
        Topics.INSTRUMENT_GROUPS,
        (response: ResponseFromWebsocket<InstrumentModelWSDTO[]>) => {
          if (mainAppStore.activeAccount?.id === response.accountId) {
            instrumentsStore.instrumentGroups = response.data;
            if (response.data.length) {
              instrumentsStore.activeInstrumentGroupId = response.data[0].id;
            }
          }
        }
      );

      mainAppStore.activeSession?.on(
        Topics.PRICE_CHANGE,
        (response: ResponseFromWebsocket<PriceChangeWSDTO[]>) => {
          instrumentsStore.setPricesChanges(response.data);
        }
      );

      mainAppStore.activeSession?.on(
        Topics.UPDATE_ACTIVE_POSITION,
        (response: ResponseFromWebsocket<PositionModelWSDTO>) => {
          if (response.accountId === mainAppStore.activeAccount?.id) {
            quotesStore.activePositions = quotesStore.activePositions.map(
              item => (item.id === response.data.id ? response.data : item)
            );
          }
        }
      );

      mainAppStore.activeSession?.on(
        Topics.UPDATE_PENDING_ORDER,
        (response: ResponseFromWebsocket<PendingOrderWSDTO>) => {
          if (response.accountId === mainAppStore.activeAccount?.id) {
            quotesStore.pendingOrders = quotesStore.pendingOrders.map(item =>
              item.id === response.data.id ? response.data : item
            );
          }
        }
      );
    }
  }, [mainAppStore.activeAccount]);

  useEffect(() => {
    if (location.search) {
      const params = new URLSearchParams(location.search);
      const status = params.get('status');
      if (status) {
        setPaymentStatus(status);
      }
    } else {
      setPaymentStatus('');
    }
  }, [location.search]);

  useEffect(() => {
    document.title = `${mainAppStore.initModel.brandName} ${t(
      'trading platform'
    )}`;
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
      <Observer>
        {() => (
          <>{mainAppStore.isDemoRealPopup && <DemoRealPopup></DemoRealPopup>}</>
        )}
      </Observer>
      {!!paymentStatus && (
        <StatusPaymentPopup status={paymentStatus}></StatusPaymentPopup>
      )}
      <FlexContainer
        position="absolute"
        bottom="100px"
        left="14px"
        zIndex="100"
      >
        <Observer>
          {() => (
            <NotificationPopup
              show={notificationStore.isActiveNotification}
            ></NotificationPopup>
          )}
        </Observer>
      </FlexContainer>
      <FlexContainer flexDirection="column">
        <FlexContainer marginBottom="20px" height="40px">
          <InstrumentsScrollWrapper></InstrumentsScrollWrapper>
          <FlexContainer position="relative" alignItems="center">
            <Toggle>
              {({ on, toggle }) => (
                <>
                  <AddIntrumentButton onClick={toggle}>
                    <SvgIcon {...IconAddInstrument} fillColor="#FFFCCC" />
                  </AddIntrumentButton>
                  {on && <AddInstrumentsPopup toggle={toggle} />}
                </>
              )}
            </Toggle>
          </FlexContainer>
        </FlexContainer>
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
                  maxHeight="calc(100% - 123px)"
                >
                  <FlexContainer
                    width="100%"
                    maxWidth="calc(100% - 175px)"
                    maxHeight="calc(100vh - 175px)"
                    flexDirection="column"
                  >
                    <ChartWrapper
                      padding="0 0 0 0"
                      height="100%"
                      maxHeight="calc(100vh - 200px)"
                      minHeight="445px"
                    >
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

const AddIntrumentButton = styled(ButtonWithoutStyles)`
  width: 24px;
  height: 24px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const GridWrapper = styled.div`
  display: grid;
  border-collapse: collapse;
  grid-template-columns: 1fr 172px;
  grid-template-rows: 1fr 32px;
  width: 100%;
  height: 100%;
  max-height: calc(100% - 131px);
  grid-row-gap: 0;
  grid-column-gap: 1px;
`;

const ChartWrapper = styled(FlexContainer)`
  grid-row: 1 / span 1;
  grid-column: 1 / span 1;
`;

const ChartInstruments = styled(FlexContainer)`
  grid-row: 2 / span 1;
  grid-column: 1 / span 1;
`;
