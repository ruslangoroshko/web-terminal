import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { useTranslation } from 'react-i18next';
import AccountSettingsContainer from '../containers/AccountSettingsContainer';
import Page from '../constants/Pages';
import SvgIcon from '../components/SvgIcon';
import IconClose from '../assets/svg/icon-popup-close.svg';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { useHistory } from 'react-router-dom';
import { observer, Observer } from 'mobx-react-lite';
import AccountStatusProgress from '../components/AccountStatusProgress';
import AboutStatusTable from '../components/AboutStatusTable';
import { useStores } from '../hooks/useStores';

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
