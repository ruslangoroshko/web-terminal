import React, { FC } from 'react';
import Instrument from './Instrument';
import { useStores } from '../hooks/useStores';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import API from '../helpers/API';
import KeysInApi from '../constants/keysInApi';

interface Props {}

const InstrumentsScrollWrapper: FC<Props> = observer(() => {
  const { instrumentsStore } = useStores();

  const handleRemoveInstrument = (itemId: string) => async () => {
    instrumentsStore.setActiveInstrumentsIds(
      instrumentsStore.activeInstrumentsIds.filter(id => id !== itemId)
    );
    await API.setKeyValue({
      key: KeysInApi.SELECTED_INSTRUMENTS,
      value: JSON.stringify(instrumentsStore.activeInstrumentsIds),
    });
  };

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
