export interface InstrumentModelWSDTO {
  id: string;
  name: string;
  digits: number;
  base: string;
  quote: string;
  dayOff: DayOff[];
  minOperationVolume: number;
  maxOperationVolume: number;
  amountStepSize: number;
  maxPositionVolume: number;
  multiplier: number[];
  bid?: number;
  ask?: number;
  tickSize?: number;
  groupId: string;
  weight: number;
}

interface DayOff {
  dowFrom: string;
  timeFrom: string;
  dowTo: string;
  timeTo: string;
}

export interface InstrumentGroupWSDTO {
  id: string;
  name: string;
}

export interface PriceChangeWSDTO {
  id: string;
  chng: number;
}
