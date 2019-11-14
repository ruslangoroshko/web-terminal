import React, { useState, useEffect } from 'react';
import API from '../helpers/API';
import { FlexContainer } from '../styles/FlexContainer';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import { AccountModel } from '../types/DTOModels/Accounts.dto';
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
import initConnection from '../services/websocketService';
import currencyIcon from '../assets/images/currency.png';
import OpenPosition from '../components/OpenPosition';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { InstrumentModel } from '../types/DTOModels/Instruments.dto';
import AccordionItem from '../components/AccordionItem';
import monfexLogo from '../assets/images/monfex-logo.png';
import { ResponseFromWebsocket, BidAskModel } from '../types/DTOModels/BidAsk.dto';

interface Props {}

enum TabType {
  ActivePositions,
  PendingOrders,
  History,
}

interface InstrumentModelWithQuotes extends InstrumentModel {
  bidAsk?: BidAskModel;
}

function Dashboard(props: Props) {
  const {} = props;

  const [account, setAccount] = useState<AccountModel>();

  const [activeInstrument, setActiveInstrument] = useState<
    InstrumentModelWithQuotes
  >();

  const [instruments, setInstruments] = useState<InstrumentModelWithQuotes[]>(
    []
  );

  const [tabType, setTabType] = useState(TabType.ActivePositions);

  const switchTabType = (tabType: TabType) => () => {
    setTabType(tabType);
  };

  const switchInstrument = (instrument: InstrumentModel) => () => {
    setActiveInstrument(instrument);
  };

  const renderTabType = () => {
    switch (tabType) {
      case TabType.ActivePositions:
        return <Test>ActivePositions</Test>;

      case TabType.PendingOrders:
        return <Test>PendingOrders</Test>;

      case TabType.History:
        return <Test>History</Test>;

      default:
        return null;
    }
  };

  useEffect(() => {
    const session = initConnection(WS_HOST);
    session.on('bidask', (response: ResponseFromWebsocket<BidAskModel>) => {
      setInstruments(prev =>
        prev.map(item => {
          const bidAsk = response.data[0];
          if (item.id === bidAsk.id) {
            const isGrowth =
              +((bidAsk.ask + bidAsk.ask) * 0.5).toFixed(item.digits);
            return {
              ...item,
              bidAsk: {
                ...response.data[0],
                prev: isGrowth,
                isGrowth: item.bidAsk && item.bidAsk.prev > isGrowth,
              },
            };
          }
          return item;
        })
      );
    });
    session.on('accounts', resp => {
      console.log('accounts', resp);
    });
    API.getAccounts().then(response => {
      setAccount(response[0]);
      if (response[0].instruments.length) {
        setActiveInstrument(response[0].instruments[0]);
        setInstruments(response[0].instruments);
      }
    });
  }, []);
  return (
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
                <FlexContainer flexDirection="column">
                  <CurrencyQuoteTitle>{instrument.name}</CurrencyQuoteTitle>
                  {instrument.bidAsk ? (
                    <FlexContainer flexDirection="column">
                      <CurrencyQuoteInfo isGrowth={instrument.bidAsk.isGrowth}>
                        {instrument.bidAsk.ask} / {instrument.bidAsk.bid}
                      </CurrencyQuoteInfo>
                      <span style={{ color: '#fff' }}>
                        {
                          +(
                            (instrument.bidAsk.ask + instrument.bidAsk.ask) *
                            0.5
                          ).toFixed(instrument.digits)
                        }
                      </span>
                    </FlexContainer>
                  ) : null}
                </FlexContainer>
                <FlexContainer></FlexContainer>
              </QuotesFeedWrapper>
            ))}
        </FlexContainer>
        {account && (
          <FlexContainer padding="0 20px" alignItems="center">
            <FlexContainer flexDirection="column" margin="0 20px 0 0">
              <AccountBalanceTitle>Total balance</AccountBalanceTitle>
              <AccountBalance>{account.currency}{account.balance}</AccountBalance>
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
        )}
      </FlexContainer>
      <FlexContainer justifyContent="space-between" padding="20px">
        <FlexContainer flexDirection="column" width="100%">
          <FlexContainer margin="0 20px 20px 0">
            <FlexContainer width="100%" height="600px">
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
        <FlexContainer flexDirection="column" margin="0 0 20px">
          {account &&
            account.instruments.map(instrument => (
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
  );
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
