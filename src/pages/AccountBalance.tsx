import React, { useEffect, useState, useCallback } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import AccountSettingsContainer from '../containers/AccountSettingsContainer';
import { PrimaryTextSpan, PrimaryTextParagraph } from '../styles/TextsElements';
import API from '../helpers/API';
import { useStores } from '../hooks/useStores';
import { BalanceHistoryReport } from '../types/HistoryReportTypes';
import styled from '@emotion/styled';
import SvgIcon from '../components/SvgIcon';
import IconNoTradingHistory from '../assets/svg/icon-no-trading-history.svg';
import { TableGrid, Th } from '../styles/TableElements';
import BalanceHistoryItem from '../components/BalanceHistoryItem';
import InfinityScrollList from '../components/InfinityScrollList';
import BadRequestPopup from '../components/BadRequestPopup';
import { Observer } from 'mobx-react-lite';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import IconClose from '../assets/svg/icon-popup-close.svg';
import { useHistory } from 'react-router-dom';
import LoaderForComponents from '../components/LoaderForComponents';
import Page from '../constants/Pages';
import { useTranslation } from 'react-i18next';
import Helmet from 'react-helmet';
import DatePickerAccountBalanceDropdown from '../components/DatePickerAccountBalanceDropdown';
import NotificationPopup from '../components/NotificationPopup';
import { NullLogger } from '@aspnet/signalr';

const AccountBalance = () => {
  const {
    mainAppStore,
    badRequestPopupStore,
    dateRangeAccountBalanceStore,
    notificationStore,
  } = useStores();
  const { push } = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [balanceHistoryReport, setBalanceHistoryReport] = useState<
    BalanceHistoryReport
  >({
    balanceHistory: [],
    page: 0,
    pageSize: 20,
    totalItems: 0,
  });

  const { t } = useTranslation();

  const fetchBalanceHistory = useCallback(
    async (isScrolling = false) => {
      setIsLoading(true);
      try {
        const response = await API.getBalanceHistory({
          // FIXME: typings
          accountId: mainAppStore.accounts.find((acc) => acc.isLive)!.id,
          endDate: dateRangeAccountBalanceStore.endDate.valueOf(),
          startDate: dateRangeAccountBalanceStore.startDate.valueOf(),
          page: isScrolling ? balanceHistoryReport.page + 1 : 1,
          pageSize: 20,
        });

        const newBalanceHistory: BalanceHistoryReport = {
          ...response,
          balanceHistory: isScrolling
            ? [
                ...balanceHistoryReport.balanceHistory,
                ...response.balanceHistory,
              ]
            : response.balanceHistory,
        };
        setBalanceHistoryReport(newBalanceHistory);
        setIsLoading(false);
      } catch (error) {}
    },
    [
      dateRangeAccountBalanceStore.endDate,
      dateRangeAccountBalanceStore.startDate,
      balanceHistoryReport.page,
      mainAppStore.activeAccount,
    ]
  );
  useEffect(() => {
    let cleanupFunction = false;
    if (mainAppStore.activeAccount) {
      fetchBalanceHistory().finally(() => {
        if (!cleanupFunction) setIsLoading(false);
      });
    }
    return () => {
      cleanupFunction = true;
    };
  }, [mainAppStore.activeAccount]);

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
      <Helmet>{t('Balance history')}</Helmet>
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
      <FlexContainer flexDirection="column">
        <FlexContainer
          justifyContent="space-between"
          alignItems="flex-end"
          padding="0 32px 0 12px"
          margin="0 0 32px 0"
        >
          <FlexContainer flexDirection="column">
            <PrimaryTextParagraph
              color="rgba(255, 255, 255, 0.4)"
              marginBottom="4px"
              fontSize="11px"
              textTransform="uppercase"
            >
              {t('Period')}:
            </PrimaryTextParagraph>
            <FlexContainer height="32px">
              <DatePickerAccountBalanceDropdown
                datesChangeCallback={fetchBalanceHistory}
              />
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
        <FlexContainer
          flexDirection="column"
          maxHeight="calc(100vh - 200px)"
          overflow="auto"
        >
          <TableGrid columnsCount={4}>
            <Th>
              <FlexContainer padding="0 0 0 12px">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  {t('Date')}
                </PrimaryTextSpan>
              </FlexContainer>
            </Th>
            <Th>
              <PrimaryTextSpan
                color="rgba(255, 255, 255, 0.4)"
                fontSize="11px"
                textTransform="uppercase"
              >
                {t('Amount')}
              </PrimaryTextSpan>
            </Th>
            <Th>
              <PrimaryTextSpan
                color="rgba(255, 255, 255, 0.4)"
                fontSize="11px"
                textTransform="uppercase"
              >
                {t('Balance')}
              </PrimaryTextSpan>
            </Th>
            <Th>
              <PrimaryTextSpan
                color="rgba(255, 255, 255, 0.4)"
                fontSize="11px"
                textTransform="uppercase"
              >
                {t('Description')}
              </PrimaryTextSpan>
            </Th>
            <InfinityScrollList
              getData={fetchBalanceHistory}
              listData={balanceHistoryReport?.balanceHistory || []}
              isFetching={isLoading}
              // WATCH CLOSELY
              noMoreData={
                balanceHistoryReport.totalItems <
                balanceHistoryReport.page * balanceHistoryReport.pageSize
              }
            >
              {balanceHistoryReport.balanceHistory.map((item) => (
                <BalanceHistoryItem
                  key={item.description}
                  balanceHistoryItem={item}
                />
              ))}
            </InfinityScrollList>
          </TableGrid>
          {!balanceHistoryReport.balanceHistory.length && (
            <FlexContainer
              padding="16px"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              margin="100px 0 0 0"
            >
              <FlexContainer margin="0 0 20px">
                <SvgIcon
                  {...IconNoTradingHistory}
                  fillColor="rgba(255, 255, 255, 0.5)"
                />
              </FlexContainer>
              <PrimaryTextSpan color="rgba(255,255,255,0.17)" fontWeight="bold">
                {t('There is no balance history')}
              </PrimaryTextSpan>
            </FlexContainer>
          )}
        </FlexContainer>
      </FlexContainer>
    </AccountSettingsContainer>
  );
};

export default AccountBalance;

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
