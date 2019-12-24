import React, { useEffect, useContext } from 'react';

import { FlexContainer } from '../styles/FlexContainer';
import calculateGrowth from '../helpers/calculateGrowth';
import { InstrumentModelWSDTO } from '../types/Instruments';
import currencyIcon from '../assets/images/currency.png';
import Topics from '../constants/websocketTopics';
import { ResponseFromWebsocket } from '../types/ResponseFromWebsocket';
import { BidAskModelWSDTO } from '../types/BidAsk';
import { HubConnection } from '@aspnet/signalr';
import { QuotesContext } from '../store/QuotesProvider';
import { AskBidEnum } from '../enums/AskBid';
import {
  QuotesFeedWrapper,
  CurrencyQuoteIcon,
  CurrencyQuoteTitle,
  CurrencyQuoteInfo,
} from '../styles/InstrumentComponentStyle';
import IconClose from '../assets/svg/icon-instrument-close.svg';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import SvgIcon from './SvgIcon';
import styled from '@emotion/styled';

interface Props {
  activeSession: HubConnection;
  switchInstrument: () => void;
  instrument: InstrumentModelWSDTO;
  isActive?: boolean;
  handleClose: () => void;
  positionsLength: number;
}

function Instrument({
  activeSession,
  instrument,
  switchInstrument,
  isActive,
  handleClose,
  positionsLength = 0,
}: Props) {
  const { quotes } = useContext(QuotesContext);
  const quote = quotes[instrument.id];
  const context = useContext(QuotesContext);

  useEffect(() => {
    activeSession.on(
      Topics.BID_ASK,
      (response: ResponseFromWebsocket<BidAskModelWSDTO[]>) => {
        if (!response.data.length) {
          return;
        }

        const newBidAsk = response.data[0];
        if (newBidAsk.id === instrument.id) {
          context.setQuote(newBidAsk);
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
