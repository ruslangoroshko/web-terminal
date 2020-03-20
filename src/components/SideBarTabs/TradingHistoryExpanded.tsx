import React, { FC } from 'react';
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

const TradingHistoryExpanded: FC = () => {
  const { tabsStore, mainAppStore, historyStore } = useStores();
  const closeExpanded = () => {
    tabsStore.isTabExpanded = false;
  };

  const fetchPositionsHistory = async () => {
    const response = await API.getPositionsHistory({
      accountId: mainAppStore.activeAccount!.id,
      startDate: historyStore.positionsStartDate.valueOf(),
      endDate: historyStore.positionsEndDate.valueOf(),
      page: 1,
      pageSize: 20,
    });
    historyStore.positionsHistoryReport = {
      ...response,
      positionsHistory: [
        ...historyStore.positionsHistoryReport.positionsHistory,
        ...response.positionsHistory,
      ],
    };
  };

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
        <TabPortfolitButton isActive>Trading History</TabPortfolitButton>
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
                Period:
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
          <FlexContainer flexDirection="column">
            <TableGrid columnsCount={7}>
              <Th>
                <FlexContainer padding="0 0 0 12px">
                  <PrimaryTextSpan
                    color="rgba(255, 255, 255, 0.4)"
                    fontSize="11px"
                    textTransform="uppercase"
                  >
                    Asset Name
                  </PrimaryTextSpan>
                </FlexContainer>
              </Th>
              <Th>
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  Price open &mdash; close
                </PrimaryTextSpan>
              </Th>
              <Th>
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  open &mdash; close
                </PrimaryTextSpan>
              </Th>
              <Th justifyContent="flex-end">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  Investment
                </PrimaryTextSpan>
              </Th>
              <Th justifyContent="flex-end">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  Profit/loss
                </PrimaryTextSpan>
              </Th>
              <Th justifyContent="flex-end">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  Equity
                </PrimaryTextSpan>
              </Th>
              <Th></Th>
              <Observer>
                {() => (
                  <>
                    {historyStore.positionsHistoryReport.positionsHistory.map(
                      item => (
                        <TradingHistoryExpandedItem
                          key={item.id}
                          currencySymbol={
                            mainAppStore.activeAccount?.symbol || ''
                          }
                          tradingHistoryItem={item}
                        />
                      )
                    )}
                  </>
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
                        There is no trading history
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
