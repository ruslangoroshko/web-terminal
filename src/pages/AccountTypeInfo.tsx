import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { useTranslation } from 'react-i18next';
import AccountSettingsContainer from '../containers/AccountSettingsContainer';
import Page from '../constants/Pages';
import SvgIcon from '../components/SvgIcon';
import IconClose from '../assets/svg/icon-popup-close.svg';
import IconFire from '../assets/svg/account-types/icon-fire.svg';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { useHistory } from 'react-router-dom';
import { observer, Observer } from 'mobx-react-lite';
import AccountStatusProgress from '../components/AccountStatusProgress';
import AboutStatusTable from '../components/AboutStatusTable';
import { useStores } from '../hooks/useStores';
import { PrimaryTextSpan } from '../styles/TextsElements';

const AccountTypeInfo = observer(() => {
  const { tabsStore } = useStores();
  const { t } = useTranslation();
  const { push } = useHistory();

  return (
    <AccountSettingsContainer>
      <FlexContainer
        width={tabsStore.sideBarTabType !== null ? 'calc(100% - 444px)' : '100%'}
        flexDirection="column"
        margin="0"
        position="relative"
      >
        <IconButton onClick={() => push(Page.DASHBOARD)}>
          <SvgIcon
            {...IconClose}
            fillColor="rgba(255, 255, 255, 0.6)"
            hoverFillColor="#00FFDD"
          > </SvgIcon>
        </IconButton>
        <AccountStatusProgress />
        <Observer>
          {() => <AboutStatusTable />}
        </Observer>
        <FlexContainer
          width="100%"
          maxWidth="1064px"
          margin="24px auto 0"
          backgroundColor="rgba(255, 255, 255, 0.04)"
          border="1px solid rgba(255, 255, 255, 0.12)"
          borderRadius="5px"
          boxShadow="0px 4px 12px rgba(0, 0, 0, 0.08)"
          padding="16px 24px"
          alignItems="center"
        >
          <FlexContainer
            width="40px"
            height="40px"
            borderRadius="20px"
            backgroundColor="#FFFCCC"
            alignItems="center"
            justifyContent="center"
            marginRight="16px"
          >
            <SvgIcon
              {...IconFire}
              fillColor="#1C1F26"
            />
          </FlexContainer>
          <FlexContainer
            flexDirection="column"
          >
            <PrimaryTextSpan
              fontSize="14px"
              lineHeight="14px"
              fontWeight={700}
              color="#FFFCCC"
              marginBottom="4px"
            >
              {t('Personalized conditions')}
            </PrimaryTextSpan>
            <PrimaryTextSpan
              fontSize="12px"
              lineHeight="12px"
              fontWeight={400}
              color="rgba(255, 255, 255, 0.64)"
            >
              {t('Exclusive from $100,000')}
            </PrimaryTextSpan>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </AccountSettingsContainer>
  );
});

export default AccountTypeInfo;

const IconButton = styled(ButtonWithoutStyles)`
  margin-right: 8px;
  position: absolute;
  top: -20px;
  right: -10px;
  z-index: 1;
  &:last-of-type {
    margin-right: 0;
  }
`;
