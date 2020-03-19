import React, { useEffect, useState } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import AccountSettingsContainer from '../containers/AccountSettingsContainer';
import { PrimaryTextSpan, PrimaryTextParagraph } from '../styles/TextsElements';
import API from '../helpers/API';
import { useStores } from '../hooks/useStores';
import moment from 'moment';
import { BalanceHistoryDTO } from '../types/HistoryReportTypes';
import styled from '@emotion/styled';
import SvgIcon from '../components/SvgIcon';
import IconNoTradingHistory from '../assets/svg/icon-no-trading-history.svg';
import DatePickerDropdown from '../components/DatePickerDropdown';
import { TableGrid, Th } from '../styles/TableElements';
import TradingHistoryExpandedItem from '../components/SideBarTabs/TradingHistoryExpandedItem';
import BalanceHistoryItem from '../components/BalanceHistoryItem';

function AccountBalance() {
  const { mainAppStore } = useStores();

  const [isLoading, setIsLoading] = useState(true);
  const [balanceHistory, setBalanceHistory] = useState<BalanceHistoryDTO[]>([]);

  const fetchBalanceHistory = async () => {
    try {
      const response = await API.getBalanceHistory({
        // FIXME: typings
        accountId: mainAppStore.activeAccount!.id,
        endDate: moment().valueOf(),
        startDate: moment()
          .subtract(1, 'w')
          .valueOf(),
      });
      setBalanceHistory(response.balanceHistory);
    } catch (error) {}
  };
  useEffect(() => {
    if (mainAppStore.activeAccount) {
      fetchBalanceHistory().finally(() => {
        setIsLoading(false);
      });
    }
  }, [mainAppStore.activeAccount]);

  return (
    <AccountSettingsContainer>
      <FlexContainer flexDirection="column">
        {/* <PrimaryTextParagraph
          color="#fffccc"
          fontSize="20px"
          fontWeight="bold"
          marginBottom="20px"
        >
          Balance History
        </PrimaryTextParagraph> */}
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
        <FlexContainer flexDirection="column">
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
            {/* <Th justifyContent="flex-end">
            <PrimaryTextSpan
              color="rgba(255, 255, 255, 0.4)"
              fontSize="11px"
              textTransform="uppercase"
            >
              Operation type
            </PrimaryTextSpan>
          </Th> */}
            <Th>
              <PrimaryTextSpan
                color="rgba(255, 255, 255, 0.4)"
                fontSize="11px"
                textTransform="uppercase"
              >
                Description
              </PrimaryTextSpan>
            </Th>
            {balanceHistory.map(item => (
              <BalanceHistoryItem
                key={item.createdAt}
                balanceHistoryItem={item}
              />
            ))}
          </TableGrid>
          {!balanceHistory.length && (
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
