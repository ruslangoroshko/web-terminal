import { action, makeAutoObservable, observable } from 'mobx';
import { KYCstepsEnum } from '../enums/KYCsteps';
import { InstrumentModelWSDTO } from '../types/InstrumentsTypes';

interface Props {
  currentStep: KYCstepsEnum;
  filledStep: KYCstepsEnum;
}

export class KYCstore implements Props {
  currentStep: KYCstepsEnum = KYCstepsEnum.PhoneVerification;
  filledStep: KYCstepsEnum = KYCstepsEnum.PhoneVerification;
  constructor() {
    makeAutoObservable(this);
  }

  @action
  setCurrentStep = (newCurrentStep: KYCstepsEnum) => {
    this.currentStep = newCurrentStep;
  };

  @action
  setFilledStep = (newFilledStep: KYCstepsEnum) => {
    this.filledStep = newFilledStep;
  };
}
