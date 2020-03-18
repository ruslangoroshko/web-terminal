import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import AccountSettingsContainer from '../containers/AccountSettingsContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';

interface Props {}

function AccountBalance(props: Props) {
  const {} = props;
  console.log('account balance is gere');
  return (
    <AccountSettingsContainer>
      <FlexContainer>
        <PrimaryTextSpan color="#fffccc">AccountBalance</PrimaryTextSpan>
      </FlexContainer>
    </AccountSettingsContainer>
  );
}

export default AccountBalance;
