import { OpenPositionModelFormik } from '../types/Positions';
import { observable, action } from 'mobx';
import { TpSlTypeEnum } from '../enums/TpSlTypeEnum';

interface ContextProps {
  initialValues?: OpenPositionModelFormik;
  autoCloseTPType: TpSlTypeEnum;
  autoCloseSLType: TpSlTypeEnum;
  takeProfitValue: string;
  stopLossValue: string;
  purchaseAtValue: string;
}

export class SLTPStore implements ContextProps {
  @observable autoCloseTPType = TpSlTypeEnum.Currency;
  @observable autoCloseSLType = TpSlTypeEnum.Currency;
  @observable takeProfitValue: string = '';
  @observable stopLossValue: string = '';
  @observable purchaseAtValue: string = '';

  @action
  clearStore = () => {
    this.purchaseAtValue = '';
    this.stopLossValue = '';
    this.takeProfitValue = '';
    this.autoCloseTPType = TpSlTypeEnum.Currency;
  };
}
