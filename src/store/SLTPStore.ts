import { observable, action } from 'mobx';
import { TpSlTypeEnum } from '../enums/TpSlTypeEnum';

interface ContextProps {
  autoCloseTPType: TpSlTypeEnum | null;
  autoCloseSLType: TpSlTypeEnum | null;
  takeProfitValue: string;
  stopLossValue: string;
  purchaseAtValue: string;
}

export class SLTPStore implements ContextProps {
  @observable autoCloseTPType: TpSlTypeEnum | null = null;
  @observable autoCloseSLType: TpSlTypeEnum | null = null;
  @observable takeProfitValue: string = '';
  @observable stopLossValue: string = '';
  @observable purchaseAtValue: string = '';
  @observable openedBuySell: boolean = false;

  @action
  clearStore = () => {
    this.purchaseAtValue = '';
    this.stopLossValue = '';
    this.takeProfitValue = '';
    this.autoCloseTPType = null;
    this.autoCloseSLType = null;
    this.openedBuySell = false;
  };

  @action
  toggleBuySell = (value: boolean) => {
    this.openedBuySell = value;
  };
}
