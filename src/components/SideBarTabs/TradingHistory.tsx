import React, { FC, useEffect, useState, useCallback } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import { useStores } from '../../hooks/useStores';
import { Observer } from 'mobx-react-lite';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import API from '../../helpers/API';
import IconNoTradingHistory from '../../assets/svg/icon-no-trading-history.svg';
import SvgIcon from '../SvgIcon';
import TradingHistoryItem from './TradingHistoryItem';
import DatePickerDropdownNoCustomDates from '../DatePickerDropdownNoCustomDates';
import LoaderForComponents from '../LoaderForComponents';
import InfinityScrollList from '../InfinityScrollList';

const TradingHistory: FC = () => {
  const { tabsStore, mainAppStore, historyStore, dateRangeStore } = useStores();

  const [isLoading, setIsLoading] = useState(true);

  const fetchPositionsHistory = useCallback(
    async (isScrolling = false) => {
      const response = await API.getPositionsHistory({
        accountId: mainAppStore.activeAccount!.id,
        startDate: dateRangeStore.startDate.valueOf(),
        endDate: dateRangeStore.endDate.valueOf(),
        page: isScrolling ? historyStore.positionsHistoryReport.page + 1 : 1,
        pageSize: 20,
      });
      historyStore.positionsHistoryReport = {
        ...response,
        positionsHistory: isScrolling
          ? [
              ...historyStore.positionsHistoryReport.positionsHistory,
              ...response.positionsHistory,
            ]
          : response.positionsHistory,
      };
    },
    [
      mainAppStore.activeAccount?.id,
      dateRangeStore.startDate,
      dateRangeStore.endDate,
      historyStore.positionsHistoryReport,
    ]
  );

  useEffect(() => {
    fetchPositionsHistory().finally(() => {
      setIsLoading(false);
    });
    return () => {
      historyStore.positionsHistoryReport = {
        ...historyStore.positionsHistoryReport,
        page: 1,
        positionsHistory: [],
      };
    };
  }, []);

  return (
    <PortfolioWrapper flexDirection="column" height="100%">
      <FlexContainer padding="12px 16px" margin="0 0 8px 0">
        <PrimaryTextSpan
          fontSize="12px"
          color="#fffccc"
          textTransform="uppercase"
        >
          Trading History
        </PrimaryTextSpan>
      </FlexContainer>
      <SortByWrapper
        backgroundColor="rgba(65, 66, 83, 0.5)"
        padding="10px 16px"
        alignItems="center"
      >
        <PrimaryTextSpan
          color="rgba(255, 255, 255, 0.4)"
          marginRight="4px"
          fontSize="10px"
          textTransform="uppercase"
        >
          Show:
        </PrimaryTextSpan>
        <Observer>
          {() => (
            <FlexContainer height="16px">
              {!tabsStore.isTabExpanded && (
                <DatePickerDropdownNoCustomDates
                  datesChangeCallback={fetchPositionsHistory}
                />
              )}
            </FlexContainer>
          )}
        </Observer>
      </SortByWrapper>
      <Observer>
        {() => (
          <TradingHistoryWrapper flexDirection="column" position="relative">
            <LoaderForComponents isLoading={isLoading} />

            <InfinityScrollList
              getData={fetchPositionsHistory}
              listData={historyStore.positionsHistoryReport.positionsHistory}
              isFetching={isLoading}
              // WATCH CLOSELY
              noMoreData={
                historyStore.positionsHistoryReport.totalItems <=
                historyStore.positionsHistoryReport.page *
                  historyStore.positionsHistoryReport.pageSize
              }
            >
              {historyStore.positionsHistoryReport.positionsHistory.map(
                item => (
                  <TradingHistoryItem
                    key={item.id}
                    tradingHistoryItem={item}
                    currencySymbol={mainAppStore.activeAccount?.symbol || ''}
                  />
                )
              )}
            </InfinityScrollList>

            {!historyStore.positionsHistoryReport.positionsHistory.length &&
              !isLoading && (
                <FlexContainer
                  padding="16px"
                  flexDirection="column"
                  alignItems="center"
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
                    There is no trading history
                  </PrimaryTextSpan>
                </FlexContainer>
              )}
          </TradingHistoryWrapper>
        )}
      </Observer>
    </PortfolioWrapper>
  );
};

export default TradingHistory;

const PortfolioWrapper = styled(FlexContainer)`
  min-width: 320px;
`;

const TradingHistoryWrapper = styled(FlexContainer)`
  overflow-y: auto;
  height: 100%;

  ::-webkit-scrollbar {
    width: 4px;
    border-radius: 2px;
  }

  ::-webkit-scrollbar-track-piece {
    background-color: transparent;
  }
  ::-webkit-scrollbar-thumb:vertical {
    background-color: rgba(0, 0, 0, 0.6);
  }
`;

const SortByWrapper = styled(FlexContainer)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
`;
