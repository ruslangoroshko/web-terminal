import React, { FC, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import {
  PrimaryTextSpan,
  PrimaryTextParagraph,
  QuoteText,
} from '../../styles/TextsElements';
import { AccountModelWebSocketDTO } from '../../types/AccountsTypes';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import { SecondaryButton } from '../../styles/Buttons';
import { getNumberSign } from '../../helpers/getNumberSign';
import Topics from '../../constants/websocketTopics';
import Fields from '../../constants/fields';
import { useHistory } from 'react-router-dom';
import Page from '../../constants/Pages';
import { useTranslation } from 'react-i18next';
import { autorun } from 'mobx';
import CopyIcon from '../../assets/svg_no_compress/icon-copy.svg';
import SvgIcon from '../SvgIcon';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import {
  LOCAL_HISTORY_DATERANGE,
  LOCAL_HISTORY_PAGE,
  LOCAL_HISTORY_POSITION,
  LOCAL_HISTORY_TIME,
  LOCAL_INSTRUMENT_ACTIVE,
  LOCAL_MARKET_TABS,
  LOCAL_PENDING_POSITION,
  LOCAL_PENDING_POSITION_SORT,
  LOCAL_PORTFOLIO_TABS,
  LOCAL_POSITION,
  LOCAL_POSITION_SORT,
  LOCAL_STORAGE_SIDEBAR,
} from '../../constants/global';
import { ShowDatesDropdownEnum } from '../../enums/ShowDatesDropdownEnum';
import moment from 'moment';
import { PortfolioTabEnum } from '../../enums/PortfolioTabEnum';
import { SortByProfitEnum } from '../../enums/SortByProfitEnum';
import { SortByPendingOrdersEnum } from '../../enums/SortByPendingOrdersEnum';

interface Props {
  account: AccountModelWebSocketDTO;
  toggle: () => void;
}

const AccountInfo: FC<Props> = observer((props) => {
  const { account, toggle } = props;
  const {
    quotesStore,
    mainAppStore,
    tabsStore,
    notificationStore,
    depositFundsStore,
    tradingViewStore,
    withdrawalStore,
    dateRangeStore,
    sortingStore,
    markersOnChartStore,
  } = useStores();
  const { push } = useHistory();

  const [profit, setProfit] = useState(quotesStore.profit);
  const [total, setTotal] = useState(quotesStore.total);

  const { t } = useTranslation();

  const isActiveAccount = mainAppStore.activeAccountId === account.id;

  const handleSwitch = () => {
    mainAppStore.activeSession?.send(Topics.SET_ACTIVE_ACCOUNT, {
      [Fields.ACCOUNT_ID]: account.id,
    });
    tabsStore.setSideBarType(null);
    mainAppStore.setActiveAccount(account);
    localStorage.removeItem(LOCAL_STORAGE_SIDEBAR);
    localStorage.removeItem(LOCAL_POSITION);
    localStorage.removeItem(LOCAL_POSITION_SORT);
    localStorage.removeItem(LOCAL_MARKET_TABS);
    localStorage.removeItem(LOCAL_PORTFOLIO_TABS);
    localStorage.removeItem(LOCAL_INSTRUMENT_ACTIVE);
    localStorage.removeItem(LOCAL_PENDING_POSITION);
    localStorage.removeItem(LOCAL_PENDING_POSITION_SORT);
    localStorage.removeItem(LOCAL_HISTORY_POSITION);
    localStorage.removeItem(LOCAL_HISTORY_DATERANGE);
    localStorage.removeItem(LOCAL_HISTORY_TIME);
    localStorage.removeItem(LOCAL_HISTORY_PAGE);
    quotesStore.setActivePositions([]);
    quotesStore.setPendingOrders([]);
    tradingViewStore.setSelectedPendingPosition(undefined);
    tradingViewStore.setSelectedHistory(undefined);
    quotesStore.setSelectedPositionId(null);
    withdrawalStore.setHistory(null);
    sortingStore.setActivePositionsSortBy(SortByProfitEnum.NewFirstAsc);
    sortingStore.setPendingOrdersSortBy(SortByPendingOrdersEnum.NewFirstAsc);
    dateRangeStore.setDropdownValueType(ShowDatesDropdownEnum.Week);
    dateRangeStore.setStartDate(moment().subtract(1, 'weeks'));
    tabsStore.setPortfolioTab(PortfolioTabEnum.Portfolio);
    mainAppStore.setParamsAsset(null);
    mainAppStore.setParamsMarkets(null);
    mainAppStore.setParamsPortfolioActive(null);
    mainAppStore.setParamsPortfolioOrder(null);
    mainAppStore.setParamsPortfolioHistory(undefined);
    mainAppStore.setParamsPortfolioTab(null);
    mainAppStore.setParamsDeposit(false);
    toggle();
    push(Page.DASHBOARD);

    setTimeout(() => {
      markersOnChartStore.renderActivePositionsMarkersOnChart();
      notificationStore.setNotification(`${t(
        'Your account has been switched on'
      )} ${account.isLive ? t('Real') : t('Demo')}`);
      notificationStore.setIsSuccessfull(true);
      notificationStore.openNotification();
    }, 500);
  };

  const handleCopyText = (e: any, accountId: string) => {
    e.stopPropagation();
    let el = document.createElement('textarea');
    el.value = accountId;
    el.setAttribute('readonly', '');
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    notificationStore.setNotification(t('Copied to clipboard'));
    notificationStore.setIsSuccessfull(true);
    notificationStore.openNotificationGlobal();
  };

  useEffect(() => {
    const disposer = autorun(
      () => {
        setProfit(quotesStore.profit);
        setTotal(quotesStore.total);
      },
      { delay: 1000 }
    );
    return () => {
      disposer();
    };
  }, []);

  return (
    <AccountWrapper
      flexDirection="column"
      isActive={isActiveAccount}
      padding="16px 44px 16px 16px"
      width="736px"
      position="relative"
      onClick={isActiveAccount ? toggle : handleSwitch}
    >
      <FlexContainer justifyContent="space-between">
        <FlexContainer alignItems="flex-start">
          <FlexContainer
            backgroundColor={isActiveAccount ? '#fffccc' : '#C4C4C4'}
            alignItems="center"
            justifyContent="center"
            width="40px"
            height="40px"
            borderRadius="50%"
            marginRight="10px"
          >
            <FlexContainer
              width="16px"
              height="16px"
              borderRadius="50%"
              backgroundColor="#2A2D38"
              alignItems="center"
              justifyContent="center"
            >
              <PrimaryTextSpan
                fontSize="14px"
                color={isActiveAccount ? '#fffccc' : '#C4C4C4'}
              >
                {account.symbol}
              </PrimaryTextSpan>
            </FlexContainer>
          </FlexContainer>
          <FlexContainer
            flexDirection="column"
            marginRight="45px"
            width="125px"
          >
            <FlexContainer marginBottom="4px">
              <PrimaryTextSpan
                fontSize="16px"
                color={isActiveAccount ? '#fffccc' : 'rgba(255, 255, 255, 0.4)'}
                marginRight="6px"
                className={
                  isActiveAccount ? 'account_total_active' : 'account_total'
                }
              >
                {account.symbol}
                {isActiveAccount
                  ? total.toFixed(2)
                  : account.balance.toFixed(2)}
              </PrimaryTextSpan>
              <FlexContainer
                borderRadius="3px"
                backgroundColor={
                  isActiveAccount ? '#FFFCCC' : 'rgba(196, 196, 196, 0.5)'
                }
                padding="3px 10px"
                alignItems="center"
                justifyContent="center"
              >
                <PrimaryTextSpan
                  fontSize="8px"
                  color="1C1F26"
                  textTransform="uppercase"
                >
                  {account.isLive ? t('Real') : t('Demo')}
                </PrimaryTextSpan>
              </FlexContainer>
            </FlexContainer>
            <AccountId
              className={
                isActiveAccount ? 'account_total_active' : 'account_total'
              }
              fontSize="10px"
              color="rgba(255, 255, 255, 0.4)"
              textTransform="uppercase"
            >
              {account.id}
              <ButtonWithoutStyles
                onClick={(e) => handleCopyText(e, account.id)}
              >
                <SvgIcon
                  {...CopyIcon}
                  width="12px"
                  height="12px"
                  fillColor="#ffffff"
                />
              </ButtonWithoutStyles>
            </AccountId>
          </FlexContainer>
          {isActiveAccount && (
            <>
              <FlexContainer
                width="75px"
                margin="0 22px 0 0"
                flexDirection="column"
              >
                <PrimaryTextSpan
                  fontSize="16px"
                  color="#fffccc"
                  marginBottom="4px"
                >
                  {account.symbol}
                  {quotesStore.invest.toFixed(2)}
                </PrimaryTextSpan>
                <PrimaryTextParagraph
                  fontSize="10px"
                  color="rgba(255, 255, 255, 0.4)"
                >
                  {t('Invested')}
                </PrimaryTextParagraph>
              </FlexContainer>
              <FlexContainer
                width="84px"
                margin="0 24px 0 0"
                flexDirection="column"
              >
                <QuoteText
                  fontSize="16px"
                  isGrowth={profit >= 0}
                  marginBottom="4px"
                >
                  {getNumberSign(profit)}
                  {account.symbol}
                  {Math.abs(profit).toFixed(2)}
                </QuoteText>
                <PrimaryTextParagraph
                  fontSize="10px"
                  color="rgba(255, 255, 255, 0.4)"
                >
                  {t('Profit')}:
                </PrimaryTextParagraph>
              </FlexContainer>
              <FlexContainer width="84px" flexDirection="column">
                <PrimaryTextSpan
                  fontSize="16px"
                  color="#fffccc"
                  marginBottom="4px"
                >
                  {account.symbol}
                  {account.balance.toFixed(2)}
                </PrimaryTextSpan>
                <PrimaryTextParagraph
                  fontSize="10px"
                  color="rgba(255, 255, 255, 0.4)"
                >
                  {t('Available')}:
                </PrimaryTextParagraph>
              </FlexContainer>
            </>
          )}
        </FlexContainer>
        {account.isLive && (
          <DepositButton onClick={depositFundsStore.togglePopup}>
            <PrimaryTextSpan
              fontSize="14px"
              color={isActiveAccount ? '#fffccc' : 'rgba(196, 196, 196, 0.5)'}
              fontWeight="bold"
            >
              {t('Top Up')}
            </PrimaryTextSpan>
          </DepositButton>
        )}
      </FlexContainer>
    </AccountWrapper>
  );
});

export default AccountInfo;

const AccountWrapper = styled(FlexContainer)<{ isActive?: boolean }>`
  background: ${(props) => (props.isActive ? '#292C33' : '#1C1F26')};
  transition: 0.4s;
  height: 88px;
  padding: 24px 16px 24px 34px;
  cursor: pointer;
  position: relative;
  .account_total {
    transition: 0.4s;
  }
  &:hover {
    background: ${(props) =>
      props.isActive ? '#292C33' : 'rgba(41, 44, 51, 0.35)'};
    &:before {
      background: ${(props) =>
        props.isActive ? '#00FFDD' : 'rgba(41, 44, 51, 0.35)'};
    }
    .account_total {
      color: ${(props) => (props.isActive ? '#fffccc' : '#ffffff')};
    }
  }

  &:before {
    content: '';
    transition: 0.4s;
    background: ${(props) => (props.isActive ? '#00FFDD' : '#1C1F26')};
    position: absolute;
    border-radius: 50%;
    width: 8px;
    height: 8px;
    left: 12px;
    top: 40px;
  }
`;

const DepositButton = styled(SecondaryButton)`
  padding: 8px 16px;
  width: 144px;
  height: 40px;
`;

const AccountId = styled(PrimaryTextSpan)`
  display: flex;
  svg {
    display: none;
    margin-left: 7px;
    position: relative;
    top: -1px;
  }
  &:hover {
    svg {
      display: block;
    }
  }
`;
