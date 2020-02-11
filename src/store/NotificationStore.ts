import { observable, action } from 'mobx';

interface ContextProps {
  notificationMessage: string;
  isActiveNotification: boolean;
  isSuccessfull: boolean;
}

export class NotificationStore implements ContextProps {
  @observable notificationMessage: string = '';
  @observable isActiveNotification: boolean = false;
  @observable isSuccessfull: boolean = false;

  @action
  closeNotification = () => {
    this.isActiveNotification = false;
    console.log(
      'TCL: NotificationStore -> closeNotification -> isActiveNotification',
      this.isActiveNotification
    );
  };

  @action
  openNotification = () => {
    this.isActiveNotification = true;
  };
}
