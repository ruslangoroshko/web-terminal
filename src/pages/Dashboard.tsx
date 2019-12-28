import React, { useState, useEffect, useContext } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { ResponseFromWebsocket } from '../types/ResponseFromWebsocket';
import { TabType } from '../enums/TabType';
import Topics from '../constants/websocketTopics';
import { AccountModelWebSocketDTO } from '../types/Accounts';
import Fields from '../constants/fields';
import API from '../helpers/API';
import Instrument from '../components/Instrument';
import Table from '../components/Table';
import TVChartContainer from '../containers/ChartContainer';
import { InstrumentModelWSDTO } from '../types/Instruments';
import { PositionModelWSDTO } from '../types/Positions';
import { IChartingLibraryWidget } from '../vendor/charting_library/charting_library.min';
import { supportedResolutions } from '../constants/supportedResolutionsTimeScale';
import { v4 } from 'uuid';
import SvgIcon from '../components/SvgIcon';
import IconAddInstrument from '../assets/svg/icon-instrument-add.svg';
import ActiveInstrument from '../components/ActiveInstrument';
import BuySellPanel from '../components/BuySellPanel/BuySellPanel';
import ChartTimeScale from '../components/Chart/ChartTimeScale';
import ChartSettingsButtons from '../components/Chart/ChartSettingsButtons';
import ChartTimeFomat from '../components/Chart/ChartTimeFomat';
import { AskBidEnum } from '../enums/AskBid';
import { useStores } from '../hooks/useStores';
import TestBg from '../assets/images/test.png';
import Toggle from '../components/Toggle';
import AddInstrumentsPopup from '../components/AddInstrumentsPopup';

const Dashboard = () => {
  const { mainAppStore, tradingViewStore } = useStores();
  const [resolution, setResolution] = useState(supportedResolutions[0]);

  const [tabType, setTabType] = useState(TabType.ActivePositions);

  const { quotesStore } = useStores();

  const [activeInstrument, setActiveInstrument] = useState<
    InstrumentModelWSDTO
  >();
  const [instruments, setInstruments] = useState<InstrumentModelWSDTO[]>([]);

  const switchInstrument = (instrument: InstrumentModelWSDTO) => () => {
    setActiveInstrument(instrument);
    tradingViewStore.tradingWidget?.chart().setSymbol(instrument.id, () => {});
  };

  const setTimeScale = (resolution: string) => {
    tradingViewStore.tradingWidget?.chart().setResolution(resolution, () => {
      setResolution(resolution);
    });
  };

  const renderTabType = () => {
    switch (tabType) {
      case TabType.ActivePositions:
        const columns: Array<{
          accessor: keyof PositionModelWSDTO;
          Header: string;
        }> = [
          {
            accessor: 'id',
            Header: 'Id',
          },
          {
            accessor: 'investmentAmount',
            Header: 'investmentAmount',
          },
          {
            accessor: 'openPrice',
            Header: 'openPrice',
          },
          {
            accessor: 'openDate',
            Header: 'openDate',
          },
          {
            accessor: 'instrument',
            Header: 'instrument',
          },
          {
            accessor: 'swap',
            Header: 'swap',
          },
          {
            accessor: 'commission',
            Header: 'commission',
          },
          {
            accessor: 'takeProfitInCurrency',
            Header: 'takeProfitInCurrency',
          },
          {
            accessor: 'stopLossInCurrency',
            Header: 'stopLossInCurrency',
          },
          {
            accessor: 'takeProfitRate',
            Header: 'takeProfitRate',
          },
          {
            accessor: 'stopLossRate',
            Header: 'stopLossRate',
          },
        ];
        return activeInstrument ? (
          <Table
            columns={columns}
            data={quotesStore.activePositions}
            closePosition={closePosition}
            instrumentId={activeInstrument ? activeInstrument.id : ''}
            multiplier={activeInstrument.multiplier[0]}
          ></Table>
        ) : null;

      case TabType.PendingOrders:
        return <div>PendingOrders</div>;

      case TabType.History:
        return <div>History</div>;

      default:
        return null;
    }
  };

  const closePosition = (positionId: number) => () => {
    API.closePosition({
      accountId: mainAppStore.account!.id,
      positionId,
      processId: v4(),
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
          setInstruments(response.data);
          setActiveInstrument(response.data[0]);
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
  }, [mainAppStore.account]);

  const handleRemoveInstrument = (instrumentId: string) => () => {
    throw new Error('handleRemoveInstrument');
  };

  const handleAddNewInstrument = () => {
    throw new Error('handleAddNewInstrument');
  };

  return !mainAppStore.isLoading &&
    mainAppStore.account &&
    mainAppStore.activeSession ? (
    <FlexContainer
      height="100%"
      flexDirection="column"
      backgroundColor="#232830"
    >
      <FlexContainer
        padding="8px 0 8px 8px"
        flexDirection="column"
        margin="0 0 20px 0"
      >
        <FlexContainer margin="0 0 24px 0">
          <FlexContainer
            padding="4px 4px 4px 0"
            maxWidth="90%"
            overflow="hidden"
            flexWrap="wrap"
          >
            {instruments.map(item => (
              <Instrument
                instrument={item}
                key={item.id}
                isActive={item.id === activeInstrument?.id}
                handleClose={handleRemoveInstrument(item.id)}
                switchInstrument={switchInstrument(item)}
              />
            ))}
          </FlexContainer>
          <FlexContainer position="relative">
            <Toggle>
              {({ on, toggle }) => (
                <>
                  <AddIntrumentButton onClick={toggle}>
                    <SvgIcon
                      {...IconAddInstrument}
                      fill="rgba(255, 255, 255, 0.6)"
                    />
                  </AddIntrumentButton>
                  {on && <AddInstrumentsPopup />}
                </>
              )}
            </Toggle>
          </FlexContainer>
        </FlexContainer>
        <FlexContainer>
          {activeInstrument && (
            <ActiveInstrument instrument={activeInstrument} />
          )}
        </FlexContainer>
      </FlexContainer>
      <GridWrapper>
        <ChartWrapper>
          {activeInstrument && (
            <TVChartContainer intrument={activeInstrument} />
          )}
        </ChartWrapper>
        <BuySellPanelWrapper>
          {activeInstrument && (
            <BuySellPanel
              currencySymbol={mainAppStore.account.symbol}
              instrument={activeInstrument}
              accountId={mainAppStore.account.id}
              digits={mainAppStore.account.digits}
            ></BuySellPanel>
          )}
        </BuySellPanelWrapper>
        <ChartInstruments
          backgroundColor="#232830"
          justifyContent="space-between"
        >
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
      </GridWrapper>
    </FlexContainer>
  ) : null;
};

export default Dashboard;

const AddIntrumentButton = styled(ButtonWithoutStyles)`
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.06);
  box-shadow: inset 0px 1px 0px rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  border-radius: 2px;
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
  /* background: linear-gradient(0deg, #232830, #232830),
    linear-gradient(291.49deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.62) 99.76%); */
  background-image: url(${TestBg}) center center no-repeat;
`;

const ChartInstruments = styled(FlexContainer)`
  grid-row: 2 / span 1;
  grid-column: 1 / span 1;
`;

const BuySellPanelWrapper = styled(FlexContainer)`
  grid-row: 1 / span 2;
  grid-column: 2 / span 1;
`;
