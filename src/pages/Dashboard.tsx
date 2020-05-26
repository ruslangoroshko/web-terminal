import React, { useEffect } from 'react';
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
import { AskBidEnum } from '../enums/AskBid';
import { useStores } from '../hooks/useStores';
import Toggle from '../components/Toggle';
import AddInstrumentsPopup from '../components/AddInstrumentsPopup';
import { Observer, observer } from 'mobx-react-lite';
import InstrumentsScrollWrapper from '../components/InstrumentsScrollWrapper';
import NotificationPopup from '../components/NotificationPopup';
import DemoRealPopup from '../components/DemoRealPopup';
import { PendingOrderWSDTO } from '../types/PendingOrdersTypes';

// TODO: refactor dashboard observer to small Observers (isLoading flag)

const Dashboard = observer(() => {
  const {
    mainAppStore,
    quotesStore,
    instrumentsStore,
    notificationStore,
  } = useStores();

  useEffect(() => {
    if (mainAppStore.activeAccount) {
      mainAppStore.activeSession?.on(
        Topics.INSTRUMENTS,
        (response: ResponseFromWebsocket<InstrumentModelWSDTO[]>) => {
          if (
            mainAppStore.activeAccount &&
            response.accountId === mainAppStore.activeAccount.id
          ) {
            response.data.forEach(item => {
              quotesStore.setQuote({
                ask: {
                  c: item.ask || 0,
                  h: 0,
                  l: 0,
                  o: 0,
                },
                bid: {
                  c: item.bid || 0,
                  h: 0,
                  l: 0,
                  o: 0,
                },
                dir: AskBidEnum.Buy,
                dt: Date.now(),
                id: item.id,
              });
            });
            instrumentsStore.setInstruments(response.data);
          }
        }
      );

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

  return (
    <FlexContainer
      width="100%"
      height="100%"
      flexDirection="column"
      position="relative"
    >
      <Observer>
        {() => (
          <>{mainAppStore.isDemoRealPopup && <DemoRealPopup></DemoRealPopup>}</>
        )}
      </Observer>
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
      <GridWrapper>
        <Observer>
          {() => (
            <>
              {instrumentsStore.activeInstrument && (
                <>
                  <ChartWrapper padding="20px 0 0 0">
                    <TVChartContainer
                      instrumentId={
                        instrumentsStore.activeInstrument.instrumentItem.id
                      }
                      instruments={instrumentsStore.instruments}
                    />
                  </ChartWrapper>
                  <BuySellPanel
                    instrument={
                      instrumentsStore.activeInstrument.instrumentItem
                    }
                  ></BuySellPanel>
                  <ChartInstruments justifyContent="space-between">
                    <ChartSettingsButtons></ChartSettingsButtons>
                    <ChartIntervalTimeScale></ChartIntervalTimeScale>
                    <ChartTimeFomat></ChartTimeFomat>
                  </ChartInstruments>
                </>
              )}
            </>
          )}
        </Observer>
      </GridWrapper>
    </FlexContainer>
  );
});

export default Dashboard;

const DashboardWrapper = styled(FlexContainer)``;

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
  height: calc(100% - 180px);
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
