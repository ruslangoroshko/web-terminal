import { css } from '@emotion/core';

export default css`
  .DateRangePicker_picker {
    overflow: hidden;
    border-radius: 4px;
    box-shadow: 0px 4px 8px rgba(41, 42, 57, 0.09),
      0px 8px 16px rgba(37, 38, 54, 0.24);
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
`;
