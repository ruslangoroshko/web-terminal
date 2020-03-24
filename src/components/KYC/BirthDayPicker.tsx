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

interface Props {}

function BirthDayPicker() {
  const [birthday, setBirthday] = useState<moment.Moment>(moment());

  const [focused, setFocused] = useState(false);

  const listOfYears = getYearsForBday();

  const selectYear = (
    onYearSelect: (currentYear: moment.Moment, newYearValue: any) => void
  ) => (year: string) => {
    onYearSelect(birthday, year);
  };

  const selectMonth = (
    onMonthSelect: (currentMonth: moment.Moment, newMonthVal: any) => void
  ) => (month: string) => {
    onMonthSelect(moment(), month);
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
      navNext={
        <ButtonRightArrow>
          <SvgIcon
            {...IconRightArrow}
            fillColor="rgba(255, 255, 255, 0.6)"
          ></SvgIcon>
        </ButtonRightArrow>
      }
      navPrev={
        <ButtonLeftArrow>
          <SvgIcon
            {...IconLeftArrow}
            fillColor="rgba(255, 255, 255, 0.6)"
          ></SvgIcon>
        </ButtonLeftArrow>
      }
      renderMonthElement={({ month, onYearSelect, onMonthSelect }) => (
        <FlexContainer height="32px" flexDirection="column" zIndex="1000">
          <FlexContainer>
            <FlexContainer
              flexDirection="column"
              width="118px"
              height="32px"
              margin="0 12px 0 0"
            >
              <YearMonthDropdown
                handleSelectValue={selectMonth(onMonthSelect)}
                selected={month.format('MMMM')}
                list={getMonths}
              />
            </FlexContainer>
            <FlexContainer flexDirection="column" width="66px" height="32px">
              <YearMonthDropdown
                handleSelectValue={selectYear(onYearSelect)}
                selected={month.format('YYYY')}
                list={listOfYears}
                isYear
              />
            </FlexContainer>
          </FlexContainer>
          <PrimaryTextParagraph>{month.format('MMMM')}</PrimaryTextParagraph>
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
