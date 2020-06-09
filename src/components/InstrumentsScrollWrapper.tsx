import React, { FC, useEffect } from 'react';
import Instrument from './Instrument';
import { useStores } from '../hooks/useStores';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import API from '../helpers/API';
import { AccountTypeEnum } from '../enums/AccountTypeEnum';

interface Props {}

const InstrumentsScrollWrapper: FC<Props> = observer(() => {
  const { instrumentsStore, mainAppStore, badRequestPopupStore } = useStores();

  const handleRemoveInstrument = (itemId: string) => async () => {
    const newInstruments = instrumentsStore.activeInstrumentsIds.filter(
      id => id !== itemId
    );
    try {
      const response = await API.postFavoriteInstrumets({
        accountId: mainAppStore.activeAccount!.id,
        type: mainAppStore.activeAccount!.isLive
          ? AccountTypeEnum.Live
          : AccountTypeEnum.Demo,
        instruments: newInstruments,
      });
      instrumentsStore.setActiveInstrumentsIds(response);
    } catch (error) {
      badRequestPopupStore.openModal();
      badRequestPopupStore.setMessage(error);
    }
  };

  useEffect(() => {
    async function fetchFavoriteInstruments(
      accountId: string,
      type: AccountTypeEnum
    ) {
      try {
        const response = await API.getFavoriteInstrumets({
          type,
          accountId,
        });
        instrumentsStore.setActiveInstrumentsIds(response);
        instrumentsStore.switchInstrument(
          response[0] || instrumentsStore.instruments[0].instrumentItem.id
        );
      } catch (error) {
        badRequestPopupStore.openModal();
        badRequestPopupStore.setMessage(error);
      }
    }

    // sh@t from backend
    if (mainAppStore.activeAccount) {
      fetchFavoriteInstruments(
        mainAppStore.activeAccount.id,
        mainAppStore.activeAccount.isLive
          ? AccountTypeEnum.Live
          : AccountTypeEnum.Demo
      );
    }
  }, [mainAppStore.activeAccount]);

  return (
    <InstrumentsWrapper>
      {instrumentsStore.activeInstruments.map(item => (
        <Instrument
          instrument={item.instrumentItem}
          key={item.instrumentItem.id}
          isActive={
            item.instrumentItem.id ===
            instrumentsStore.activeInstrument?.instrumentItem.id
          }
          handleClose={handleRemoveInstrument(item.instrumentItem.id)}
        />
      ))}
    </InstrumentsWrapper>
  );
});

export default InstrumentsScrollWrapper;

const InstrumentsWrapper = styled.div`
  display: table;
  border-collapse: collapse;
  padding: 0 8px;
  margin: 10px 8px;
`;
