import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';
import { PrimaryTextSpan, PrimaryTextParagraph } from '../styles/TextsElements';
import Page from '../constants/Pages';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { useStores } from '../hooks/useStores';

const AccountNavPanel = () => {
  const { mainAppStore } = useStores();
  return (
    <FlexContainer flexDirection="column" margin="0 40px 0 0" width="140px">
      <PrimaryTextParagraph
        color="#fffccc"
        fontSize="20px"
        fontWeight="bold"
        marginBottom="34px"
      >
        Account
      </PrimaryTextParagraph>
      {/* <FlexContainer flexDirection="column">
        <CustomNavLink to={Page.ACCOUNT_PROFILE} activeClassName="active">
          <AccountLinkSpan color="#fffccc">Profile</AccountLinkSpan>
        </CustomNavLink>
      </FlexContainer>
      <FlexContainer flexDirection="column">
        <CustomNavLink to={Page.ACCOUNT_DEPOSIT} activeClassName="active">
          <AccountLinkSpan color="#fffccc">Deposit</AccountLinkSpan>
        </CustomNavLink>
        <CustomNavLink to={Page.ACCOUNT_WITHDRAW} activeClassName="active">
          <AccountLinkSpan color="#fffccc">Withdraw</AccountLinkSpan>
        </CustomNavLink>
      </FlexContainer> */}
      <FlexContainer flexDirection="column">
        <CustomNavLink
          to={Page.ACCOUNT_BALANCE_HISTORY}
          activeClassName="active"
        >
          <AccountLinkSpan color="#fffccc">Balance history</AccountLinkSpan>
        </CustomNavLink>
        {/* <CustomNavLink to={Page.ACCOUNT_SETTINGS} activeClassName="active">
          <AccountLinkSpan color="#fffccc">Settings</AccountLinkSpan>
        </CustomNavLink>
        <CustomNavLink
          to={Page.ACCOUNT_HISTORY_QUOTES}
          activeClassName="active"
        >
          <AccountLinkSpan color="#fffccc">Historical quotes</AccountLinkSpan>
        </CustomNavLink> */}
      </FlexContainer>
      <FlexContainer flexDirection="column">
        <LogoutButton onClick={mainAppStore.signOut}>
          <AccountLinkSpan color="#fffccc">Logout</AccountLinkSpan>
        </LogoutButton>
      </FlexContainer>
    </FlexContainer>
  );
};

export default AccountNavPanel;

const CustomNavLink = styled(NavLink)`
  margin-bottom: 16px;

  &:last-of-type {
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding-bottom: 16px;
  }

  &.active > span {
    color: #21b3a4;
  }

  &:hover {
    text-decoration: none;
  }
`;

const AccountLinkSpan = styled(PrimaryTextSpan)`
  transition: color 0.2s ease;

  &:hover {
    color: #21b3a4;
  }
`;

const LogoutButton = styled(ButtonWithoutStyles)`
  text-align: left;
`;
