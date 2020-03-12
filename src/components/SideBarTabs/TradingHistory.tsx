import React, { FC, useEffect, useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import styled from '@emotion/styled';
import { useStores } from '../../hooks/useStores';
import { Observer } from 'mobx-react-lite';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import API from '../../helpers/API';
import IconNoTradingHistory from '../../assets/svg/icon-no-trading-history.svg';
import SvgIcon from '../SvgIcon';
import TradingHistoryItem from './TradingHistoryItem';
import DatePickerDropdownNoCustomDates from '../DatePickerDropdownNoCustomDates';
import LoaderComponent from '../LoaderComponent';
import LoaderForComponents from '../LoaderForComponents';

const TradingHistory: FC = () => {
  const { tabsStore, mainAppStore, historyStore } = useStores();

  const [isLoading, setIsLoading] = useState(false);

  const fetchPositionsHistory = async () => {
    const response = await API.getPositionsHistory({
      accountId: mainAppStore.activeAccount!.id,
      startDate: historyStore.positionsStartDate.valueOf().toString(),
      endDate: historyStore.positionsEndDate.valueOf().toString(),
    });
    historyStore.positionsHistory = response.positionsHistory;
  };

  useEffect(() => {
    setIsLoading(true);
    fetchPositionsHistory().finally(() => {
      setIsLoading(false);
    });
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
            {historyStore.positionsHistory.map(item => (
              <TradingHistoryItem
                key={item.id}
                tradingHistoryItem={item}
                currencySymbol={mainAppStore.activeAccount?.symbol || ''}
              />
            ))}
            {!historyStore.positionsHistory.length && (
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

const TabPortfolitButton = styled(ButtonWithoutStyles)<{ isActive?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 12px 8px;
  font-size: 12px;
  color: ${props => (props.isActive ? '#fffcbd' : 'rgba(255,255,255,0.4)')};
  text-transform: uppercase;
  background: ${props =>
    props.isActive
      ? `radial-gradient(
      50.41% 50% at 50% 0%,
      rgba(0, 255, 221, 0.08) 0%,
      rgba(0, 255, 221, 0) 100%
    ),
    rgba(255, 255, 255, 0.08)`
      : 'none'};
  box-shadow: ${props =>
    props.isActive ? 'inset 0px 1px 0px #00ffdd' : 'none'};
  border-radius: 0px 0px 4px 4px;
  transition: all 0.2s ease;

  &:hover {
    color: #fffcbd;
    background: radial-gradient(
        50.41% 50% at 50% 0%,
        rgba(0, 255, 221, 0.08) 0%,
        rgba(0, 255, 221, 0) 100%
      ),
      rgba(255, 255, 255, 0.08);
    box-shadow: inset 0px 1px 0px #00ffdd;
  }
`;

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
