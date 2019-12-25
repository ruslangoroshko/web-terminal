import { observable, action } from 'mobx';
import { SideBarTabType } from '../enums/SideBarTabType';

interface ContextProps {
  sideBarTabType: SideBarTabType | null;
}

export class TabsStore implements ContextProps {
  @observable sideBarTabType: SideBarTabType | null = null;

  @action
  closeAnyTab = () => {
    this.sideBarTabType = null;
  };
}
