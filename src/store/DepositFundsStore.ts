import { observable, action, makeAutoObservable } from 'mobx';
import { DepositTypeEnum } from '../enums/DepositTypeEnum';

interface Props {
  activeDepositType: DepositTypeEnum;
  isActivePopup: boolean;
}

export class DepositFundsStore implements Props {
  activeDepositType: DepositTypeEnum = DepositTypeEnum.VisaMaster;
  isActivePopup = false;

  constructor() {
    makeAutoObservable(this);
  }

  @action
  togglePopup = () => {
    this.isActivePopup = !this.isActivePopup;
  };

  @action
  openPopup = () => {
    this.isActivePopup = true;
  };

  @action
  setActiveDepositType = (newActiveDepositeType: DepositTypeEnum) => {
    this.activeDepositType = newActiveDepositeType;
  };
}
