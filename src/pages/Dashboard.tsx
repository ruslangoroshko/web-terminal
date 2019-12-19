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
import { MainAppContext } from '../store/MainAppProvider';
import TVChartContainer from '../containers/ChartContainer';
import { InstrumentModelWSDTO } from '../types/Instruments';
import { PositionModelWSDTO } from '../types/Positions';
import { IChartingLibraryWidget } from '../vendor/charting_library/charting_library.min';
import { supportedResolutions } from '../constants/supportedResolutionsTimeScale';
import { v4 } from 'uuid';
import SvgIcon from '../components/SvgIcon';
import IconAddInstrument from '../assets/svg/icon-instrument-add.svg';
import ActiveInstrument from '../components/ActiveInstrument';
import BuySellPanel from '../components/BuySellPanel';

function Dashboard() {
  const { isLoading, account, setAccount, activeSession } = useContext(
    MainAppContext
  );
  const [resolution, setResolution] = useState(supportedResolutions[0]);

  const [tradingWidget, setTradingWidget] = useState<IChartingLibraryWidget>();
  const [tabType, setTabType] = useState(TabType.ActivePositions);

  const [activePositions, setActivePositions] = useState<PositionModelWSDTO[]>(
    []
  );

  const [activeInstrument, setActiveInstrument] = useState<
    InstrumentModelWSDTO
  >();
  const [instruments, setInstruments] = useState<InstrumentModelWSDTO[]>([]);
  const [, setConnectionId] = useState<string>('');

  const switchInstrument = (instrument: InstrumentModelWSDTO) => () => {
    setActiveInstrument(instrument);

    // TODO: wait for prettier support "optional chaining"
    if (tradingWidget) {
      tradingWidget.setSymbol(instrument.id, resolution, () => {});
    }
  };

  const switchTabType = (tabType: TabType) => () => {
    setTabType(tabType);
  };

  const tradingWidgetCallback = (callbackWidget: IChartingLibraryWidget) => {
    setTradingWidget(callbackWidget);
  };

  const setTimeScale = (resolution: string) => {
    if (tradingWidget) {
      tradingWidget.setSymbol(activeInstrument!.id, resolution, () => {
        setResolution(resolution);
      });
    }
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
            data={activePositions}
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
    API.closePosition({ accountId: account!.id, positionId, processId: v4() });
  };

  useEffect(() => {
    if (activeSession) {
      activeSession.on(
        Topics.ACCOUNTS,
        (response: ResponseFromWebsocket<AccountModelWebSocketDTO[]>) => {
          setAccount(response.data[0]);
          setConnectionId(
            // @ts-ignore
            activeSession.connection.transport.webSocket.url.split('id=')[1]
          );
          activeSession.send(Topics.SET_ACTIVE_ACCOUNT, {
            [Fields.ACCOUNT_ID]: response.data[0].id,
          });
        }
      );

      activeSession.on(
        Topics.UPDATE_ACCOUNT,
        (response: ResponseFromWebsocket<AccountModelWebSocketDTO>) => {
          setAccount(response.data);
        }
      );
    }
  }, [activeSession]);

  useEffect(() => {
    if (account && activeSession) {
      activeSession.on(
        Topics.INSTRUMENTS,
        (response: ResponseFromWebsocket<InstrumentModelWSDTO[]>) => {
          if (response.accountId === account.id) {
            setInstruments(response.data);
            setActiveInstrument(response.data[0]);
          }
        }
      );
      activeSession.on(
        Topics.ACTIVE_POSITIONS,
        (response: ResponseFromWebsocket<PositionModelWSDTO[]>) => {
          if (response.accountId === account.id) {
            setActivePositions(response.data);
          }
        }
      );
      activeSession.on(
        Topics.UPDATE_ACCOUNT,
        (response: ResponseFromWebsocket<PositionModelWSDTO>) => {
          if (response.accountId === account.id) {
            const newActivePositions = activePositions.map(item => {
              if (item.id === response.data.id) {
                return response.data;
              }
              return item;
            });
            setActivePositions(newActivePositions);
          }
        }
      );
    }
  }, [account]);

  const handleRemoveInstrument = (instrumentId: string) => () => {
    throw new Error('handleRemoveInstrument');
  };

  const handleAddNewInstrument = () => {
    throw new Error('handleAddNewInstrument');
  };

  return !isLoading && account && activeSession ? (
    <FlexContainer
      width="100%"
      height="100%"
      flexDirection="column"
      backgroundColor="#262A2D"
    >
      <FlexContainer
        padding="8px 0 8px 8px"
        width="100%"
        flexDirection="column"
      >
        <FlexContainer margin="0 0 24px 0">
          <FlexContainer padding="4px 4px 4px 0">
            {instruments.map(item => (
              <Instrument
                activeSession={activeSession}
                instrument={item}
                key={item.id}
                isActive={item.id === activeInstrument?.id}
                handleClose={handleRemoveInstrument(item.id)}
                switchInstrument={switchInstrument(item)}
                positionsLength={activePositions.length}
              />
            ))}
          </FlexContainer>
          <FlexContainer>
            <AddIntrumentButton onClick={handleAddNewInstrument}>
              <SvgIcon {...IconAddInstrument} />
            </AddIntrumentButton>
          </FlexContainer>
        </FlexContainer>
        <FlexContainer>
          {activeInstrument && (
            <ActiveInstrument instrument={activeInstrument} />
          )}
        </FlexContainer>
      </FlexContainer>
      <GridWrapper>
        <ChartWrapper height="456px" backgroundColor="#191e1e">
          {activeInstrument && (
            <TVChartContainer
              intrument={activeInstrument}
              tradingWidgetCallback={tradingWidgetCallback}
            />
          )}
        </ChartWrapper>
        <BuySellPanelWrapper>
          {activeInstrument && <BuySellPanel currencySymbol="$"></BuySellPanel>}
        </BuySellPanelWrapper>
        <ChartInstruments>asd</ChartInstruments>
      </GridWrapper>
      <FlexContainer flexDirection="column">
        <FlexContainer margin="0 0 20px" width="100%">
          <TabButton
            onClick={switchTabType(TabType.ActivePositions)}
            isActive={tabType === TabType.ActivePositions}
          >
            Active Positions
          </TabButton>
          <TabButton
            onClick={switchTabType(TabType.PendingOrders)}
            isActive={tabType === TabType.PendingOrders}
          >
            Pending orders
          </TabButton>
          <TabButton
            onClick={switchTabType(TabType.History)}
            isActive={tabType === TabType.History}
          >
            History
          </TabButton>
        </FlexContainer>
        <FlexContainer>{renderTabType()}</FlexContainer>
      </FlexContainer>
    </FlexContainer>
  ) : null;
}

export default Dashboard;

const TabButton = styled(ButtonWithoutStyles)<{ isActive: boolean }>`
  background-color: ${props => (props.isActive ? 'green' : 'darkblue')};
  margin-right: 20px;
  color: #fff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-top: 1px solid #353c4d;
  border-left: 1px solid #353c4d;
  border-right: 1px solid #353c4d;
  transition: background-color 0.2s ease;
  pointer-events: ${props => (props.isActive ? 'none' : 'all')};

  &:hover {
    background-color: greenyellow;
  }
`;

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
  grid-template-columns: 1fr 172px;
  width: 100%;
  grid-gap: 1px;
  border-color: #383c3f;
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
