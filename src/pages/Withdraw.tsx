import React, { useEffect, useState, useCallback } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import AccountSettingsContainer from '../containers/AccountSettingsContainer';
import { PrimaryTextSpan, PrimaryTextParagraph } from '../styles/TextsElements';
import API from '../helpers/API';
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
import { WithdrawalHistoryModel } from '../types/WithdrawalTypes';
import { WithdrawalStatusesEnum } from '../enums/WithdrawalStatusesEnum';
import { WithdrawalHistoryResponseStatus } from '../enums/WithdrawalHistoryResponseStatus';
import { WithdrawalTypesEnum } from '../enums/WithdrawalTypesEnum';
import { WithdrawalTabsEnum } from '../enums/WithdrawalTabsEnum';

function AccountSecurity() {
  const {
    mainAppStore,
    badRequestPopupStore,
    notificationStore,
    withdrawalStore,
  } = useStores();

  const { push } = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const openTab = (tab: number) => {
    withdrawalStore.opentTab(tab);
  };

  useEffect(() => {
    document.title = 'Account withdraw';
  }, []);

  return (
    <AccountSettingsContainer>
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
          hoverFillColor="#00FFDD"
        ></SvgIcon>
      </IconButton>
      <Observer>
        {() => <>{badRequestPopupStore.isActive && <BadRequestPopup />}</>}
      </Observer>

      <Observer>
        {() => (
          <LoaderForComponents
            isLoading={isLoading}
            backgroundColor="#252637"
          />
        )}
      </Observer>
      <FlexContainer flexDirection="column" width="708px" margin="0 0 0 80px">
        <PrimaryTextSpan
          color="#FFFCCC"
          fontSize="24px"
          fontWeight="bold"
          marginBottom="40px"
        >
          Withdraw
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
                    active={withdrawalStore.activeTab === WithdrawalTabsEnum.Request}
                  >
                    Request
                  </TabControllItem>
                  <TabControllItem
                    onClick={() => openTab(WithdrawalTabsEnum.History)}
                    active={withdrawalStore.activeTab === WithdrawalTabsEnum.History}
                  >
                    History
                  </TabControllItem>
                </TabControllsWraper>
              </FlexContainer>

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
  color: ${props => (props.active ? '#fffccc' : '#979797')};
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
    height: ${props => (props.active ? '2px' : '1px')};
    background: ${props => (props.active ? '#FFFCCC' : '#46484d')};
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
