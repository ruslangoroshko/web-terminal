import React, { useState, useEffect } from 'react';
import API from '../helpers/API';
import { FlexContainer } from '../styles/FlexContainer';
import { AccountModel } from '../types/Accounts';
import { OpenPositionModel } from '../types/Positions';
import { SectionTitle } from '../styles/Titles';
import initConnection from '../services/websocketService';
import {
  AccountsList,
  Account,
  Instrument,
  Button,
  CurrencyQuoteIcon,
  CurrencyQuoteTitle,
  CurrencyQuoteInfo,
  CurrencyWrapper,
  AccountIndex,
  AccountName,
} from '../styles/Pages/Dashboard';
import currencyIcon from '../assets/images/currency.png';
import graphPlaceholder from '../assets/images/graph-placeholder.png';

interface Props {}

function Dashboard(props: Props) {
  const {} = props;

  const onevent = (...args: any[]) => {
    console.log(args);
  };

  const [accounts, setAccounts] = useState<AccountModel[]>([]);

  const handleOpenPosition = () => {
    const newPosition: OpenPositionModel = {
      accountId: 'accountId',
      instrumentId: 'instrumentId',
      operation: 3,
      sl: 20,
      slRate: 1.5,
      tp: 30,
      tpRate: 1.2,
      volume: 1000,
    };
    API.openPosition(newPosition);
  };

  const handleClosePosition = () => {};

  useEffect(() => {
    initConnection('wss://simpletrading-dev-api.monfex.biz/ws', 'bidask').then(
      session => {
        API.getAccounts().then(response => {
          setAccounts(response);
          response[0].instruments.forEach(item => {
            session.subscribe(item.id, onevent);
          });
        });
      }
    );
  }, []);

  return (
    <FlexContainer
      width="100%"
      height="100vh"
      flexDirection="column"
      backgroundColor="#2a344e"
    >
      <FlexContainer
        width="100%"
        padding="20px"
        justifyContent="space-between"
        alignItems="center"
      >
        {accounts.length > 0 &&
          accounts[0].instruments.map(instrument => (
            <CurrencyWrapper key={instrument.id} padding="10px">
              <FlexContainer alignItems="center" justifyContent="center">
                <CurrencyQuoteIcon src={currencyIcon} />
              </FlexContainer>
              <FlexContainer flexDirection="column">
                <CurrencyQuoteTitle>{instrument.name}</CurrencyQuoteTitle>
              </FlexContainer>
            </CurrencyWrapper>
          ))}
      </FlexContainer>
      <FlexContainer justifyContent="space-between" padding="20px">
        <FlexContainer>
          {accounts.map((acc, index) => (
            <FlexContainer key={acc.id}>
              <AccountIndex>{index + 1}</AccountIndex>
              <FlexContainer flexDirection="column">
                <AccountName>{acc.id}</AccountName>
              </FlexContainer>
            </FlexContainer>
          ))}
        </FlexContainer>
        <FlexContainer>
          <img src={graphPlaceholder}></img>
        </FlexContainer>
        <FlexContainer flexDirection="column">
          <Button isBuy onClick={handleOpenPosition}>
            Buy
          </Button>
          <Button onClick={handleClosePosition}>Sell</Button>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
}

export default Dashboard;
