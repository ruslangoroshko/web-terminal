import React, { FC } from 'react';
import Instrument from './Instrument';
import { useStores } from '../hooks/useStores';
import { InstrumentModelWSDTO } from '../types/Instruments';
import { FlexContainer } from '../styles/FlexContainer';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
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
    <FlexContainer padding="0 8px">
      {instrumentsStore.activeInstruments.map(item => (
        <Instrument
          instrument={item}
          key={item.id}
          isActive={item.id === instrumentsStore.activeInstrument?.id}
          handleClose={handleRemoveInstrument(item.id)}
          switchInstrument={switchInstrument(item)}
        />
      ))}
    </FlexContainer>
  );
});

export default InstrumentsScrollWrapper;

const ButtonLeft = styled(ButtonWithoutStyles)<{ isDisabled?: boolean }>`
  position: relative;
  height: 40px;
  width: 24px;
  &:hover {
    background-color: red;
  }

  &:before {
    content: '';
    position: absolute;
    left: 100%;
    top: 0;
    bottom: 0;
    background: linear-gradient(90deg, #1c2026 0%, rgba(50, 51, 63, 0) 100%);
    width: 38px;
    transition: opacity 1s ease, visibility;
    opacity: ${props => (props.isDisabled ? 0 : 1)};
    visibility: ${props => (props.isDisabled ? 'hidden' : 'visible')};
  }
`;
