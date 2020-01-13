import React, { FC } from 'react';
import Instrument from './Instrument';
import { useStores } from '../hooks/useStores';
import { InstrumentModelWSDTO } from '../types/Instruments';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';

interface Props {}

const InstrumentsScrollWrapper: FC<Props> = observer(props => {
  const { instrumentsStore, tradingViewStore } = useStores();

  const handleRemoveInstrument = (itemId: string) => () => {
    throw new Error(`handleRemoveInstrument ${itemId}`);
  };

  const switchInstrument = (instrument: InstrumentModelWSDTO) => () => {
    instrumentsStore.activeInstrument = instrument;
    tradingViewStore.tradingWidget?.chart().setSymbol(instrument.id, () => {});
  };

  return (
    <InstrumentsWrapper>
      {instrumentsStore.activeInstruments.map(item => (
        <Instrument
          instrument={item}
          key={item.id}
          isActive={item.id === instrumentsStore.activeInstrument?.id}
          handleClose={handleRemoveInstrument(item.id)}
          switchInstrument={switchInstrument(item)}
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
