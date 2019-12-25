import { observable, action } from 'mobx';
import { BidAskKeyValueList, BidAskModelWSDTO } from '../types/BidAsk';

export class QuotesStore {
  @observable
  quotes: BidAskKeyValueList = {};

  @action
  setQuote = (quote: BidAskModelWSDTO) => {
    this.quotes = { ...this.quotes, quote };
  };
}
