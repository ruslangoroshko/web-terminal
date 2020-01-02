import React, { useState, useEffect } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { ResponseFromWebsocket } from '../types/ResponseFromWebsocket';
import Topics from '../constants/websocketTopics';
import { AccountModelWebSocketDTO } from '../types/Accounts';
import Fields from '../constants/fields';
import Instrument from '../components/Instrument';
import TVChartContainer from '../containers/ChartContainer';
import { InstrumentModelWSDTO } from '../types/Instruments';
import { PositionModelWSDTO } from '../types/Positions';
import { supportedResolutions } from '../constants/supportedResolutionsTimeScale';
import SvgIcon from '../components/SvgIcon';
import IconAddInstrument from '../assets/svg/icon-instrument-add.svg';
import ActiveInstrument from '../components/ActiveInstrument';
import BuySellPanel from '../components/BuySellPanel/BuySellPanel';
import ChartTimeScale from '../components/Chart/ChartTimeScale';
import ChartSettingsButtons from '../components/Chart/ChartSettingsButtons';
import ChartTimeFomat from '../components/Chart/ChartTimeFomat';
import { AskBidEnum } from '../enums/AskBid';
import { useStores } from '../hooks/useStores';
import Toggle from '../components/Toggle';
import AddInstrumentsPopup from '../components/AddInstrumentsPopup';
import { Observer, observer } from 'mobx-react-lite';
import API from '../helpers/API';
import KeysInApi from '../constants/keysInApi';
import { activeInstrumentsInit } from '../helpers/activeInstrumentsHelper';

// TODO: refactor dashboard observer to small Observers (isLoading flag)

const Dashboard = observer(() => {
  const { mainAppStore, tradingViewStore } = useStores();
  const [resolution, setResolution] = useState(supportedResolutions[0]);

  const { quotesStore, instrumentsStore } = useStores();

  const switchInstrument = (instrument: InstrumentModelWSDTO) => () => {
    instrumentsStore.activeInstrument = instrument;
    tradingViewStore.tradingWidget?.chart().setSymbol(instrument.id, () => {});
  };

  const setTimeScale = (resolution: string) => {
    tradingViewStore.tradingWidget?.chart().setResolution(resolution, () => {
      setResolution(resolution);
    });
  };

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
                  c: item.ask,
                  h: 0,
                  l: 0,
                  o: 0,
                },
                bid: {
                  c: item.bid,
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

  const handleRemoveInstrument = (itemId: string) => () => {
    throw new Error(`handleRemoveInstrument ${itemId}`);
  };

  return !mainAppStore.isLoading &&
    mainAppStore.account &&
    mainAppStore.activeSession ? (
    <DashboardWrapper height="100%" width="100%" flexDirection="column">
      <FlexContainer flexDirection="column" margin="0 0 20px 0">
        <FlexContainer>
          <FlexContainer maxWidth="90%" overflow="hidden" flexWrap="wrap">
            <Observer>
              {() => (
                <>
                  {instrumentsStore.activeInstruments.map(item => (
                    <Instrument
                      instrument={item}
                      key={item.id}
                      isActive={
                        item.id === instrumentsStore.activeInstrument?.id
                      }
                      handleClose={handleRemoveInstrument(item.id)}
                      switchInstrument={switchInstrument(item)}
                    />
                  ))}
                </>
              )}
            </Observer>
          </FlexContainer>
          <FlexContainer position="relative" alignItems="center">
            <Observer>
              {() => (
                <Toggle>
                  {({ on, toggle }) => (
                    <>
                      <AddIntrumentButton onClick={toggle}>
                        <SvgIcon
                          {...IconAddInstrument}
                          fill="rgba(255, 255, 255, 0.6)"
                        />
                      </AddIntrumentButton>
                      {on && (
                        <AddInstrumentsPopup
                          toggle={toggle}
                          instruments={instrumentsStore.instruments}
                        />
                      )}
                    </>
                  )}
                </Toggle>
              )}
            </Observer>
          </FlexContainer>
        </FlexContainer>
        <ActiveInstrumentWrapper position="relative" padding="24px 20px">
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
        </ActiveInstrumentWrapper>
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
                <ChartTimeScale
                  activeResolution={resolution}
                  setTimeScale={setTimeScale}
                ></ChartTimeScale>
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

const ActiveInstrumentWrapper = styled(FlexContainer)`
  border-top: 1px solid rgba(255, 255, 255, 0.08);

  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.17) 0%,
      rgba(0, 0, 0, 0) 100%
    );
    opacity: 0.3;
  }
`;

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
