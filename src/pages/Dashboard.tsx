import React, { useState, useEffect, useContext } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import {
  AccountName,
  AccountLeverage,
  AccountBalance,
  AccountBalanceTitle,
  AccountNameTitle,
} from '../styles/Pages/Dashboard';
import OpenPosition from '../components/OpenPosition';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { InstrumentModelDTO, InstrumentModelWSDTO } from '../types/Instruments';
import AccordionItem from '../components/AccordionItem';
import monfexLogo from '../assets/images/monfex-logo.png';
import { ResponseFromWebsocket } from '../types/ResponseFromWebsocket';
import { TabType } from '../enums/TabType';
import Topics from '../constants/websocketTopics';
import { AccountModelWebSocketDTO } from '../types/Accounts';
import { PositionModelDTO, ActivePositionModelWSDTO } from '../types/Positions';
import Fields from '../constants/fields';
import API from '../helpers/API';
import TradingGraph from '../components/TradingGraph';
import Instrument from '../components/Instrument';
import Table from '../components/Table';
import { MainAppContext } from '../store/MainAppProvider';
import TVChartContainer from '../containers/ChartContainer';

function Dashboard() {
  const { isLoading } = useContext(MainAppContext);
  const { activeSession } = useContext(MainAppContext);

  const [tabType, setTabType] = useState(TabType.ActivePositions);
  const [account, setAccount] = useState<AccountModelWebSocketDTO>();

  const [activePositions, setActivePositions] = useState<PositionModelDTO[]>(
    []
  );

  const [activeInstrument, setActiveInstrument] = useState<
    InstrumentModelDTO
  >();
  const [instruments, setInstruments] = useState<InstrumentModelDTO[]>([]);

  const switchInstrument = (instrument: InstrumentModelDTO) => () => {
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
        return (
          <Table
            columns={columns}
            data={activePositions}
            closePosition={closePosition}
            instrumentId={activeInstrument ? activeInstrument.id : ''}
            balance={account!.balance}
            leverage={account!.leverage}
          ></Table>
          // <List>
          //   {activePositions.map(pos => (
          //     <li key={pos.id}>
          //       {(Object.keys(pos) as Array<keyof typeof pos>).map(
          //         (key, index, arr) => (
          //           <Test key={key}>{`${key}: ${pos[key]}${
          //             index !== arr.length - 1 ? ' | ' : ''
          //           }`}</Test>
          //         )
          //       )}
          //       <ButtonWithoutStyles
          //         onClick={closePosition({
          //           positionId: pos.id,
          //           accountId: account!.id,
          //         })}
          //       >
          //         close Position
          //       </ButtonWithoutStyles>
          //     </li>
          //   ))}
          // </List>
        );

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

      activeSession.on(
        Topics.ACTIVE_POSITIONS,
        (response: ResponseFromWebsocket<ActivePositionModelWSDTO[]>) => {
          setActivePositions(response.data[0].positions);
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
        (response: ResponseFromWebsocket<InstrumentModelWSDTO>) => {
          if (response.data && response.data.accountId === account.id) {
            const { instruments } = response.data;
            setInstruments(instruments);
            setActiveInstrument(instruments[0]);
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
          <FlexContainer flexDirection="column">
            <AccountNameTitle>Leverage</AccountNameTitle>
            <AccountLeverage>{account.leverage}</AccountLeverage>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
      <FlexContainer justifyContent="space-between" padding="20px">
        <FlexContainer flexDirection="column" width="100%">
          <FlexContainer margin="0 20px 20px 0">
            <FlexContainer width="100%" height="500px">
              {activeInstrument && (
                // <TradingGraph activeInstrument={activeInstrument} />
                <TVChartContainer />
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
          {instruments.map(instrument => (
            <AccordionItem key={instrument.id} title={instrument.name}>
              <OpenPosition
                quoteName={instrument.quote}
                accountId={account.id}
                instrumentId={instrument.id}
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
