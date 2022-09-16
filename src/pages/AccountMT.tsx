import React, { useEffect, useState } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import SvgIcon from '../components/SvgIcon';
import IconClose from '../assets/svg/icon-close.svg';
import IconPlus from '../assets/svg/icon-plus.svg';
import MT5Logo from '../assets/images/logo_MT5.png';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { PrimaryTextSpan } from '../styles/TextsElements';
import AccountSettingsContainer from '../containers/AccountSettingsContainer';
import { useHistory } from 'react-router-dom';
import Page from '../constants/Pages';
import { useStores } from '../hooks/useStores';
import { Observer, observer } from 'mobx-react-lite';
import AccountMTItem from '../components/AccountMTItem';
import { AccountModelWebSocketDTO, MTAccountDTO } from '../types/AccountsTypes';
import { moneyFormatPart } from '../helpers/moneyFormat';
import LoaderForComponents from '../components/LoaderForComponents';
import API from '../helpers/API';
import BadRequestPopup from '../components/BadRequestPopup';
import NotificationPopup from '../components/NotificationPopup';

const AccountMT = observer(() => {
  const { t } = useTranslation();

  const { mainAppStore, accountTypeStore, quotesStore, badRequestPopupStore, notificationStore } = useStores();
  const { push } = useHistory();

  const [accountInfo, setAccountInfo] = useState<AccountModelWebSocketDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [MTAccountInfo, setMTAccountInfo] = useState<MTAccountDTO[] | null>(null);

  const handleClosePage = () => {
    push(Page.DASHBOARD);
  };

  const handleOpenPopup = async () => {
    if (isLoading) {
      return false;
    }
    try {
      setIsLoading(true);
      const response = await API.createMTAccounts(mainAppStore.initModel.tradingUrl);
      if (
        !!response.investorPassword &&
        !!response.login &&
        !!response.traderId &&
        !!response.accountId &&
        !!response.password &&
        !!response.serverName
      ) {
        accountTypeStore.setNewMTAccountInfo(response);
        accountTypeStore.setShowMTPopup(true);
        setIsLoading(false);
        try {
          const responseGet = await API.getMTAccounts(mainAppStore.initModel.tradingUrl);
          const checkData = responseGet.some((item) => {
            return (
              !item.serverName ||
              !(item.margin || (item.margin === 0)) ||
              !(item.login || (item.login === 0)) ||
              !(item.balance || (item.balance === 0)) ||
              !item.accountId ||
              !item.tradeUrl
            );
          });
          if (checkData) {
            setIsLoading(false);
            badRequestPopupStore.openModal();
          } else {
            if (responseGet.length > 0) {
              setMTAccountInfo(responseGet);
            }
          }
        } catch (error) {
          accountTypeStore.setShowMTErrorPopup(true);
        }
      } else {
        setIsLoading(false);
        badRequestPopupStore.openModal();
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setAccountInfo(mainAppStore.accounts.find((item) => item.isLive) || null);
    async function fetchMTAccount() {
      try {
        const response = await API.getMTAccounts(mainAppStore.initModel.tradingUrl);
        const checkData = response.some((item) => {
          return (
            !item.serverName ||
            !(item.margin || (item.margin === 0)) ||
            !(item.login || (item.login === 0)) ||
            !(item.balance || (item.balance === 0)) ||
            !item.accountId ||
            !item.tradeUrl
          );
        });
        if (checkData) {
          setIsLoading(false);
          badRequestPopupStore.openModal();
        } else {
          if (response.length > 0) {
            setMTAccountInfo(response);
          }
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        accountTypeStore.setShowMTErrorPopup(true);
      }
    }
    fetchMTAccount();
  }, []);

  useEffect(() => {
    if (!accountTypeStore.isMTAvailable) {
      push(Page.DASHBOARD);
    }
  }, []);

  return (
    <AccountSettingsContainer>
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
      <FlexContainer
        width="100%"
        maxWidth="1064px"
        margin="0"
        flexDirection="column"
        overflow="auto"
      >
        <IconButton onClick={handleClosePage}>
          <SvgIcon
            {...IconClose}
            fillColor="rgba(255, 255, 255, 0.6)"
            hoverFillColor="#00FFF2"
            width="16px"
            height="16px"
          />
        </IconButton>
        <Observer>
          {() => <>{badRequestPopupStore.isActive && <BadRequestPopup />}</>}
        </Observer>
        <AccountMTItem
          isST={true}
          bonus={moneyFormatPart(accountInfo?.bonus || 0).full}
          balance={moneyFormatPart(accountInfo?.balance || 0).full}
          margin={moneyFormatPart(quotesStore.invest || 0).full}
          icon={mainAppStore.initModel.favicon}
          tradingLink={Page.DASHBOARD}
          depositLink={Page.DEPOSIT_POPUP}
        />
        {
          MTAccountInfo !== null
            ? <>
              {MTAccountInfo.map((item, index) => <AccountMTItem
                key={`${item.login}_${index}`}
                isST={false}
                balance={moneyFormatPart(item?.balance || 0).full}
                margin={moneyFormatPart(item?.margin || 0).full}
                icon={MT5Logo}
                tradingLink={item.tradeUrl}
                depositLink={Page.DEPOSIT_POPUP}
                server={item.serverName}
                login={`${item.login}`}
                accountId={item.accountId}
              />)}
            </>
            : <FlexContainer
              padding="48px 36px"
              background="rgba(255, 255, 255, 0.04)"
              border="1px dashed rgba(255, 255, 255, 0.64)"
              borderRadius="5px"
              width="100%"
              alignItems="center"
              cursor="pointer"
              position="relative"
              onClick={handleOpenPopup}
            >
              {isLoading && <LoaderForComponents backgroundColor="rgba(0, 0, 0, 0.3)" isLoading={isLoading}/>}
              <FlexContainer marginRight="36px">
                <SvgIcon
                  {...IconPlus}
                  fillColor="none"
                />
              </FlexContainer>
              <PrimaryTextSpan
                fontWeight={500}
                fontSize="20px"
                lineHeight="150%"
              >
                {t('Create MT5 Account')}
              </PrimaryTextSpan>
            </FlexContainer>
        }
      </FlexContainer>
    </AccountSettingsContainer>
  );
});

export default AccountMT;

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
