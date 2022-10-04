import { makeAutoObservable } from 'mobx';
import { OrderBookItemType } from '../types/OrderBookTypes';

interface OrderBookStoreProps {
  market: string;
  bids: OrderBookItemType[];
  asks: OrderBookItemType[];
}

export class OrderBookStore implements OrderBookStoreProps {
  market = '';
  bids: OrderBookItemType[] = [];
  asks: OrderBookItemType[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setBids(bids: OrderBookItemType[]) {
    this.bids = bids;
  }
  setAsks(asks: OrderBookItemType[]) {
    this.asks = asks;
  }
  setMarket(market: string) {
    this.market = market;
  }
}
