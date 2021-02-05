import { observable, action, makeAutoObservable } from 'mobx';
import { TpSlTypeEnum } from '../enums/TpSlTypeEnum';

interface ContextProps {
  tpType: TpSlTypeEnum;
  slType: TpSlTypeEnum;
  isToppingUpActive: boolean;
  instrumentId: string;
  closedByChart: boolean;
}

export class SLTPStore implements ContextProps {
  tpType: TpSlTypeEnum = TpSlTypeEnum.Currency;
  slType: TpSlTypeEnum = TpSlTypeEnum.Currency;
  isToppingUpActive: boolean = false;
  closedByChart: boolean = false;
  instrumentId: string = '';

  constructor() {
    makeAutoObservable(this);
  }

  @action
  clearStore = () => {
    this.setTpType(TpSlTypeEnum.Currency);
    this.setSlType(TpSlTypeEnum.Currency);
    this.toggleToppingUp(false);
  };

  @action
  toggleToppingUp = (value: boolean) => {
    this.isToppingUpActive = value;
  };

  @action
  setTpType = (tpType: TpSlTypeEnum) => {
    this.tpType = tpType;
  };

  @action
  setSlType = (slType: TpSlTypeEnum) => {
    this.slType = slType;
  };

  @action
  setInstrumentId = (instrumentId: string) => {
    this.instrumentId = instrumentId;
  };
}
