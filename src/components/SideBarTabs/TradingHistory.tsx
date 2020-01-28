import React, { FC, useEffect } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import styled from '@emotion/styled';
import { useStores } from '../../hooks/useStores';
import { Observer } from 'mobx-react-lite';
import PendingOrder from './PendingOrder';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import API from '../../helpers/API';
import { HistoryTabEnum } from '../../enums/HistoryTabEnum';
import DatePickerDropdown from '../DatePickerDropdown';
import IconNoTradingHistory from '../../assets/svg/icon-no-trading-history.svg';
import SvgIcon from '../SvgIcon';
import TradingHistoryItem from './TradingHistoryItem';

const TradingHistory: FC = () => {
  const { quotesStore, tabsStore, mainAppStore, historyStore } = useStores();

  const handleChangeHistoryTab = (historyTab: HistoryTabEnum) => () => {
    tabsStore.historyTab = historyTab;
  };

  const fetchPositionsHistory = async () => {
    const response = await API.getPositionsHistory({
      accountId: mainAppStore.activeAccount!.id,
      startDate: historyStore.positionsStartDate.format(),
      endDate: historyStore.positionsEndDate.format(),
    });
    historyStore.positionsHistory = response.positionsHistory;
  };

  useEffect(() => {
    fetchPositionsHistory();
  }, []);

  return (
    <PortfolioWrapper flexDirection="column">
      <FlexContainer flexDirection="column" padding="0 8px">
        <FlexContainer margin="0 0 8px">
          <Observer>
            {() => (
              <>
                <TabPortfolitButton
                  isActive={
                    tabsStore.historyTab === HistoryTabEnum.TradingHistory
                  }
                  onClick={handleChangeHistoryTab(
                    HistoryTabEnum.TradingHistory
                  )}
                >
                  Trading History
                </TabPortfolitButton>
                <TabPortfolitButton
                  isActive={
                    tabsStore.historyTab === HistoryTabEnum.BalanceHistory
                  }
                  onClick={handleChangeHistoryTab(
                    HistoryTabEnum.BalanceHistory
                  )}
                >
                  Balance History
                </TabPortfolitButton>
              </>
            )}
          </Observer>
        </FlexContainer>
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
        <DatePickerDropdown datesChangeCallback={fetchPositionsHistory} />
      </SortByWrapper>
      <Observer>
        {() => (
          <TradingHistoryWrapper flexDirection="column">
            {historyStore.positionsHistory.map(item => (
              <TradingHistoryItem
                key={item.id}
                tradingHistoryItem={item}
                currencySymbol={mainAppStore.activeAccount?.symbol || ''}
              />
            ))}
            {!historyStore.positionsHistory.length && (
              <FlexContainer padding="16px" flexDirection="column" alignItems="center">
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
  padding: 0 16px;

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
