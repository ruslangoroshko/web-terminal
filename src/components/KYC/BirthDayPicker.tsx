import React, { useState } from 'react';
import { SingleDatePicker, DayPickerSingleDateController } from 'react-dates';
import SvgIcon from '../SvgIcon';
import { PrimaryTextParagraph } from '../../styles/TextsElements';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import IconRightArrow from '../../assets/svg/icon-arrow-to-right.svg';
import IconLeftArrow from '../../assets/svg/icon-arrow-to-left.svg';
import moment from 'moment';
import { FlexContainer } from '../../styles/FlexContainer';
import YearMonthDropdown from './YearMonthDropdown';
import { getMonths } from '../../helpers/getMonths';
import { getYearsForBday } from '../../helpers/getYearsForBirthday';

interface Props {
  birthday: moment.Moment;
  setBirthday: (value: moment.Moment) => void;
  focused: boolean;
  setFocused: (value: boolean) => void;
}

function BirthDayPicker({ birthday, focused, setBirthday, setFocused }: Props) {
  const listOfYears = getYearsForBday();

  const selectYear = (
    onYearSelect: (currentYear: moment.Moment, newYearValue: any) => void,
    month: moment.Moment
  ) => (year: string) => {
    onYearSelect(month, year);
  };

  const selectMonth = (
    onMonthSelect: (currentMonth: moment.Moment, newMonthVal: any) => void,
    month: moment.Moment
  ) => (newMonth: string) => {
    onMonthSelect(month, newMonth);
  };

  const closeDatepicker = () => {
    setFocused(false);
  };

  return (
    <DayPickerSingleDateController
      keepOpenOnDateSelect={false}
      onOutsideClick={closeDatepicker}
      date={birthday}
      onDateChange={date => {
        console.log(date?.format('MMMM YYYY'));
        setBirthday(date || moment());
      }}
      focused={focused}
      onFocusChange={({ focused }) => setFocused(!!focused)}
      navNext={<FlexContainer></FlexContainer>}
      navPrev={<FlexContainer></FlexContainer>}
      renderMonthElement={({ month, onYearSelect, onMonthSelect }) => (
        <FlexContainer height="32px" justifyContent="center" zIndex="1000">
          <FlexContainer
            flexDirection="column"
            width="118px"
            height="32px"
            margin="0 12px 0 0"
          >
            <YearMonthDropdown
              handleSelectValue={selectMonth(onMonthSelect, month)}
              selected={month.format('MMMM')}
              list={getMonths}
            />
          </FlexContainer>
          <FlexContainer flexDirection="column" width="66px" height="32px">
            <YearMonthDropdown
              handleSelectValue={selectYear(onYearSelect, month)}
              selected={month.format('YYYY')}
              list={listOfYears}
              isYear
            />
          </FlexContainer>
        </FlexContainer>
      )}
    />
  );
}

export default BirthDayPicker;

const ButtonRightArrow = styled(ButtonWithoutStyles)`
  position: absolute;
  top: 16px;
  right: 16px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.4);
  }
`;

const ButtonLeftArrow = styled(ButtonRightArrow)`
  right: auto;
  left: 16px;
`;
