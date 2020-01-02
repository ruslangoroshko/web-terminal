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
import { Observer } from 'mobx-react-lite';
import IconMarketsFavourites from '../assets/svg/icon-instrument-favourites.svg';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import SvgIcon from './SvgIcon';
import { toggleFavouriteInstrument } from '../helpers/activeInstrumentsHelper';

interface Props {
  instrument: InstrumentModelWSDTO;
}

const InstrumentRow: FC<Props> = props => {
  const { instrument } = props;

  const { quotesStore, instrumentsStore } = useStores();

  const toggleFavourite = () => {
    toggleFavouriteInstrument({ instrumentsStore, newId: instrument.id });
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
        <PrimaryTextSpan
          color="#FFFCCC"
          fontSize="12px"
          lineHeight="14px"
          marginBottom="4px"
        >
          {instrument.id}
        </PrimaryTextSpan>
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
        <Observer>
          {() => (
            <>
              <PrimaryTextSpan
                color="#FFFCCC"
                fontSize="12px"
                lineHeight="14px"
                marginBottom="4px"
              >
                {quotesStore.quotes[instrument.id].bid.c}
              </PrimaryTextSpan>
              <QuoteText
                isGrowth={
                  quotesStore.quotes[instrument.id].dir === AskBidEnum.Buy
                }
                fontSize="12px"
                lineHeight="14px"
              >
                {`${
                  quotesStore.quotes[instrument.id].dir === AskBidEnum.Buy
                    ? '+'
                    : '-'
                }${calculateGrowth(
                  quotesStore.quotes[instrument.id].bid.c,
                  quotesStore.quotes[instrument.id].ask.c,
                  instrument.digits
                )}`}
              </QuoteText>
            </>
          )}
        </Observer>
      </FlexContainer>
      <ButtonWithoutStyles onClick={toggleFavourite}>
        <Observer>
          {() => (
            <SvgIcon
              {...IconMarketsFavourites}
              fill={
                instrumentsStore.activeInstrumentsIds.includes(instrument.id)
                  ? '#FFFCCC'
                  : 'rgba(255, 255, 255, 0.5)'
              }
            />
          )}
        </Observer>
      </ButtonWithoutStyles>
    </InstrumentRowWrapper>
  );
};

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
  margin-bottom: 16px;
  &:last-of-type {
    margin-bottom: 0;
  }
`;
