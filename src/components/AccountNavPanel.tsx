import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';
import { PrimaryTextSpan, PrimaryTextParagraph } from '../styles/TextsElements';
import Page from '../constants/Pages';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { useStores } from '../hooks/useStores';
import { useTranslation } from 'react-i18next';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../constants/mixpanelEvents';
import mixapanelProps from '../constants/mixpanelProps';

const AccountNavPanel = () => {
  const { mainAppStore, tabsStore } = useStores();
  const { t } = useTranslation();
  const handleLogoutClick = () => {
    tabsStore.closeAnyTab();
    mixpanel.track(mixpanelEvents.LOGOUT, {
      [mixapanelProps.BRAND_NAME]: mainAppStore.initModel.brandProperty,
    });
    mainAppStore.signOut();
  };
  return (
    <FlexContainer flexDirection="column" margin="0 40px 0 0" width="140px">
      <PrimaryTextParagraph
        color="#fffccc"
        fontSize="20px"
        fontWeight="bold"
        marginBottom="34px"
      >
        {t('Account')}
      </PrimaryTextParagraph>

      <FlexContainer flexDirection="column">
        <CustomNavLink to={Page.ACCOUNT_SEQURITY} activeClassName="active">
          <AccountLinkSpan color="#fffccc">{t('Security')}</AccountLinkSpan>
        </CustomNavLink>

        <CustomNavLink
          to={Page.ACCOUNT_BALANCE_HISTORY}
          activeClassName="active"
        >
          <AccountLinkSpan color="#fffccc">
            {t('Balance history')}
          </AccountLinkSpan>
        </CustomNavLink>

        <CustomNavLink to={Page.ACCOUNT_WITHDRAW} activeClassName="active">
          <AccountLinkSpan color="#fffccc">{t('Withdraw')}</AccountLinkSpan>
        </CustomNavLink>
      </FlexContainer>
      <FlexContainer flexDirection="column">
        <LogoutButton onClick={handleLogoutClick}>
          <AccountLinkSpan color="#fffccc">{t('Logout')}</AccountLinkSpan>
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

  &.active {
    pointer-events: none;
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
  will-change: color;

  &:hover {
    color: #21b3a4;
  }
`;

const LogoutButton = styled(ButtonWithoutStyles)`
  text-align: left;
`;
