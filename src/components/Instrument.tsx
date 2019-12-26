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
import { observer } from 'mobx-react-lite';

interface Props {
  switchInstrument: () => void;
  instrument: InstrumentModelWSDTO;
  isActive?: boolean;
  handleClose: () => void;
  positionsLength: number;
}

const Instrument: FC<Props> = observer(
  ({
    instrument,
    switchInstrument,
    isActive,
    handleClose,
    positionsLength = 0,
  }) => {
    const { quotesStore, mainAppStore } = useStores();

    const quote = quotesStore.quotes[instrument.id];

    useEffect(() => {
      mainAppStore.activeSession?.on(
        Topics.BID_ASK,
        (response: ResponseFromWebsocket<BidAskModelWSDTO[]>) => {
          if (!response.data.length) {
            return;
          }

          const newBidAsk = response.data[0];
          if (newBidAsk.id === instrument.id) {
            quotesStore.setQuote(newBidAsk);
          }
        }
      );
    }, [instrument]);

    return (
      <QuotesFeedWrapper
        isActive={isActive}
        padding="8px 12px"
        onClick={switchInstrument}
        width="200px"
        height="28px"
        margin="0 4px 0 0"
        alignItems="center"
        justifyContent="space-between"
      >
        <CurrencyQuoteTitle>{instrument.name}</CurrencyQuoteTitle>
        <FlexContainer alignItems="center">
          {quote && <CurrencyQuoteInfo>{quote.bid.c}</CurrencyQuoteInfo>}
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
          <ButtonWithoutStyles onClick={handleClose}>
            <SvgIcon {...IconClose} fill="rgba(255, 255, 255, 0.6)"></SvgIcon>
          </ButtonWithoutStyles>
        </FlexContainer>
      </QuotesFeedWrapper>
    );
  }
);

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
