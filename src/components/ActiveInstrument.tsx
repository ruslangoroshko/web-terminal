import React, { FC } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import baseImg from '../assets/images/base.png';
import quoteImg from '../assets/images/quote.png';
import { AskBidEnum } from '../enums/AskBid';
import calculateGrowth from '../helpers/calculateGrowth';
import { InstrumentModelWSDTO } from '../types/Instruments';
import { useStores } from '../hooks/useStores';
import { Observer } from 'mobx-react-lite';
import { PrimaryTextSpan, QuoteText } from '../styles/TextsElements';
import { getNumberSign } from '../helpers/getNumberSign';

interface Props {
  instrument: InstrumentModelWSDTO;
}

const ActiveInstrument: FC<Props> = props => {
  const { instrument } = props;

  const { quotesStore, instrumentsStore } = useStores();

  return quotesStore.quotes[instrument.id] ? (
    <FlexContainer>
      <FlexContainer
        height="60px"
        width="60px"
        position="relative"
        margin="0 12px 0 0"
      >
        <BaseImgWrapper>
          <img src={baseImg}></img>
        </BaseImgWrapper>
        <QuoteImgWrapper>
          <img src={quoteImg}></img>
        </QuoteImgWrapper>
      </FlexContainer>
      <FlexContainer flexDirection="column" margin="0 52px 0 0">
        <PrimaryTextSpan
          fontWeight="bold"
          fontSize="16px"
          textTransform="uppercase"
          marginBottom="4px"
        >
          {instrument.name}
        </PrimaryTextSpan>
        <PrimaryTextSpan
          fontSize="12px"
          color="rgba(255, 255, 255, 0.4)"
          marginBottom="8px"
        >
          {instrument.base}/{instrument.quote}
        </PrimaryTextSpan>
      </FlexContainer>
      <FlexContainer flexDirection="column" margin="0 70px 0 0">
        <FlexContainer margin="0 0 12px" alignItems="center">
          <Observer>
            {() => (
              <>
                <PrimaryTextSpan
                  fontWeight="bold"
                  fontSize="16px"
                  marginRight="10px"
                >
                  {quotesStore.quotes[instrument.id].bid.c.toFixed(
                    instrument.digits
                  )}
                </PrimaryTextSpan>
                {!!instrumentsStore.pricesChange[instrument.id] && (
                  <QuoteText
                    fontSize="12px"
                    isGrowth={instrumentsStore.pricesChange[instrument.id] >= 0}
                  >
                    {getNumberSign(
                      instrumentsStore.pricesChange[instrument.id]
                    )}
                    {Math.abs(instrumentsStore.pricesChange[instrument.id])}%
                  </QuoteText>
                )}
              </>
            )}
          </Observer>
        </FlexContainer>
        <FlexContainer flexWrap="wrap">
          <FlexContainer margin="0 0 4px 0" width="100%">
            <LabelWrapper>
              <PrimaryTextSpan fontSize="12px" color="rgba(255, 255, 255, 0.4)">
                Bid
              </PrimaryTextSpan>
            </LabelWrapper>
            <LabelWrapper>
              <PrimaryTextSpan fontSize="12px">
                <Observer>
                  {() => (
                    <>
                      {quotesStore.quotes[instrument.id].bid.c.toFixed(
                        instrument.digits
                      )}
                    </>
                  )}
                </Observer>
              </PrimaryTextSpan>
            </LabelWrapper>
          </FlexContainer>
          <FlexContainer>
            <LabelWrapper>
              <PrimaryTextSpan fontSize="12px" color="rgba(255, 255, 255, 0.4)">
                Ask
              </PrimaryTextSpan>
            </LabelWrapper>
            <LabelWrapper>
              <PrimaryTextSpan fontSize="12px">
                <Observer>
                  {() => (
                    <>
                      {quotesStore.quotes[instrument.id].ask.c.toFixed(
                        instrument.digits
                      )}
                    </>
                  )}
                </Observer>
              </PrimaryTextSpan>
            </LabelWrapper>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  ) : null;
};

export default ActiveInstrument;

// TODO: find out base / quote places

const BaseImgWrapper = styled(FlexContainer)`
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #fff;
  justify-content: center;
  align-items: center;
  z-index: 12;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
`;

const QuoteImgWrapper = styled(FlexContainer)`
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #fff;
  justify-content: center;
  align-items: center;
  bottom: 0;
  right: 0;
  z-index: 11;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
`;

const LabelWrapper = styled.div`
  width: 22px;
  margin-right: 8px;
`;
