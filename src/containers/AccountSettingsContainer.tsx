import React, { FC } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import AccountNavPanel from '../components/AccountNavPanel';

const AccountSettingsContainer: FC = ({ children }) => (
  <FlexContainer
    height="100%"
    width="100%"
    position="relative"
    padding="30px 20px"
  >
    <AccountNavPanel></AccountNavPanel>
    {children}
  </FlexContainer>
);

export default AccountSettingsContainer;
