import { observable, action } from 'mobx';

interface ContextProps {
  notificationMessage: string;
  isActiveNotification: boolean;
  isSuccessfull: boolean;
  timer?: NodeJS.Timeout;
}

export class NotificationStore implements ContextProps {
  @observable notificationMessage: string = '';
  @observable isActiveNotification: boolean = false;
  @observable isActiveNotificationGlobal: boolean = false;
  @observable isSuccessfull: boolean = false;
  @observable timer?: NodeJS.Timeout;

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
  }
}
