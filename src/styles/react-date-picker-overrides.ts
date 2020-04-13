import { css } from '@emotion/core';

export default css`
  .SingleDatePicker_picker {
    background: #000;
  }

  .DateRangePicker_picker {
    overflow: hidden;
    border-radius: 4px;
    box-shadow: 0px 4px 8px rgba(41, 42, 57, 0.09),
      0px 8px 16px rgba(37, 38, 54, 0.24);
  }

  .CalendarDay__blocked_out_of_range {
    color: rgba(255, 255, 255, 0.09) !important;
    &:hover {
      background-color: transparent !important;
    }
  } 

  .DayPicker,
  .CalendarMonthGrid,
  .CalendarMonthGrid,
  .CalendarMonth {
    background: #1c2026;
  }

  .CalendarDay__default {
    background: #1c2026;
    color: #fffccc;
    border: none;

    &:hover {
      border: none;
      color: #fffccc;
      background: #21b3a4;
    }
  }

  .CalendarDay__selected_span {
    background: rgba(255, 252, 204, 0.08);
    color: #fffccc;
  }

  .CalendarDay__selected {
    background: #21b3a4;
    color: #1c2026;
  }

  .CalendarDay__selected:hover {
    background: orange;
    color: #fffccc;
  }

  .CalendarDay__hovered_span:hover,
  .CalendarDay__hovered_span {
    background: rgba(255, 252, 204, 0.08);
  }

  .CalendarMonth_caption {
    color: #fffccc;
    font-size: 12px;
  }

  .DayPicker_weekHeader_li {
    color: rgba(255, 255, 255, 0.4);
  }

  .DayPicker_weekHeader.DayPicker_weekHeader_1 {
    display: none;
  }

  .DateInput,
  .SingleDatePickerInput {
    background-color: transparent;
    width: 100%;
    border: none;
    outline: none;
  }
  .DateInput_fang {
    display: none;
  }
  .DateInput_input {
    padding: 0;
    padding-top: 4px;
    border: none;
    outline: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    background-color: transparent;
    width: 100%;
    caret-color: #fff;
    color: #fffccc;
    font-size: 14px;
    line-height: 16px;
    padding-bottom: 4px;
    transition: border 0.2s ease;

    &:hover {
      border-bottom: 1px solid rgba(255, 255, 255, 0.4);
    }

    &.DateInput_input__focused {
      border-bottom: 1px solid #00ffdd;
    }
  }
`;
