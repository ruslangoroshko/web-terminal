import React, { FC } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan, QuoteText } from '../styles/TextsElements';
import styled from '@emotion/styled';
import { InstrumentModelWSDTO } from '../types/Instruments';
import { useStores } from '../hooks/useStores';
import baseImg from '../assets/images/base.png';
import quoteImg from '../assets/images/quote.png';
import { AskBidEnum } from '../enums/AskBid';
import calculateGrowth from '../helpers/calculateGrowth';
import { Observer, observer } from 'mobx-react-lite';
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

  const addActiveInstrument = () => {
    if (instrumentsStore.activeInstrumentsIds.includes(instrument.id)) {
      instrumentsStore.activeInstrument = instrumentsStore.instruments.find(
        item => item.instrumentItem.id === instrument.id
      )!;
    } else {
      instrumentsStore.addActiveInstrumentId(instrument.id);
      API.setKeyValue({
        key: KeysInApi.SELECTED_INSTRUMENTS,
        value: JSON.stringify(instrumentsStore.activeInstrumentsIds),
      });
    }
    toggle();
  };

  const priceChange = instrumentsStore.pricesChange.find(
    item => item.id === instrument.id
  ) || {
    id: '',
    chng: 0,
  };

  return (
    <InstrumentRowWrapper key={instrument.id} alignItems="center">
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
        <ButtonWithoutStyles onClick={addActiveInstrument}>
          <PrimaryTextSpan
            color="#FFFCCC"
            fontSize="12px"
            lineHeight="14px"
            marginBottom="4px"
          >
            {instrument.id}
          </PrimaryTextSpan>
        </ButtonWithoutStyles>
        <PrimaryTextSpan
          color="rgba(255, 255, 255, 0.4)"
          fontSize="10px"
          lineHeight="12px"
        >
          {instrument.base}/{instrument.quote}
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
        <QuoteText
          isGrowth={priceChange.chng >= 0}
          fontSize="12px"
          lineHeight="14px"
        >
          {getNumberSign(priceChange.chng)}
          {Math.abs(priceChange.chng)}%
        </QuoteText>
      </FlexContainer>
      <ButtonWithoutStyles onClick={toggleFavourite}>
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
