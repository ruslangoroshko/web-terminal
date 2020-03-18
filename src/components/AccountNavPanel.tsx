import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';
import { PrimaryTextSpan } from '../styles/TextsElements';
import Page from '../constants/Pages';

interface Props {}

const AccountNavPanel = () => (
  <FlexContainer flexDirection="column" margin="0 40px 0 0">
    <FlexContainer flexDirection="column">
      <CustomNavLink to={Page.ACCOUNT_PROFILE} activeClassName="active">
        <PrimaryTextSpan color="#fffccc">Profile</PrimaryTextSpan>
      </CustomNavLink>
    </FlexContainer>
    <FlexContainer flexDirection="column">
      <CustomNavLink to={Page.ACCOUNT_DEPOSIT} activeClassName="active">
        <PrimaryTextSpan color="#fffccc">Deposit</PrimaryTextSpan>
      </CustomNavLink>
      <CustomNavLink to={Page.ACCOUNT_WITHDRAW} activeClassName="active">
        <PrimaryTextSpan color="#fffccc">Withdraw</PrimaryTextSpan>
      </CustomNavLink>
    </FlexContainer>
    <FlexContainer flexDirection="column">
      <CustomNavLink to={Page.ACCOUNT_BALANCE_HISTORY} activeClassName="active">
        <PrimaryTextSpan color="#fffccc">Balance history</PrimaryTextSpan>
      </CustomNavLink>
      <CustomNavLink to={Page.ACCOUNT_SETTINGS} activeClassName="active">
        <PrimaryTextSpan color="#fffccc">Settings</PrimaryTextSpan>
      </CustomNavLink>
      <CustomNavLink to={Page.ACCOUNT_HISTORY_QUOTES} activeClassName="active">
        <PrimaryTextSpan color="#fffccc">Historical quotes</PrimaryTextSpan>
      </CustomNavLink>
    </FlexContainer>
  </FlexContainer>
);

export default AccountNavPanel;

const CustomNavLink = styled(NavLink)`
  margin-bottom: 16px;

  &:last-of-type {
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }

  &.active > span {
    color: #21b3a4;
  }
`;
