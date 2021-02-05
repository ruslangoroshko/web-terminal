import { observable, action, makeAutoObservable } from 'mobx';

interface ContextProps {
  requsetMessage?: string;
  isActive: boolean;
}

export class BadRequestPopupStore implements ContextProps {
  requsetMessage: string = '';
  isActive: boolean = false;
  isNetwork: boolean = false;
  isRecconect: boolean = false;
  isReload: boolean = false;
  isSocket: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  @action
  setNetwork = (status: boolean) => {
    this.isNetwork = status;
  };

  @action
  setSocket = (status: boolean) => {
    this.isSocket = status;
  };

  @action
  setReload = () => {
    this.isReload = true;
  };

  @action
  initConectionReload = () => {
    setTimeout(() => {
      if (this.isNetwork) {
        this.setReload();
      }
    }, 15000);
  };

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
    this.isActive = !this.isNetwork;
  };

  // TODO: rewrite to actions
  @action
  setMessage = (message: string) => {
    this.requsetMessage = message;
  };
}
