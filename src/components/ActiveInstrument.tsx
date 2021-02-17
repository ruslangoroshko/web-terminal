import React, { FC } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { InstrumentModelWSDTO } from '../types/InstrumentsTypes';
import { useStores } from '../hooks/useStores';
import { Observer } from 'mobx-react-lite';
import { PrimaryTextSpan, QuoteText } from '../styles/TextsElements';
import { getNumberSign } from '../helpers/getNumberSign';
import ImageContainer from './ImageContainer';
import { useTranslation } from 'react-i18next';

interface Props {
  instrument: InstrumentModelWSDTO;
}

const ActiveInstrument: FC<Props> = props => {
  const { instrument } = props;

  const { t } = useTranslation();

  const { quotesStore, instrumentsStore } = useStores();

  return quotesStore.quotes[instrument.id] ? (
    <FlexContainer padding="0 20px">
      <FlexContainer
        position="relative"
        margin="0 12px 0 0"
        width="60px"
        height="60px"
      >
        <ImageContainer instrumentId={instrument.id} />
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
                {t('Bid')}
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
                {t('Ask')}
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

const LabelWrapper = styled.div`
  min-width: 22px;
  margin-right: 8px;
`;
