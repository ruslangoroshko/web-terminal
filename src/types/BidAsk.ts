export interface BidAskModel {
  ask: number;
  bid: number;
  dt: string;
  id: string;
}

export interface ResponseFromWebsocket<T> {
    data: T[];
    now: string;
}