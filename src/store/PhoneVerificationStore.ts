import { action, makeAutoObservable } from 'mobx';

interface Props {
  shouldValidatePhone: boolean;
}

export class PhoneVerificationStore implements Props {
  shouldValidatePhone = false;

  constructor() {
    makeAutoObservable(this);
  }

  @action
  setShouldValidatePhone = (flag: boolean) => {
    this.shouldValidatePhone = flag;
  };
}
