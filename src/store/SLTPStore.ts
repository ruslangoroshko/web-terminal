import { observable, action } from 'mobx';
import { TpSlTypeEnum } from '../enums/TpSlTypeEnum';

interface ContextProps {
  tpType: TpSlTypeEnum | null;
  slType: TpSlTypeEnum | null;
  isToppingUpActive: boolean;
}

export class SLTPStore implements ContextProps {
  @observable tpType: TpSlTypeEnum | null = null;
  @observable slType: TpSlTypeEnum | null = null;
  @observable isToppingUpActive: boolean = false;

  @action
  clearStore = () => {
    this.tpType = null;
    this.slType = null;
    this.isToppingUpActive = false;
  };

  @action
  toggleToppingUp = (value: boolean) => {
    this.isToppingUpActive = value;
  };
}
