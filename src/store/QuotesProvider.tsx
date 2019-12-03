import React, { useState, FC } from 'react';
import { BidAskKeyValueList, BidAskModelWSDTO } from '../types/BidAsk';
import throttle from '../helpers/throttle';

interface ContextProps {
  quotes: BidAskKeyValueList;
  setQuote: (quote: BidAskModelWSDTO) => void;
}

export const QuotesContext = React.createContext<ContextProps>(
  {} as ContextProps
);

export const QuotesConsumer = QuotesContext.Consumer;

interface Props {}

const QuotesProvider: FC<Props> = ({ children }) => {
  const [quotes, setQuotes] = useState<BidAskKeyValueList>({});
  const setQuote = (quote: BidAskModelWSDTO) => {
    setQuotes(prevQuotes => ({
      ...prevQuotes,
      [quote.id]: quote,
    }));
  };
  return (
    <QuotesContext.Provider value={{ quotes, setQuote }}>
      {children}
    </QuotesContext.Provider>
  );
};

export default QuotesProvider;
