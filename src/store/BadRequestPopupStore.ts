import { observable, action } from 'mobx';

interface ContextProps {
  requsetMessage?: string;
  isActive: boolean;
}

export class BadRequestPopupStore implements ContextProps {
  @observable requsetMessage: string = '';
  @observable isActive: boolean = false;
  @observable isNetwork: boolean = false;
  @observable isRecconect: boolean = false;

  @action
  setNetwork = (status: boolean) => {
    this.isNetwork = status;
  }
  @action
  setRecconect = () => {
    this.isRecconect = true;
  };
  @action
  stopRecconect = () => {
    this.isRecconect = false;
  };

  @action
  closeModal = () => {
    this.isActive = false;
  };

  @action
  openModal = () => {
    this.isActive = this.isNetwork ? false : true;
  };
  
  // TODO: rewrite to actions
  @action
  setMessage = (message: string) => {
    this.requsetMessage = message;
  }
}
