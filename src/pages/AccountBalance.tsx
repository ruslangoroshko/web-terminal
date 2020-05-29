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
import DatePickerDropdown from '../components/DatePickerDropdown';
import { TableGrid, Th } from '../styles/TableElements';
import BalanceHistoryItem from '../components/BalanceHistoryItem';
import InfinityScrollList from '../components/InfinityScrollList';
import BadRequestPopup from '../components/BadRequestPopup';
import { Observer } from 'mobx-react-lite';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import IconClose from '../assets/svg/icon-popup-close.svg';
import { useHistory } from 'react-router-dom';
import LoaderForComponents from '../components/LoaderForComponents';

function AccountBalance() {
  const { mainAppStore, badRequestPopupStore, dateRangeStore } = useStores();
  const { goBack } = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [balanceHistoryReport, setBalanceHistoryReport] = useState<
    BalanceHistoryReport
  >({
    balanceHistory: [],
    page: 0,
    pageSize: 20,
    totalItems: 0,
  });

  const fetchBalanceHistory = useCallback(
    async (isScrolling = false) => {
      setIsLoading(true);

      try {
        const response = await API.getBalanceHistory({
          // FIXME: typings
          accountId: mainAppStore.activeAccount!.id,
          endDate: dateRangeStore.endDate.valueOf(),
          startDate: dateRangeStore.startDate.valueOf(),
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
      } catch (error) {
        setIsLoading(false);
        badRequestPopupStore.openModal();
        badRequestPopupStore.setMessage(error);
      }
    },
    [
      dateRangeStore.endDate,
      dateRangeStore.startDate,
      balanceHistoryReport.page,
      mainAppStore.activeAccount,
    ]
  );
  useEffect(() => {
    if (mainAppStore.activeAccount) {
      fetchBalanceHistory().finally(() => {
        setIsLoading(false);
      });
    }
  }, [mainAppStore.activeAccount]);

  useEffect(() => {
    document.title = 'Balance history';
  }, []);

  return (
    <AccountSettingsContainer>
      <IconButton onClick={goBack}>
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
              Period:
            </PrimaryTextParagraph>
            <FlexContainer height="32px">
              <DatePickerDropdown datesChangeCallback={fetchBalanceHistory} />
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
        <FlexContainer flexDirection="column" maxHeight="calc(100vh - 200px)">
          <TableGrid columnsCount={4}>
            <Th>
              <FlexContainer padding="0 0 0 12px">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  Date
                </PrimaryTextSpan>
              </FlexContainer>
            </Th>
            <Th>
              <PrimaryTextSpan
                color="rgba(255, 255, 255, 0.4)"
                fontSize="11px"
                textTransform="uppercase"
              >
                Amount
              </PrimaryTextSpan>
            </Th>
            <Th>
              <PrimaryTextSpan
                color="rgba(255, 255, 255, 0.4)"
                fontSize="11px"
                textTransform="uppercase"
              >
                Balance
              </PrimaryTextSpan>
            </Th>
            <Th>
              <PrimaryTextSpan
                color="rgba(255, 255, 255, 0.4)"
                fontSize="11px"
                textTransform="uppercase"
              >
                Description
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
              {balanceHistoryReport.balanceHistory.map(item => (
                <BalanceHistoryItem
                  key={item.createdAt}
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
                There is no trading history
              </PrimaryTextSpan>
            </FlexContainer>
          )}
        </FlexContainer>
      </FlexContainer>
    </AccountSettingsContainer>
  );
}

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
