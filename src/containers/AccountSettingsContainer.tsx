import React, { FC } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import AccountNavPanel from '../components/AccountNavPanel';

const AccountSettingsContainer: FC = ({ children }) => (
  <FlexContainer
    height="100%"
    width="100%"
    position="relative"
    flexDirection="column"
    justifyContent="space-between"
  >
    <AccountNavPanel></AccountNavPanel>
    <FlexContainer>{children}</FlexContainer>
  </FlexContainer>
);

export default AccountSettingsContainer;
