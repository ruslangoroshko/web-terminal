import { observable, action } from 'mobx';

interface ContextProps {
  requsetMessage?: string;
  isActive: boolean;
}

export class BadRequestPopupStore implements ContextProps {
  @observable requsetMessage: string = '';
  @observable isActive: boolean = false;

  @action
  closeModal = () => {
    this.isActive = false;
  };

  @action
  openModal = () => {
    this.isActive = true;
  };

  // TODO: rewrite to actions
  @action
  setMessage = (message: string) => {
    this.requsetMessage = message;
  }
}
