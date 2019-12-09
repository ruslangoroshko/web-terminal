import React, { useState, useEffect, useContext } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import {
  AccountName,
  AccountBalance,
  AccountBalanceTitle,
  AccountNameTitle,
} from '../styles/Pages/Dashboard';
import OpenPosition from '../components/OpenPosition';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import AccordionItem from '../components/AccordionItem';
import monfexLogo from '../assets/images/monfex-logo.png';
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

function Dashboard() {
  const { isLoading } = useContext(MainAppContext);
  const { activeSession } = useContext(MainAppContext);

  const [tabType, setTabType] = useState(TabType.ActivePositions);
  const [account, setAccount] = useState<AccountModelWebSocketDTO>();

  const [activePositions, setActivePositions] = useState<PositionModelWSDTO[]>(
    []
  );

  const [activeInstrument, setActiveInstrument] = useState<
    InstrumentModelWSDTO
  >();
  const [instruments, setInstruments] = useState<InstrumentModelWSDTO[]>([]);

  const switchInstrument = (instrument: InstrumentModelWSDTO) => () => {
    setActiveInstrument(instrument);
  };

  const switchTabType = (tabType: TabType) => () => {
    setTabType(tabType);
  };

  const renderTabType = () => {
    switch (tabType) {
      case TabType.ActivePositions:
        const columns = [
          {
            accessor: 'id',
            Header: 'Id',
          },
          {
            accessor: 'volume',
            Header: 'Volume',
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
            accessor: 'type',
            Header: 'type',
          },
          {
            accessor: 'swap',
            Header: 'swap',
          },
          {
            accessor: 'comission',
            Header: 'comission',
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
            balance={account!.balance}
            leverage={activeInstrument.multiplier[0]}
          ></Table>
        ) : null;

      case TabType.PendingOrders:
        return <Test>PendingOrders</Test>;

      case TabType.History:
        return <Test>History</Test>;

      default:
        return null;
    }
  };

  const closePosition = (positionId: number) => () => {
    API.closePosition({ accountId: account!.id, positionId });
  };

  useEffect(() => {
    if (activeSession) {
      activeSession.on(
        Topics.ACCOUNTS,
        (response: ResponseFromWebsocket<AccountModelWebSocketDTO[]>) => {
          setAccount(response.data[0]);
          activeSession.send(Topics.SET_ACTIVE_ACCOUNT, {
            [Fields.ACCOUNT_ID]: response.data[0].id,
          });
        }
      );

      activeSession.on(Topics.UPDATE_ACCOUNT, (response: any) => {
        setAccount(response.data);
      });
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
    }
  }, [account]);

  return !isLoading && account ? (
    <FlexContainer
      width="100%"
      height="100vh"
      flexDirection="column"
      backgroundColor="#191f2d"
    >
      <FlexContainer
        width="100%"
        padding="20px"
        alignItems="center"
        justifyContent="space-between"
      >
        <FlexContainer>
          <FlexContainer alignItems="center" margin="0 30px 0 0">
            <img src={monfexLogo} alt="" width="100%" />
          </FlexContainer>
          {activeSession &&
            instruments.map(item => (
              <Instrument
                isActive={activeInstrument && activeInstrument.id === item.id}
                key={item.id}
                activeSession={activeSession}
                switchInstrument={switchInstrument}
                instrument={item}
              />
            ))}
        </FlexContainer>
        <FlexContainer padding="0 20px" alignItems="center">
          <FlexContainer flexDirection="column" margin="0 20px 0 0">
            <AccountBalanceTitle>Total balance</AccountBalanceTitle>
            <AccountBalance>
              {account.currency}&nbsp;
              {account.balance}
            </AccountBalance>
          </FlexContainer>
          <FlexContainer flexDirection="column" margin="0 20px 0 0">
            <AccountNameTitle>Account id</AccountNameTitle>
            <AccountName>{account.id}</AccountName>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
      <FlexContainer justifyContent="space-between" padding="20px">
        <FlexContainer flexDirection="column" width="100%">
          <FlexContainer margin="0 20px 20px 0">
            <FlexContainer width="100%" height="500px">
              {activeInstrument && (
                // <TradingGraph activeInstrument={activeInstrument} />
                <TVChartContainer intrumentId={activeInstrument.id} />
              )}
            </FlexContainer>
          </FlexContainer>
          <FlexContainer flexDirection="column">
            <FlexContainer margin="0 0 20px">
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
        <FlexContainer flexDirection="column" margin="0 0 20px" width="400px">
          {instruments.map((instrument, index) => (
            <AccordionItem
              key={instrument.id}
              title={instrument.name}
              isActiveInit={index === 0}
            >
              <OpenPosition
                quoteName={instrument.quote}
                accountId={account.id}
                instrument={instrument}
                multiplier={instrument.multiplier[0]}
              ></OpenPosition>
            </AccordionItem>
          ))}
        </FlexContainer>
      </FlexContainer>
      <FlexContainer justifyContent="center"></FlexContainer>
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

const Test = styled.span`
  color: #fff;
`;
