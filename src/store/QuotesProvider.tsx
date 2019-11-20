import React, { useState, FC } from 'react';
import { BidAskKeyValueList, BidAskModelDTO } from '../types/BidAsk';
import throttle from '../helpers/throttle';

interface ContextProps {
  quotes: BidAskKeyValueList;
  setQuote: (quote: BidAskModelDTO) => void;
}

export const QuotesContext = React.createContext<ContextProps>(
  {} as ContextProps
);

export const QuotesConsumer = QuotesContext.Consumer;

interface Props {}

const QuotesProvider: FC<Props> = ({ children }) => {
  const [quotes, setQuotes] = useState<BidAskKeyValueList>({});
  const setQuoteByThrottle = throttle(quote => {
    setQuotes(prevQuotes => ({
      ...prevQuotes,
      [quote.id]: quote,
    }));
  }, 200);
  return (
    <QuotesContext.Provider value={{ quotes, setQuote: setQuoteByThrottle }}>
      {children}
    </QuotesContext.Provider>
  );
};

export default QuotesProvider;
