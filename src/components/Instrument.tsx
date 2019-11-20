import React, { useState, useEffect } from 'react';
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
import { BidAskModelDTO } from '../types/BidAsk';
import { HubConnection } from '@aspnet/signalr';

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
  const [quote, setQuote] = useState<BidAskModelDTO>();

  useEffect(() => {
    if (instrument) {
      activeSession.on(
        Topics.BID_ASK,
        (response: ResponseFromWebsocket<BidAskModelDTO>) => {
          if (!response.data.length) {
            return;
          }

          const newBidAsk = response.data[0];
          if (newBidAsk.id === instrument.id) {
            setQuote(newBidAsk);
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
              <CurrencyQuoteInfo isGrowth={quote.growth > quote.prevGrowth}>
                {quote.ask} / {quote.bid}
              </CurrencyQuoteInfo>
              <span style={{ color: '#fff' }}>
                {calculateGrowth(quote.bid, quote.ask, instrument.digits)}
              </span>
            </>
          )}
        </FlexContainer>
      </FlexContainer>
    </QuotesFeedWrapper>
  );
}

export default Instrument;
