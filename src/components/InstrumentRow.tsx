import React, { FC, useRef } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan, QuoteText } from '../styles/TextsElements';
import styled from '@emotion/styled';
import { InstrumentModelWSDTO } from '../types/Instruments';
import { useStores } from '../hooks/useStores';
import baseImg from '../assets/images/base.png';
import quoteImg from '../assets/images/quote.png';
import { observer } from 'mobx-react-lite';
import IconMarketsFavourites from '../assets/svg/icon-instrument-favourites.svg';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import SvgIcon from './SvgIcon';
import { toggleFavouriteInstrument } from '../helpers/activeInstrumentsHelper';
import API from '../helpers/API';
import KeysInApi from '../constants/keysInApi';
import { getNumberSign } from '../helpers/getNumberSign';

interface Props {
  instrument: InstrumentModelWSDTO;
  toggle: () => void;
}

const InstrumentRow: FC<Props> = observer(props => {
  const { instrument, toggle } = props;

  const { quotesStore, instrumentsStore } = useStores();

  const toggleFavourite = () => {
    toggleFavouriteInstrument({ instrumentsStore, newId: instrument.id });
  };
  const clickableRef = useRef<HTMLButtonElement>(null);

  const addActiveInstrument = (e: any) => {
    if (clickableRef.current && clickableRef.current.contains(e.target)) {
      e.preventDefault();
    } else {
      if (instrumentsStore.activeInstrumentsIds.includes(instrument.id)) {
        instrumentsStore.switchInstrument(instrument.id);
      } else {
        instrumentsStore.addActiveInstrumentId(instrument.id);
        API.setKeyValue({
          key: KeysInApi.SELECTED_INSTRUMENTS,
          value: JSON.stringify(instrumentsStore.activeInstrumentsIds),
        });
      }
      toggle();
    }
  };

  return (
    <InstrumentRowWrapper
      key={instrument.id}
      alignItems="center"
      onClick={addActiveInstrument}
    >
      <FlexContainer
        margin="0 8px 0 0"
        position="relative"
        width="32px"
        height="32px"
      >
        <BaseImgWrapper>
          <img src={baseImg} width={16}></img>
        </BaseImgWrapper>
        <QuoteImgWrapper>
          <img src={quoteImg} width={16}></img>
        </QuoteImgWrapper>
      </FlexContainer>
      <FlexContainer flexDirection="column" width="110px" margin="0 4px 0 0">
        <PrimaryTextSpan
          color="#FFFCCC"
          fontSize="12px"
          lineHeight="14px"
          marginBottom="4px"
        >
          {instrument.name}
        </PrimaryTextSpan>
        <PrimaryTextSpan
          color="rgba(255, 255, 255, 0.4)"
          fontSize="10px"
          lineHeight="12px"
        >
          {instrument.name}
        </PrimaryTextSpan>
      </FlexContainer>
      <FlexContainer
        flexDirection="column"
        width="58px"
        margin="0 12px 0 0"
        alignItems="flex-end"
      >
        <PrimaryTextSpan
          color="#FFFCCC"
          fontSize="12px"
          lineHeight="14px"
          marginBottom="4px"
        >
          {quotesStore.quotes[instrument.id].bid.c.toFixed(instrument.digits)}
        </PrimaryTextSpan>
        {!!instrumentsStore.pricesChange[instrument.id] && (
          <QuoteText
            isGrowth={instrumentsStore.pricesChange[instrument.id] >= 0}
            fontSize="12px"
            lineHeight="14px"
          >
            {getNumberSign(instrumentsStore.pricesChange[instrument.id])}
            {Math.abs(instrumentsStore.pricesChange[instrument.id])}%
          </QuoteText>
        )}
      </FlexContainer>
      <ButtonWithoutStyles onClick={toggleFavourite} ref={clickableRef}>
        <SvgIcon
          {...IconMarketsFavourites}
          fillColor={
            instrumentsStore.favouriteInstrumentsIds.includes(instrument.id)
              ? '#FFFCCC'
              : 'rgba(255, 255, 255, 0.5)'
          }
        />
      </ButtonWithoutStyles>
    </InstrumentRowWrapper>
  );
});

export default InstrumentRow;

const BaseImgWrapper = styled(FlexContainer)`
  position: absolute;
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #fff;
  justify-content: center;
  align-items: center;
  z-index: 12;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
`;

const QuoteImgWrapper = styled(FlexContainer)`
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #fff;
  justify-content: center;
  align-items: center;
  bottom: 0;
  right: 0;
  z-index: 11;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
`;

const InstrumentRowWrapper = styled(FlexContainer)`
  transition: all 0.2s ease;
  padding: 12px 16px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.04);
  }
`;
