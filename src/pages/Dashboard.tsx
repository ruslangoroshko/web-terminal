import React, { useState, useEffect } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { ResponseFromWebsocket } from '../types/ResponseFromWebsocket';
import Topics from '../constants/websocketTopics';
import { AccountModelWebSocketDTO } from '../types/Accounts';
import Fields from '../constants/fields';
import TVChartContainer from '../containers/ChartContainer';
import { InstrumentModelWSDTO } from '../types/Instruments';
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
import { activeInstrumentsInit } from '../helpers/activeInstrumentsHelper';
import InstrumentsScrollWrapper from '../components/InstrumentsScrollWrapper';
import {
  supportedInterval,
  supportedResolutions,
} from '../constants/supportedTimeScales';
import moment from 'moment';
import { BASIC_RESOLUTION_KEY } from '../constants/chartValues';

// TODO: refactor dashboard observer to small Observers (isLoading flag)

const Dashboard = observer(() => {
  const { mainAppStore, tradingViewStore } = useStores();

  const { quotesStore, instrumentsStore } = useStores();

  useEffect(() => {
    mainAppStore.activeSession?.on(
      Topics.ACCOUNTS,
      (response: ResponseFromWebsocket<AccountModelWebSocketDTO[]>) => {
        mainAppStore.setAccount(response.data[0]);
        quotesStore.available = response.data[0].balance;

        mainAppStore.activeSession?.send(Topics.SET_ACTIVE_ACCOUNT, {
          [Fields.ACCOUNT_ID]: response.data[0].id,
        });
      }
    );

    mainAppStore.activeSession?.on(
      Topics.UPDATE_ACCOUNT,
      (response: ResponseFromWebsocket<AccountModelWebSocketDTO>) => {
        quotesStore.available = response.data.balance;
        mainAppStore.setAccount(response.data);
      }
    );
  }, [mainAppStore.activeSession]);

  useEffect(() => {
    if (mainAppStore.account) {
      mainAppStore.activeSession?.on(
        Topics.INSTRUMENTS,
        (response: ResponseFromWebsocket<InstrumentModelWSDTO[]>) => {
          if (response.accountId === mainAppStore.account?.id) {
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
            instrumentsStore.instruments = response.data;
            activeInstrumentsInit(instrumentsStore);
          }
        }
      );
      mainAppStore.activeSession?.on(
        Topics.ACTIVE_POSITIONS,
        (response: ResponseFromWebsocket<PositionModelWSDTO[]>) => {
          if (response.accountId === mainAppStore.account?.id) {
            quotesStore.activePositions = response.data;
          }
        }
      );
      mainAppStore.activeSession?.on(
        Topics.UPDATE_ACCOUNT,
        (response: ResponseFromWebsocket<PositionModelWSDTO>) => {
          if (response.accountId === mainAppStore.account?.id) {
            const newActivePositions = quotesStore.activePositions.map(item => {
              if (item.id === response.data.id) {
                return response.data;
              }
              return item;
            });
            quotesStore.activePositions = newActivePositions;
          }
        }
      );
    }
  }, [mainAppStore.account]);

  return !mainAppStore.isLoading &&
    mainAppStore.account &&
    mainAppStore.activeSession ? (
    <DashboardWrapper height="100%" width="100%" flexDirection="column">
      <FlexContainer flexDirection="column" margin="0 0 20px 0">
        <FlexContainer>
          <InstrumentsScrollWrapper></InstrumentsScrollWrapper>
          <FlexContainer position="relative" alignItems="center">
            <Toggle>
              {({ on, toggle }) => (
                <>
                  <AddIntrumentButton onClick={toggle}>
                    <SvgIcon
                      {...IconAddInstrument}
                      fill="rgba(255, 255, 255, 0.6)"
                    />
                  </AddIntrumentButton>
                  {on && <AddInstrumentsPopup toggle={toggle} />}
                </>
              )}
            </Toggle>
          </FlexContainer>
        </FlexContainer>
        <FlexContainer position="relative" padding="24px 20px">
          <Observer>
            {() => (
              <>
                {instrumentsStore.activeInstrument && (
                  <ActiveInstrument
                    instrument={instrumentsStore.activeInstrument}
                  />
                )}
              </>
            )}
          </Observer>
        </FlexContainer>
      </FlexContainer>
      <GridWrapper>
        <Observer>
          {() => (
            <>
              <ChartWrapper>
                {instrumentsStore.activeInstrument && (
                  <TVChartContainer
                    intrument={instrumentsStore.activeInstrument}
                  />
                )}
              </ChartWrapper>
              <BuySellPanelWrapper>
                {instrumentsStore.activeInstrument && (
                  <BuySellPanel
                    currencySymbol={mainAppStore.account!.symbol}
                    instrument={instrumentsStore.activeInstrument}
                    accountId={mainAppStore.account!.id}
                    digits={mainAppStore.account!.digits}
                  ></BuySellPanel>
                )}
              </BuySellPanelWrapper>
              <ChartInstruments justifyContent="space-between">
                <ChartSettingsButtons></ChartSettingsButtons>
                <ChartIntervalTimeScale></ChartIntervalTimeScale>
                {tradingViewStore.tradingWidget && (
                  <ChartTimeFomat
                    tvWidget={tradingViewStore.tradingWidget}
                  ></ChartTimeFomat>
                )}
              </ChartInstruments>
            </>
          )}
        </Observer>
      </GridWrapper>
    </DashboardWrapper>
  ) : null;
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
  height: 100%;
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

const BuySellPanelWrapper = styled(FlexContainer)`
  grid-row: 1 / span 2;
  grid-column: 2 / span 1;
`;
