import React, { useEffect, FC } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { InstrumentModelWSDTO } from '../types/Instruments';
import Topics from '../constants/websocketTopics';
import { ResponseFromWebsocket } from '../types/ResponseFromWebsocket';
import { BidAskModelWSDTO } from '../types/BidAsk';
import {
  QuotesFeedWrapper,
  CurrencyQuoteTitle,
  CurrencyQuoteInfo,
} from '../styles/InstrumentComponentStyle';
import IconClose from '../assets/svg/icon-instrument-close.svg';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import SvgIcon from './SvgIcon';
import styled from '@emotion/styled';
import { useStores } from '../hooks/useStores';
import { observer, Observer } from 'mobx-react-lite';
import { PrimaryTextSpan } from '../styles/TextsElements';

interface Props {
  switchInstrument: () => void;
  instrument: InstrumentModelWSDTO;
  isActive?: boolean;
  handleClose: () => void;
}

const Instrument: FC<Props> = ({
  instrument,
  switchInstrument,
  isActive,
  handleClose,
}) => {
  const { quotesStore, mainAppStore } = useStores();

  useEffect(() => {
    mainAppStore.activeSession?.on(
      Topics.BID_ASK,
      (response: ResponseFromWebsocket<BidAskModelWSDTO[]>) => {
        if (!response.data.length) {
          return;
        }
        response.data.forEach(item => {
          quotesStore.setQuote(item);
        });
      }
    );
  }, [instrument]);

  return (
    <QuotesFeedWrapper
      isActive={isActive}
      padding="6px 8px"
      onClick={switchInstrument}
      width="200px"
      height="28px"
      alignItems="center"
      justifyContent="space-between"
    >
      <PrimaryTextSpan fontSize="12px">{instrument.name}</PrimaryTextSpan>
      <FlexContainer alignItems="center">
        {quotesStore.quotes[instrument.id] && (
          <Observer>
            {() => (
              <PrimaryTextSpan fontSize="12px" color="rgba(255, 255, 255, 0.4)">
                {quotesStore.quotes[instrument.id].bid.c}
              </PrimaryTextSpan>
            )}
          </Observer>
        )}
        {/* TODO: check updates */}
        <Observer>
          {() => {
            const positionsLength = quotesStore.activePositions.filter(
              position => position.instrument === instrument.id
            ).length;
            return (
              <>
                {positionsLength > 0 && (
                  <PositionsCounter
                    justifyContent="center"
                    alignItems="center"
                    width="20px"
                    height="16px"
                    position="relative"
                  >
                    {positionsLength}
                  </PositionsCounter>
                )}
              </>
            );
          }}
        </Observer>
        <ButtonWithoutStyles onClick={handleClose}>
          <SvgIcon {...IconClose} fill="rgba(255, 255, 255, 0.6)"></SvgIcon>
        </ButtonWithoutStyles>
      </FlexContainer>
    </QuotesFeedWrapper>
  );
};

export default Instrument;

const PositionsCounter = styled(FlexContainer)`
  font-size: 11px;
  line-height: 14px;
  color: #ffffff;
  margin-right: 4px;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }
`;
