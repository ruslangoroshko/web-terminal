import { observable } from 'mobx';
import { KYCstepsEnum } from '../enums/KYCsteps';

interface Props {
  currentStep: KYCstepsEnum;
}

export class KYCstore implements Props {
  @observable currentStep: KYCstepsEnum = KYCstepsEnum.PhoneVerification;
}
