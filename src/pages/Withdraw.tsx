import React, { useEffect } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import AccountSettingsContainer from '../containers/AccountSettingsContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { useStores } from '../hooks/useStores';
import styled from '@emotion/styled';
import SvgIcon from '../components/SvgIcon';
import BadRequestPopup from '../components/BadRequestPopup';
import { Observer } from 'mobx-react-lite';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import IconClose from '../assets/svg/icon-popup-close.svg';
import { useHistory } from 'react-router-dom';
import LoaderForComponents from '../components/LoaderForComponents';
import NotificationPopup from '../components/NotificationPopup';
import Page from '../constants/Pages';
import WithdrawRequestTab from '../components/Withdraw/WithdrawRequestTab';
import WithdrawHistoryTab from '../components/Withdraw/WithdrawHistoryTab';
import { WithdrawalTabsEnum } from '../enums/WithdrawalTabsEnum';
import { useTranslation } from 'react-i18next';
import Helmet from 'react-helmet';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../constants/mixpanelEvents';
import mixapanelProps from '../constants/mixpanelProps';
import Colors from '../constants/Colors';

function AccountSecurity() {
  const {
    badRequestPopupStore,
    notificationStore,
    withdrawalStore,
    mainAppStore,
  } = useStores();

  const { push } = useHistory();
  const { t } = useTranslation();

  const openTab = (tab: number) => {
    withdrawalStore.opentTab(tab);
  };

  useEffect(() => {
    mixpanel.track(mixpanelEvents.WITHDRAW_VIEW, {
      [mixapanelProps.AVAILABLE_BALANCE]:
        mainAppStore.accounts.find((item) => item.isLive)?.balance || 0,
    });
  }, []);

  return (
    <AccountSettingsContainer>
      <Helmet>{t('Account withdraw')}</Helmet>
      <Observer>
        {() => (
          <>
            {withdrawalStore.loading && (
              <LoaderForComponents isLoading={withdrawalStore.loading} />
            )}
          </>
        )}
      </Observer>

      <FlexContainer
        position="absolute"
        bottom="100px"
        left="14px"
        zIndex="100"
      >
        <Observer>
          {() => (
            <NotificationPopup
              show={notificationStore.isActiveNotification}
            ></NotificationPopup>
          )}
        </Observer>
      </FlexContainer>

      <IconButton onClick={() => push(Page.DASHBOARD)}>
        <SvgIcon
          {...IconClose}
          fillColor="rgba(255, 255, 255, 0.6)"
          hoverFillColor={Colors.PRIMARY}
        ></SvgIcon>
      </IconButton>
      <Observer>
        {() => <>{badRequestPopupStore.isActive && <BadRequestPopup />}</>}
      </Observer>

      <FlexContainer flexDirection="column" width="708px" margin="0 0 0 80px">
        <PrimaryTextSpan fontSize="24px" fontWeight="bold" marginBottom="40px">
          {t('Withdraw')}
        </PrimaryTextSpan>

        <Observer>
          {() => (
            <>
              <FlexContainer marginBottom="46px">
                <TabControllsWraper
                  alignItems="flex-start"
                  justifyContent="center"
                >
                  <TabControllItem
                    onClick={() => openTab(WithdrawalTabsEnum.Request)}
                    active={
                      withdrawalStore.activeTab === WithdrawalTabsEnum.Request
                    }
                  >
                    {t('Request')}
                  </TabControllItem>
                  <TabControllItem
                    onClick={() => openTab(WithdrawalTabsEnum.History)}
                    active={
                      withdrawalStore.activeTab === WithdrawalTabsEnum.History
                    }
                  >
                    {t('History')}
                  </TabControllItem>
                </TabControllsWraper>
              </FlexContainer>
              {/* TODO: refactor to switch */}
              {withdrawalStore.activeTab === WithdrawalTabsEnum.Request && (
                <WithdrawRequestTab />
              )}
              {withdrawalStore.activeTab === WithdrawalTabsEnum.History && (
                <WithdrawHistoryTab />
              )}
            </>
          )}
        </Observer>
      </FlexContainer>
    </AccountSettingsContainer>
  );
}
export default AccountSecurity;

const IconButton = styled(ButtonWithoutStyles)`
  margin-right: 8px;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  &:last-of-type {
    margin-right: 0;
  }
`;

const TabControllsWraper = styled(FlexContainer)`
  width: 100%;
`;

const TabControllItem = styled(ButtonWithoutStyles)<{ active: boolean }>`
  width: 50%;
  color: ${(props) => (props.active ? Colors.ACCENT : '#979797')};
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  padding: 16px;
  position: relative;

  &:after {
    content: '';
    display: block;
    width: 100%;
    height: ${(props) => (props.active ? '2px' : '1px')};
    background: ${(props) => (props.active ? Colors.ACCENT : '#46484d')};
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    transition: all 0.2s ease;
  }

  &:hover {
    &:after {
      background: rgba(255, 252, 204, 0.48);
    }
  }
`;
