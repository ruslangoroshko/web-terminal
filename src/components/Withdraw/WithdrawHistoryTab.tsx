import React, { useEffect } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { TableGrid } from '../../styles/TableElements';
import WithdrawHistoryItem from './WithdrawHistoryItem';
import API from '../../helpers/API';
import { useStores } from '../../hooks/useStores';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { Observer } from 'mobx-react-lite';
import { WithdrawalHistoryResponseStatus } from '../../enums/WithdrawalHistoryResponseStatus';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../../constants/mixpanelEvents';
import mixapanelProps from '../../constants/mixpanelProps';

const WithdrawHistoryTab = () => {
  const { withdrawalStore, mainAppStore } = useStores();
  const { t } = useTranslation();
  const initHistoryList = async () => {
    withdrawalStore.setLoad();
    try {
      const result = await API.getWithdrawalHistory();
      if (result.status === WithdrawalHistoryResponseStatus.Successful) {
        const sortedList = result.history
          ? result.history.sort(
              (a: any, b: any) =>
                moment(b.creationDate).valueOf() -
                moment(a.creationDate).valueOf()
            )
          : result.history;

        withdrawalStore.setHistory(sortedList);
      }
      withdrawalStore.endLoad();
    } catch (error) {}
  };

  const updateHistoryList = () => {
    initHistoryList();
  };

  useEffect(() => {
    initHistoryList();
  }, []);

  useEffect(() => {
    mixpanel.track(mixpanelEvents.WITHDRAW_HISTORY_VIEW, {
      [mixapanelProps.AVAILABLE_BALANCE]:
        mainAppStore.accounts.find((item) => item.isLive)?.balance || 0,
    });
  }, []);

  return (
    <FlexContainer
      flexDirection="column"
      justifyContent="center"
      position="relative"
    >
      <Observer>
        {() => (
          <>
            {!withdrawalStore.loading && (
              <>
                {!withdrawalStore.history && (
                  <PrimaryTextSpan
                    textAlign="center"
                    fontSize="13px"
                    color="rgba(255,255,255,0.4)"
                  >
                    {t("You haven't made any withdrawal requests yet")}
                  </PrimaryTextSpan>
                )}
                {withdrawalStore.history && (
                  <TableGrid columnsCount={5} maxHeight="calc(100vh - 235px)">
                    {withdrawalStore.history.map((item) => (
                      <WithdrawHistoryItem
                        key={item.id}
                        data={item}
                        updateHistory={updateHistoryList}
                      />
                    ))}
                  </TableGrid>
                )}
              </>
            )}
          </>
        )}
      </Observer>
    </FlexContainer>
  );
};

export default WithdrawHistoryTab;
