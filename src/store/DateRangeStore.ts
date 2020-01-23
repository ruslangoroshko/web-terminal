import { observable, action } from 'mobx';
import moment from 'moment';
import { FocusedInputShape } from 'react-dates';

interface ContextProps {
  selectedRange: string;
  openedDropdown: boolean;
  startDate: moment.Moment | null;
  endDate: moment.Moment | null;
  focusedInput: FocusedInputShape | null;
}

export class DateRangeStore implements ContextProps {
  @observable selectedRange = 'Select dates';
  @observable openedDropdown = false;
  @observable startDate: moment.Moment | null = null;
  @observable endDate: moment.Moment | null = null;
  @observable focusedInput: FocusedInputShape | null = null;

  @action
  closeDropdown = () => {
    this.focusedInput = null;
    this.openedDropdown = false;
  };

  @action
  openDropdown = () => {
    this.openedDropdown = true;
  };

  @action
  openDatepicker = () => {
    this.focusedInput = 'startDate';
  };

  @action
  closeDatepicker = () => {
    this.focusedInput = null;
  };

  @action
  toggleDatepicker = () => {
    this.focusedInput = this.focusedInput ? null : 'startDate';
  };

  @action
  resetDatepicker = () => {
    this.startDate = null;
    this.endDate = null;
    this.focusedInput = null;
  };
}