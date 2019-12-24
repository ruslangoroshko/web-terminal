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
  bid: number;
  ask: number;
}

interface DayOff {
  dowFrom: string;
  timeFrom: string;
  dowTo: string;
  timeTo: string;
}
