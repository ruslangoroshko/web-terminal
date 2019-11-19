import React, { useState, useEffect } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import {
  CurrencyQuoteIcon,
  CurrencyQuoteTitle,
  QuotesFeedWrapper,
  AccountName,
  AccountLeverage,
  AccountBalance,
  AccountBalanceTitle,
  AccountNameTitle,
  CurrencyQuoteInfo,
} from '../styles/Pages/Dashboard';
import currencyIcon from '../assets/images/currency.png';
import OpenPosition from '../components/OpenPosition';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { InstrumentModelDTO } from '../types/Instruments';
import AccordionItem from '../components/AccordionItem';
import monfexLogo from '../assets/images/monfex-logo.png';
import { ResponseFromWebsocket } from '../types/ResponseFromWebsocket';
import { TabType } from '../enums/TabType';
import Topics from '../constants/websocketTopics';
import calculateGrowth from '../helpers/calculateGrowth';
import { AccountModelWebSocketDTO } from '../types/Accounts';
import { HubConnection } from '@aspnet/signalr';
import { BidAskModelDTO } from '../types/BidAsk';
import {
  PositionModelDTO,
  ActivePositionModelWSDTO,
  ClosePositionModel,
} from '../types/Positions';
import calculateFloatingProfitAndLoss from '../helpers/calculateFloatingProfitAndLoss';
import Fields from '../constants/fields';
import API from '../helpers/API';

interface Props {
  activeSession: HubConnection;
}

function Dashboard(props: Props) {
  const { activeSession } = props;

  const [tabType, setTabType] = useState(TabType.ActivePositions);
  const [account, setAccount] = useState<AccountModelWebSocketDTO>();
  const [activeInstrument, setActiveInstrument] = useState<
    InstrumentModelDTO
  >();
  const [instruments, setInstruments] = useState<InstrumentModelDTO[]>([]);
  const [activePositions, setActivePositions] = useState<PositionModelDTO[]>(
    []
  );

  const switchTabType = (tabType: TabType) => () => {
    setTabType(tabType);
  };

  const switchInstrument = (instrument: InstrumentModelDTO) => () => {
    setActiveInstrument(instrument);
  };

  const renderTabType = () => {
    switch (tabType) {
      case TabType.ActivePositions:
        return (
          <List>
            {activePositions.map(pos => (
              <li key={pos.id}>
                {(Object.keys(pos) as Array<keyof typeof pos>).map(
                  (key, index, arr) => (
                    <Test key={key}>{`${key}: ${pos[key]}${
                      index !== arr.length - 1 ? ' | ' : ''
                    }`}</Test>
                  )
                )}
                <ButtonWithoutStyles
                  onClick={closePosition({
                    positionId: pos.id,
                    accountId: account!.id,
                  })}
                >
                  close Position
                </ButtonWithoutStyles>
              </li>
            ))}
          </List>
        );

      case TabType.PendingOrders:
        return <Test>PendingOrders</Test>;

      case TabType.History:
        return <Test>History</Test>;

      default:
        return null;
    }
  };

  const closePosition = ({
    accountId,
    positionId,
  }: ClosePositionModel) => () => {
    API.closePosition({ accountId, positionId });
  };

  useEffect(() => {
    activeSession.on(
      Topics.ACCOUNTS,
      (response: ResponseFromWebsocket<AccountModelWebSocketDTO>) => {
        setAccount(response.data[0]);
        activeSession.send(Topics.SET_ACTIVE_ACCOUNT, {
          [Fields.ACCOUNT_ID]: response.data[0].id,
        });
      }
    );

    activeSession.on(
      Topics.ACTIVE_POSITIONS,
      (response: ResponseFromWebsocket<ActivePositionModelWSDTO>) => {
        setActivePositions(response.data[0].positions);
      }
    );

    activeSession.on(Topics.UPDATE_ACCOUNT, (response: any) => {
      setAccount(response.data);
    });
  }, []);

  useEffect(() => {
    activeSession.on(
      Topics.INSTRUMENTS,
      (response: ResponseFromWebsocket<InstrumentModelDTO>) => {
        if (response.data.length) {
          const instruments = response.data;
          setInstruments(instruments);
          setActiveInstrument(instruments[0]);
        }
      }
    );
  }, [account]);

  useEffect(() => {
    if (activeInstrument) {
      activeSession.on(
        Topics.BID_ASK,
        (response: ResponseFromWebsocket<BidAskModelDTO>) => {
          if (!response.data.length) {
            return;
          }
          const newBidAsk = response.data[0];

          setInstruments(instruments =>
            instruments.map(instrument => {
              if (instrument.id === newBidAsk.id) {
                const growth = calculateGrowth(
                  newBidAsk.bid,
                  newBidAsk.ask,
                  instrument.digits
                );
                return {
                  ...instrument,
                  bidAsk: {
                    ...newBidAsk,
                    prevGrowth: instrument.bidAsk
                      ? instrument.bidAsk.growth
                      : growth,
                    growth,
                  },
                };
              }
              return instrument;
            })
          );
        }
      );
    }
  }, [activeInstrument]);

  return account ? (
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
          {instruments.length > 0 &&
            instruments.map(instrument => (
              <QuotesFeedWrapper
                isActive={
                  activeInstrument && instrument.id === activeInstrument.id
                }
                key={instrument.id}
                padding="10px"
                onClick={switchInstrument(instrument)}
              >
                <FlexContainer alignItems="center" justifyContent="center">
                  <CurrencyQuoteIcon src={currencyIcon} />
                </FlexContainer>
                <FlexContainer flexDirection="column" width="160px">
                  <CurrencyQuoteTitle>{instrument.name}</CurrencyQuoteTitle>
                  {instrument.bidAsk ? (
                    <FlexContainer flexDirection="column">
                      <CurrencyQuoteInfo
                        isGrowth={
                          instrument.bidAsk.growth >
                          instrument.bidAsk.prevGrowth
                        }
                      >
                        {instrument.bidAsk.ask} / {instrument.bidAsk.bid}
                      </CurrencyQuoteInfo>
                      <span style={{ color: '#fff' }}>
                        {calculateGrowth(
                          instrument.bidAsk.bid,
                          instrument.bidAsk.ask,
                          instrument.digits
                        )}
                      </span>
                    </FlexContainer>
                  ) : null}
                </FlexContainer>
              </QuotesFeedWrapper>
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
                <TradingViewWidget
                  symbol={`FX:${activeInstrument.base}${activeInstrument.quote}`}
                  theme={Themes.DARK}
                  autosize
                />
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
          {instruments.length > 0 &&
            instruments.map(instrument => (
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

const List = styled.ul`
  padding: 10px 0;
`;
