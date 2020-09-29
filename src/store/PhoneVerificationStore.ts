import { action, observable } from 'mobx';

interface Props {
  shouldValidatePhone: boolean;
}

export class PhoneVerificationStore implements Props {
  @observable shouldValidatePhone = false;

  @action
  setShouldValidatePhone = (flag: boolean) => {
    this.shouldValidatePhone = flag;
  };
}
