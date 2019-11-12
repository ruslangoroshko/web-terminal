import React, { useState, useEffect } from 'react';
import API from '../helpers/API';
import { FlexContainer } from '../styles/FlexContainer';
import { AccountModel } from '../types/Accounts';
import { OpenPositionModel } from '../types/Positions';
import {
  Button,
  CurrencyQuoteIcon,
  CurrencyQuoteTitle,
  QuotesFeedWrapper,
  AccountIndex,
  AccountName,
  AccountLeverage,
  AccountBalance,
  AccountWrapper,
} from '../styles/Pages/Dashboard';
import initConnection from '../services/websocketService';
import currencyIcon from '../assets/images/currency.png';
import graphPlaceholder from '../assets/images/graph-placeholder.png';
import { Formik, Form, Field, FieldProps } from 'formik';
import styled from '@emotion/styled';

interface Props {}
interface MyFormValues {
  tp: OpenPositionModel['tp'];
  sl: OpenPositionModel['sl'];
}

function Dashboard(props: Props) {
  const {} = props;

  const [accounts, setAccounts] = useState<AccountModel[]>([]);
  const initialValues: MyFormValues = {
    tp: 2,
    sl: 3,
  };
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
            <>
              <QuotesFeedWrapper key={instrument.id} padding="10px">
                <FlexContainer alignItems="center" justifyContent="center">
                  <CurrencyQuoteIcon src={currencyIcon} />
                </FlexContainer>
                <FlexContainer flexDirection="column">
                  <CurrencyQuoteTitle>{instrument.name}</CurrencyQuoteTitle>
                </FlexContainer>
              </QuotesFeedWrapper>
            </>
          ))}
        {accounts.length > 0 && (
          <AccountWrapper padding="20px">
            <FlexContainer flexDirection="column">
              <AccountBalance>
                Total balance: {accounts[0].balance}
              </AccountBalance>
              <AccountName>Account id: {accounts[0].id}</AccountName>
              <AccountLeverage>
                Leverage: {accounts[0].leverage}
              </AccountLeverage>
            </FlexContainer>
          </AccountWrapper>
        )}
      </FlexContainer>
      <FlexContainer justifyContent="space-between" padding="20px">
        <FlexContainer flexDirection="column" width="200px">
          dunno what's here
        </FlexContainer>
        <FlexContainer>
          <img src={graphPlaceholder}></img>
        </FlexContainer>
        <FlexContainer flexDirection="column">
          <Formik
            initialValues={initialValues}
            onSubmit={(values, actions) => {
              console.log({ values, actions });
              actions.setSubmitting(false);
            }}
          >
            {formikBag => (
              <Form>
                <Field type="text" name="tp">
                  {({ field, form, meta }: FieldProps) => (
                    <div>
                      <Title>Take profit</Title>
                      <input type="text" {...field} placeholder="Take profit" />
                      {meta.touched && meta.error}
                    </div>
                  )}
                </Field>
                <Field
                  type="text"
                  name="sl"
                  render={({ field, form, meta }: any) => (
                    <div>
                      <Title>Stop loss</Title>
                      <input type="text" {...field} placeholder="Stop loss" />
                      {meta.touched && meta.error}
                    </div>
                  )}
                />
              </Form>
            )}
          </Formik>
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

const Title = styled.span`
  color: #fff;
`;
