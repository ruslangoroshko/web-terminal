import React, { useState, useEffect, useContext } from 'react';
import {
  QuotesFeedWrapper,
  CurrencyQuoteIcon,
  CurrencyQuoteTitle,
  CurrencyQuoteInfo,
} from '../styles/Pages/Dashboard';
import { FlexContainer } from '../styles/FlexContainer';
import calculateGrowth from '../helpers/calculateGrowth';
import { InstrumentModelDTO } from '../types/Instruments';
import currencyIcon from '../assets/images/currency.png';
import Topics from '../constants/websocketTopics';
import { ResponseFromWebsocket } from '../types/ResponseFromWebsocket';
import { BidAskModelWSDTO } from '../types/BidAsk';
import { HubConnection } from '@aspnet/signalr';
import { QuotesContext } from '../store/QuotesProvider';
import { AskBidEnum } from '../enums/AskBid';

interface Props {
  activeSession: HubConnection;
  switchInstrument: (arg0: InstrumentModelDTO) => () => void;
  instrument: InstrumentModelDTO;
  isActive?: boolean;
}

function Instrument({
  activeSession,
  instrument,
  switchInstrument,
  isActive,
}: Props) {
  const { quotes } = useContext(QuotesContext);
  // TODO: remove this typo hack
  const quote = quotes[instrument.id];

  const context = useContext(QuotesContext);

  useEffect(() => {
    if (instrument) {
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
    }
  }, [instrument]);
  return (
    <QuotesFeedWrapper
      isActive={isActive}
      padding="10px"
      onClick={switchInstrument(instrument)}
    >
      <FlexContainer alignItems="center" justifyContent="center">
        <CurrencyQuoteIcon src={currencyIcon} />
      </FlexContainer>
      <FlexContainer flexDirection="column" width="160px">
        <CurrencyQuoteTitle>{instrument.name}</CurrencyQuoteTitle>
        <FlexContainer flexDirection="column">
          {quote && (
            <>
              <CurrencyQuoteInfo isGrowth={quote.dir === AskBidEnum.Sell}>
                {quote.ask.c} / {quote.bid.c}
              </CurrencyQuoteInfo>
              <span style={{ color: '#fff' }}>
                {calculateGrowth(quote.bid.c, quote.ask.c, instrument.digits)}
              </span>
            </>
          )}
        </FlexContainer>
      </FlexContainer>
    </QuotesFeedWrapper>
  );
}

export default Instrument;
