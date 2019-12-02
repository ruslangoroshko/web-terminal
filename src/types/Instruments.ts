export interface InstrumentModelDTO {
  id: string;
  name: string;
  digits: number;
  base: string;
  quote: string;
  dayOff: DayOff[];
  minOperationVolume: number;
  maxOperationVolume: number;
  maxPositionVolume: number;
  leverage: number;
}

export interface InstrumentModelWSDTO {
  accountId: string;
  instruments: InstrumentModelDTO[];
}

interface DayOff {
  dowFrom: string;
  timeFrom: string;
  dowTo: string;
  timeTo: string;
}
