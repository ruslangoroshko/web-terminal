import React, { useState, useEffect } from 'react';
import API from '../helpers/API';
import { FlexContainer } from '../styles/FlexContainer';
import { AccountModel } from '../types/Accounts';
import { OpenPositionModel } from '../types/Positions';
import {
  Button,
  CurrencyQuoteIcon,
  CurrencyQuoteTitle,
  CurrencyWrapper,
  AccountIndex,
  AccountName,
  AccountLeverage,
  AccountBalance,
  AccountWrapper,
} from '../styles/Pages/Dashboard';
import initConnection from '../services/websocketService';
import currencyIcon from '../assets/img/currency.png';
import graphPlaceholder from '../assets/img/graph-placeholder.png';

interface Props {}

function Dashboard(props: Props) {
  const {} = props;

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
    const session = initConnection(WS_HOST);
    session.start();
    console.log(session);
    API.getAccounts().then(response => {
      setAccounts(response);
      response[0].instruments.forEach(item => {
        // session.subscribe(item.id, args => {
        //   console.log(args);
        // });
      });
    });
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
        <FlexContainer flexDirection="column">
          {accounts.map((acc, index) => (
            <AccountWrapper key={acc.id} padding="20px">
              <AccountIndex>{index + 1}</AccountIndex>
              <FlexContainer flexDirection="column">
                <AccountName>{acc.id}</AccountName>
                <AccountBalance>Balance: {acc.balance}</AccountBalance>
                <AccountLeverage>Leverage: {acc.leverage}</AccountLeverage>
              </FlexContainer>
            </AccountWrapper>
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
