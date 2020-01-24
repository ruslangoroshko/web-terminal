import { OpenPositionModelFormik } from '../types/Positions';
import { AutoCloseTypesEnum } from '../enums/AutoCloseTypesEnum';
import { observable, action } from 'mobx';

interface ContextProps {
  initialValues?: OpenPositionModelFormik;
  autoCloseType: AutoCloseTypesEnum;
  takeProfitValue: string;
  stopLossValue: string;
  purchaseAtValue: string;
}

export class SLTPStore implements ContextProps {
  @observable autoCloseType = AutoCloseTypesEnum.Profit;
  @observable takeProfitValue: string = '';
  @observable stopLossValue: string = '';
  @observable purchaseAtValue: string = '';

  @action
  clearStore = () => {
    this.purchaseAtValue = '';
    this.stopLossValue = '';
    this.takeProfitValue = '';
    this.autoCloseType = AutoCloseTypesEnum.Profit;
  };
}
