import { makeAutoObservable, observable } from 'mobx';
import { KYCstepsEnum } from '../enums/KYCsteps';

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
}
