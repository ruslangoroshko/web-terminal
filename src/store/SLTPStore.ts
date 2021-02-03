import { observable, action } from 'mobx';
import { TpSlTypeEnum } from '../enums/TpSlTypeEnum';

interface ContextProps {
  autoCloseTPType: TpSlTypeEnum | null;
  autoCloseSLType: TpSlTypeEnum | null;
  takeProfitValue: string;
  stopLossValue: string;
  purchaseAtValue: string;
  isToppingUpActive: boolean;
}

export class SLTPStore implements ContextProps {
  @observable autoCloseTPType: TpSlTypeEnum | null = null;
  @observable autoCloseSLType: TpSlTypeEnum | null = null;
  @observable takeProfitValue: string = '';
  @observable stopLossValue: string = '';
  @observable purchaseAtValue: string = '';
  @observable investmentAmount: number = 0;
  @observable multiplier: number = 0;
  @observable openedBuySell: boolean = false;
  @observable isToppingUpActive: boolean = false;
  @observable deleteToppingUp: boolean = false;

  @action
  clearStore = () => {
    this.purchaseAtValue = '';
    this.stopLossValue = '';
    this.takeProfitValue = '';
    this.autoCloseTPType = null;
    this.autoCloseSLType = null;
    this.openedBuySell = false;
    this.isToppingUpActive = false;
  };

  @action
  toggleBuySell = (value: boolean) => {
    this.openedBuySell = value;
  };

  @action
  toggleToppingUp = (value: boolean) => {
    this.isToppingUpActive = value;
  };

  @action
  toggleDeleteToppingUp = (value: boolean) => {
    this.deleteToppingUp = value;
    this.isToppingUpActive = false;
  };
}
