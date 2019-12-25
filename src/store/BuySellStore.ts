import { OpenPositionModelFormik } from '../types/Positions';
import { AutoCloseTypesEnum } from '../enums/AutoCloseTypesEnum';
import { observable } from 'mobx';

interface ContextProps {
  initialValues?: OpenPositionModelFormik;
  autoCloseProfit: AutoCloseTypesEnum;
  autoCloseLoss: AutoCloseTypesEnum;
  takeProfitValue: string;
  stopLossValue: string;
}

export class BuySellStore implements ContextProps {
  @observable autoCloseProfit = AutoCloseTypesEnum.Profit;
  @observable autoCloseLoss = AutoCloseTypesEnum.Profit;
  @observable takeProfitValue = '';
  @observable stopLossValue = '';
}
