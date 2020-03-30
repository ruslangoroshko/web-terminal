import React from 'react';
import { SingleDatePicker } from 'react-dates';
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
  id: string;
}

function BirthDayPicker({
  birthday,
  focused,
  setBirthday,
  setFocused,
  id,
}: Props) {
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

  return (
    <SingleDatePicker
      id={id}
      numberOfMonths={1}      
      date={birthday}
      onDateChange={date => {
        setBirthday(date || moment());
      }}
      enableOutsideDays
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
