import React, { useState, useEffect } from 'react';
import API from '../helpers/API';
import styled from '@emotion/styled';
import { FlexContainer } from '../styles/FlexContainer';
import { AccountModel } from '../types/Accounts';
import { OpenPositionModel } from '../types/Positions';
import { SectionTitle } from '../styles/Titles';

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
    API.getAccounts().then(response => {
      setAccounts(response);
    });
  }, []);

  return (
    <FlexContainer
      width="100%"
      height="calc(100vh - 48px)"
      flexDirection="column"
    >
      <SectionTitle>Dashboard</SectionTitle>
      <AccountsList flexDirection="column">
        {accounts.map(acc => (
          <FlexContainer flexDirection="column" key={acc.id}>
            <Account>
              <span>Account id: {acc.id}</span>
            </Account>
            <FlexContainer>
              <Button onClick={handleOpenPosition}>Open</Button>
              <Button onClick={handleClosePosition}>Close</Button>
            </FlexContainer>
          </FlexContainer>
        ))}
      </AccountsList>
    </FlexContainer>
  );
}

export default Dashboard;

const AccountsList = styled(FlexContainer)``;

const Account = styled.div`
  background-color: antiquewhite;
  padding: 20px;
  font-size: 22px;
  color: black;
`;

const Button = styled.button`
  background-color: #09b91e;
  padding: 10px;
  color: #fff;
`;
