export type OrderBookItemType = number[];

export type OrderBookDTOType = {
  asks: OrderBookItemType[];
  bids: OrderBookItemType[];
  isUpdate: boolean;
  market: string;
};
