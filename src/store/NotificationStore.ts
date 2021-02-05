import { observable, action, makeAutoObservable } from 'mobx';

interface ContextProps {
  notificationMessage: string;
  isActiveNotification: boolean;
  isSuccessfull: boolean;
  timer?: NodeJS.Timeout;
}

export class NotificationStore implements ContextProps {
  notificationMessage: string = '';
  isActiveNotification: boolean = false;
  isActiveNotificationGlobal: boolean = false;
  isSuccessfull: boolean = false;
  timer?: NodeJS.Timeout;

  constructor() {
    makeAutoObservable(this);
  }

  @action
  closeNotification = () => {
    this.isActiveNotification = false;
    this.isActiveNotificationGlobal = false;
  };

  @action
  resetNotification = () => {
    this.isActiveNotification = false;
    this.isActiveNotificationGlobal = false;
    this.notificationMessage = '';
  };

  @action
  openNotification = () => {
    this.isActiveNotification = true;
  };

  @action
  openNotificationGlobal = () => {
    this.isActiveNotificationGlobal = true;
  };

  // TODO: rewrite to actions
  @action
  setNotification = (notification: string) => {
    this.notificationMessage = notification;
  };
}
