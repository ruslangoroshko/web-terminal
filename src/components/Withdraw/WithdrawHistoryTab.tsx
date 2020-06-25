import React, { useEffect, useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { TableGrid } from '../../styles/TableElements';
import WithdrawHistoryItem from './WithdrawHistoryItem';
import API from '../../helpers/API';
import { WithdrawalHistoryModel } from '../../types/WithdrawalTypes';
import LoaderForComponents from '../LoaderForComponents';
import { useStores } from '../../hooks/useStores';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { Observer } from 'mobx-react-lite';
import { WithdrawalHistoryResponseStatus } from '../../enums/WithdrawalHistoryResponseStatus';
import moment from 'moment';

const WithdrawHistoryTab = () => {
  const { withdrawalStore, mainAppStore } = useStores();

  const initHistoryList = async () => {
    withdrawalStore.setLoad();
    try {
      const result = await API.getWithdrawalHistory({
        AuthToken: mainAppStore.token,
      });
      if (result.status === WithdrawalHistoryResponseStatus.Successful) {
        const sortedList = result.history ? result.history.sort(
          (a: any , b: any) => moment(b.creationDate).valueOf() - moment(a.creationDate).valueOf()) : result.history;

        withdrawalStore.setHistory(sortedList);
        withdrawalStore.endLoad();
      }
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const updateHistoryList = () => {
    initHistoryList();
  };

  useEffect(() => {
    initHistoryList();
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
                    You haven't made any withdrawal requests yet
                  </PrimaryTextSpan>
                )}
                {withdrawalStore.history && (
                  <TableGrid columnsCount={5} maxHeight="calc(100vh - 235px)">
                    {withdrawalStore.history.map(item => (
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
