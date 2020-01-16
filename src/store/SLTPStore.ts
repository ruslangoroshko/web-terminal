import { OpenPositionModelFormik } from '../types/Positions';
import { AutoCloseTypesEnum } from '../enums/AutoCloseTypesEnum';
import { observable, action } from 'mobx';

interface ContextProps {
  initialValues?: OpenPositionModelFormik;
  autoCloseType: AutoCloseTypesEnum;
  takeProfitValue: number | null;
  stopLossValue: number | null;
  purchaseAtValue: number | null;
}

export class SLTPStore implements ContextProps {
  @observable autoCloseType = AutoCloseTypesEnum.Profit;
  @observable takeProfitValue: number | null = null;
  @observable stopLossValue: number | null = null;
  @observable purchaseAtValue: number | null = null;

  @action
  clearStore = () => {
    this.purchaseAtValue = null;
    this.stopLossValue = null;
    this.takeProfitValue = null;
    this.autoCloseType = AutoCloseTypesEnum.Profit;
  };
}
