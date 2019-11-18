export interface BidAskModelDTO {
  ask: number;
  bid: number;
  dt: string;
  id: string;
}

export interface BidAskViewModel extends BidAskModelDTO {
  growth: number;
  prevGrowth: number;
}
