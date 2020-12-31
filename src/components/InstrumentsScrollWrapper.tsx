import React, { FC, useEffect, useCallback } from 'react';
import Instrument from './Instrument';
import { useStores } from '../hooks/useStores';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import API from '../helpers/API';
import { AccountTypeEnum } from '../enums/AccountTypeEnum';
import {
  LOCAL_INSTRUMENT_ACTIVE,
} from '../constants/global';

interface Props {}

const InstrumentsScrollWrapper: FC<Props> = observer(() => {
  const { instrumentsStore, mainAppStore, badRequestPopupStore, tradingViewStore } = useStores();

  const handleRemoveInstrument = (itemId: string) => async () => {
    let indexEl = instrumentsStore.activeInstrumentsIds.findIndex(
      (id) => id === itemId
    );

    const newInstruments = instrumentsStore.activeInstrumentsIds.filter(
      (id) => id !== itemId
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

      if (instrumentsStore.activeInstrument?.instrumentItem.id === itemId) {
        indexEl = indexEl ? indexEl - 1 : 0;
        instrumentsStore.switchInstrument(response[indexEl]);
      }
    } catch (error) {
      badRequestPopupStore.openModal();
      badRequestPopupStore.setMessage(error);
    }
  };

  const fetchFavoriteInstruments = useCallback(async () => {
    if (mainAppStore.activeAccount) {
      try {
        const response = await API.getFavoriteInstrumets({
          type: mainAppStore.activeAccount?.isLive
            ? AccountTypeEnum.Live
            : AccountTypeEnum.Demo,
          accountId: mainAppStore.activeAccountId,
        });

        instrumentsStore.setActiveInstrumentsIds(response);
        const lastActive = localStorage.getItem(LOCAL_INSTRUMENT_ACTIVE);
        instrumentsStore.switchInstrument(
          lastActive ||
            response[0] ||
            instrumentsStore.instruments[0].instrumentItem.id
        );
      } catch (error) {
        badRequestPopupStore.openModal();
        badRequestPopupStore.setMessage(error);
      }
    }
  }, [
    mainAppStore.activeAccountId,
    mainAppStore.activeAccount,
    instrumentsStore.instruments,
  ]);

  useEffect(() => {
    if (instrumentsStore.instruments.length) {
      fetchFavoriteInstruments();
    }
  }, [instrumentsStore.instruments]);

  return (
    <InstrumentsWrapper>
      {instrumentsStore.activeInstruments.map((item) => (
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
