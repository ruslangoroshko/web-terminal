import { action, makeAutoObservable } from 'mobx';
import { KYCPageStepsEnum, KYCstepsEnum } from '../enums/KYCsteps';

interface Props {
  currentStep: KYCstepsEnum;
  filledStep: KYCstepsEnum;
  actualPageStep: KYCPageStepsEnum;
}

export class KYCstore implements Props {
  currentStep: KYCstepsEnum = KYCstepsEnum.PhoneVerification;
  filledStep: KYCstepsEnum = KYCstepsEnum.PhoneVerification;
  actualPageStep: KYCPageStepsEnum = KYCPageStepsEnum.Main;
  constructor() {
    makeAutoObservable(this);
  }

  @action
  setCurrentStep = (newCurrentStep: KYCstepsEnum) => {
    this.currentStep = newCurrentStep;
  };

  @action
  setCurrentPageStep = (newCurrentStep: KYCPageStepsEnum) => {
    this.actualPageStep = newCurrentStep;
  };

  @action
  setFilledStep = (newFilledStep: KYCstepsEnum) => {
    this.filledStep = newFilledStep;
  };
}
