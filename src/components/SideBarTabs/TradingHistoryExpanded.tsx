import React, { FC, useEffect, useState, useCallback } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import {
  PrimaryTextSpan,
  PrimaryTextParagraph,
} from '../../styles/TextsElements';
import styled from '@emotion/styled';
import { useStores } from '../../hooks/useStores';
import { Observer } from 'mobx-react-lite';
import { TabPortfolitButton } from './Portfolio';
import IconNoTradingHistory from '../../assets/svg/icon-no-trading-history.svg';
import SvgIcon from '../SvgIcon';
import IconClose from '../../assets/svg/icon-close.svg';
import DatePickerDropdown from '../DatePickerDropdown';
import API from '../../helpers/API';
import TradingHistoryExpandedItem from './TradingHistoryExpandedItem';
import { Th, TableGrid } from '../../styles/TableElements';
import InfinityScrollList from '../InfinityScrollList';
import { useTranslation } from 'react-i18next';
import {
  LOCAL_HISTORY_DATERANGE,
  LOCAL_HISTORY_PAGE,
  LOCAL_HISTORY_POSITION,
  LOCAL_HISTORY_TIME,
} from '../../constants/global';
import moment from 'moment';

const TradingHistoryExpanded: FC = () => {
  const { tabsStore, mainAppStore, historyStore, dateRangeStore } = useStores();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const closeExpanded = () => {
    tabsStore.setTabExpanded(false);
  };

  const fetchPositionsHistory = useCallback(
    async (isScrolling = false) => {
      const response = await API.getPositionsHistory({
        accountId: mainAppStore.activeAccountId,
        startDate: dateRangeStore.startDate.valueOf(),
        endDate: dateRangeStore.endDate.valueOf(),
        page: isScrolling ? historyStore.positionsHistoryReport.page + 1 : 1,
        pageSize: 20,
      });
      const pagesNow = localStorage.getItem(LOCAL_HISTORY_PAGE);
      if (isScrolling) {
        if (!!pagesNow || (pagesNow && parseInt(pagesNow) < response.page)) {
          localStorage.setItem(LOCAL_HISTORY_PAGE, `${response.page}`);
        }
      }
      historyStore.setPositionsHistoryReport({
        ...response,
        positionsHistory: isScrolling
          ? [
              ...historyStore.positionsHistoryReport.positionsHistory,
              ...response.positionsHistory,
            ].sort((a, b) => b.closeDate - a.closeDate)
          : response.positionsHistory,
      });
    },
    [
      mainAppStore.activeAccountId,
      dateRangeStore.startDate,
      dateRangeStore.endDate,
      historyStore.positionsHistoryReport,
    ]
  );

  useEffect(() => {
    if (mainAppStore.activeAccountId && tabsStore.isTabExpanded) {
      let checkScroll: boolean = false;
      const dataStart: string | null = localStorage.getItem(LOCAL_HISTORY_TIME);
      const neededData: string | null = mainAppStore.paramsPortfolioHistory || localStorage.getItem(
        LOCAL_HISTORY_POSITION
      );
      const neededPage: string | null = localStorage.getItem(
        LOCAL_HISTORY_PAGE
      );
      const neededRange: string | null = localStorage.getItem(
        LOCAL_HISTORY_DATERANGE
      );
      if (neededData) {
        if (neededPage && parseInt(neededPage) > 0) {
          checkScroll = true;
          for (let i = 1; i <= parseInt(neededPage) + 1; i++) {
            historyStore.setPositionsHistoryReport({
              ...historyStore.positionsHistoryReport,
              page: i,
            });
            fetchPositionsHistory(true).finally(() => {
              if (i <= parseInt(neededPage) + 1) {
                setIsLoading(false);
              }
            });
          }
        }
      }
      if (neededRange) {
        dateRangeStore.setDropdownValueType(parseInt(neededRange));
      }
      if (dataStart) {
        dateRangeStore.setStartDate(moment(dataStart));
      }
      if (!checkScroll) {
        fetchPositionsHistory().finally(() => {
          setIsLoading(false);
        });
      }
    }
    return () => {
      historyStore.setPositionsHistoryReport({
        ...historyStore.positionsHistoryReport,
        page: 1,
        positionsHistory: [],
      });
    };
  }, [mainAppStore.activeAccountId]);

  return (
    <TradingHistoryExpandedWrapper
      flexDirection="column"
      width="100%"
      position="relative"
    >
      <ButtonClose onClick={closeExpanded}>
        <SvgIcon
          {...IconClose}
          fillColor="rgba(255, 255, 255, 0.6)"
          hoverFillColor="#00FFDD"
        />
      </ButtonClose>
      <FlexContainer margin="0 0 40px 0" padding="0 0 0 8px">
        <TabPortfolitButton isActive>{t('Trading History')}</TabPortfolitButton>
      </FlexContainer>
      <FlexContainer width="100%" justifyContent="center">
        <FlexContainer flexDirection="column" width="1020px">
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
              <Observer>
                {() => (
                  <FlexContainer height="32px">
                    {tabsStore.isTabExpanded && (
                      <DatePickerDropdown
                        datesChangeCallback={fetchPositionsHistory}
                      />
                    )}
                  </FlexContainer>
                )}
              </Observer>
            </FlexContainer>
          </FlexContainer>
          <FlexContainer flexDirection="column" maxHeight="calc(100vh - 200px)">
            <TableGrid columnsCount={7}>
              <Th>
                <FlexContainer padding="0 0 0 12px">
                  <PrimaryTextSpan
                    color="rgba(255, 255, 255, 0.4)"
                    fontSize="11px"
                    textTransform="uppercase"
                  >
                    {t('Asset Name')}
                  </PrimaryTextSpan>
                </FlexContainer>
              </Th>
              <Th>
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  {t('Price open — close')}
                </PrimaryTextSpan>
              </Th>
              <Th>
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  {t('open — close')}
                </PrimaryTextSpan>
              </Th>
              <Th justifyContent="flex-end">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  {t('Investment')}
                </PrimaryTextSpan>
              </Th>
              <Th justifyContent="flex-end">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  {t('Profit/loss')}
                </PrimaryTextSpan>
              </Th>
              <Th justifyContent="center">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  {t('Equity')}
                </PrimaryTextSpan>
              </Th>
              <Th></Th>
              <Observer>
                {() => (
                  <InfinityScrollList
                    getData={fetchPositionsHistory}
                    listData={
                      historyStore.positionsHistoryReport.positionsHistory
                    }
                    isFetching={isLoading}
                    // WATCH CLOSELY
                    noMoreData={
                      historyStore.positionsHistoryReport.totalItems <
                      historyStore.positionsHistoryReport.page *
                        historyStore.positionsHistoryReport.pageSize
                    }
                  >
                    {historyStore.positionsHistoryReport.positionsHistory.map(
                      (item) => (
                        <TradingHistoryExpandedItem
                          key={item.id}
                          currencySymbol={
                            mainAppStore.activeAccount?.symbol || ''
                          }
                          tradingHistoryItem={item}
                        />
                      )
                    )}
                  </InfinityScrollList>
                )}
              </Observer>
            </TableGrid>
            <Observer>
              {() => (
                <>
                  {!historyStore.positionsHistoryReport.positionsHistory
                    .length && (
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
                      <PrimaryTextSpan
                        color="rgba(255,255,255,0.17)"
                        fontWeight="bold"
                      >
                        {t('There is no trading history')}
                      </PrimaryTextSpan>
                    </FlexContainer>
                  )}
                </>
              )}
            </Observer>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </TradingHistoryExpandedWrapper>
  );
};

export default TradingHistoryExpanded;

const TradingHistoryExpandedWrapper = styled(FlexContainer)`
  background: radial-gradient(
      92.11% 100% at 0% 0%,
      rgba(255, 252, 204, 0.08) 0%,
      rgba(255, 252, 204, 0) 100%
    ),
    #252636;
  box-shadow: inset 0px 1px 0px rgba(255, 255, 255, 0.08);
  border-radius: 8px 0px 0px 0px;
`;

const ButtonClose = styled(ButtonWithoutStyles)`
  position: absolute;
  top: 12px;
  right: 12px;
`;
