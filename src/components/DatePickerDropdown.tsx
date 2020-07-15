import React, { FC, useEffect, useRef } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { PrimaryTextSpan, PrimaryTextParagraph } from '../styles/TextsElements';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import IconCalendar from '../assets/svg/icon-calendar.svg';
import IconDroplistShevron from '../assets/svg/icon-droplist-arrow-down.svg';
import SvgIcon from './SvgIcon';
import { useStores } from '../hooks/useStores';
import { DayPickerRangeController } from 'react-dates';
import 'react-dates/initialize';
import IconRightArrow from '../assets/svg/icon-arrow-to-right.svg';
import IconLeftArrow from '../assets/svg/icon-arrow-to-left.svg';
import { observer } from 'mobx-react-lite';
import { ShowDatesDropdownEnum } from '../enums/ShowDatesDropdownEnum';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

interface Props {
  datesChangeCallback: () => void;
}

const DatePickerDropdown: FC<Props> = observer(({ datesChangeCallback }) => {
  const { dateRangeStore } = useStores();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const toggle = (flag: boolean) => () => {
    dateRangeStore.openedDropdown = flag;
  };

  const handleSelectRange = (dateRange: ShowDatesDropdownEnum) => () => {
    dateRangeStore.dropdownValueType = dateRange;

    switch (dateRange) {
      case ShowDatesDropdownEnum.Today:
        dateRangeStore.startDate = moment().subtract(1, 'days');
        dateRangeStore.endDate = moment();
        break;

      case ShowDatesDropdownEnum.Week:
        dateRangeStore.startDate = moment().subtract(1, 'weeks');
        dateRangeStore.endDate = moment();
        break;

      case ShowDatesDropdownEnum.Month:
        dateRangeStore.startDate = moment().subtract(1, 'months');
        dateRangeStore.endDate = moment();
        break;

      case ShowDatesDropdownEnum.Year:
        dateRangeStore.startDate = moment().subtract(1, 'years');
        dateRangeStore.endDate = moment();
        break;

      default:
        break;
    }
    dateRangeStore.openedDropdown = false;
    datesChangeCallback();
  };

  const handleClickOutside = (e: any) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      toggle(false)();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <FlexContainer position="relative" width="190px" ref={wrapperRef}>
      <InputLabelWrapper
        width="100%"
        alignItems="center"
        justifyContent="space-between"
        onClick={toggle(!dateRangeStore.openedDropdown)}
        isActive={dateRangeStore.openedDropdown}
        tabIndex={-1}
      >
        <FlexContainer alignItems="center">
          <FlexContainer margin="0 8px 0 0">
            <SvgIcon {...IconCalendar} fillColor="rgba(255, 255, 255, 0.6)" />
          </FlexContainer>
          <PrimaryTextSpan fontSize="12px" whiteSpace="nowrap">
            {dateRangeStore.startDate || dateRangeStore.endDate
              ? `${
                  dateRangeStore.startDate
                    ? dateRangeStore.startDate.format('DD/MM/YYYY')
                    : ''
                } - ${
                  dateRangeStore.endDate
                    ? dateRangeStore.endDate.format('DD/MM/YYYY')
                    : ''
                }`
              : t('Select dates')}
          </PrimaryTextSpan>
        </FlexContainer>
        <FlexContainer>
          <SvgIcon
            {...IconDroplistShevron}
            fillColor="rgba(255, 255, 255, 0.6)"
          />
        </FlexContainer>
      </InputLabelWrapper>
      {dateRangeStore.openedDropdown && (
        <DatePickerWrapper flexDirection="column">
          <DefinedDaterangeWrapper
            flexDirection="column"
            alignItems="flex-start"
          >
            <DateRangeItemButton
              onClick={handleSelectRange(ShowDatesDropdownEnum.Today)}
            >
              <PrimaryTextSpan fontSize="14px" color="#fffccc">
                {t('Today')}
              </PrimaryTextSpan>
            </DateRangeItemButton>
            <DateRangeItemButton
              onClick={handleSelectRange(ShowDatesDropdownEnum.Week)}
            >
              <PrimaryTextSpan fontSize="14px" color="#fffccc">
                {t('Week')}
              </PrimaryTextSpan>
            </DateRangeItemButton>
            <DateRangeItemButton
              onClick={handleSelectRange(ShowDatesDropdownEnum.Month)}
            >
              <PrimaryTextSpan fontSize="14px" color="#fffccc">
                {t('Month')}
              </PrimaryTextSpan>
            </DateRangeItemButton>
            <DateRangeItemButton
              onClick={handleSelectRange(ShowDatesDropdownEnum.Year)}
            >
              <PrimaryTextSpan fontSize="14px" color="#fffccc">
                {t('Year')}
              </PrimaryTextSpan>
            </DateRangeItemButton>
          </DefinedDaterangeWrapper>
          {/* <FlexContainer padding="16px 0" position="relative">
            <SelectDateButton onClick={dateRangeStore.toggleDatepicker}>
              <PrimaryTextSpan>Select Date</PrimaryTextSpan>
              <SvgIcon {...IconCalendar} fillColor="rgba(255, 255, 255, 0.6)" />
            </SelectDateButton>
            {dateRangeStore.focusedInput && (
              <FlexContainer position="absolute" top="100%" left="100%">
                <DayPickerRangeController
                  keepOpenOnDateSelect={false}
                  startDate={dateRangeStore.startDate}
                  endDate={dateRangeStore.endDate}
                  onOutsideClick={dateRangeStore.closeDatepicker}
                  onDatesChange={({ startDate, endDate }) => {
                    dateRangeStore.startDate = startDate || moment();
                    dateRangeStore.endDate = endDate || moment();
                    datesChangeCallback();
                  }}
                  focusedInput={dateRangeStore.focusedInput}
                  onFocusChange={focusedInput => {
                    dateRangeStore.focusedInput = focusedInput;
                    if (focusedInput === null) {
                      dateRangeStore.closeDropdown();
                    }
                  }}
                  numberOfMonths={2}
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
                  renderMonthElement={({ month }) => (
                    <PrimaryTextParagraph>
                      {month.format('MMMM YYYY')}
                    </PrimaryTextParagraph>
                  )}
                />
              </FlexContainer>
            )}
          </FlexContainer> */}
        </DatePickerWrapper>
      )}
    </FlexContainer>
  );
});

export default DatePickerDropdown;

const DatePickerWrapper = styled(FlexContainer)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #1c2026;
  box-shadow: 0px 4px 8px rgba(41, 42, 57, 0.24),
    0px 8px 16px rgba(37, 38, 54, 0.6);
  border-radius: 4px;
  padding: 0 16px;
`;

const DefinedDaterangeWrapper = styled(FlexContainer)`
  /* border-bottom: 1px solid rgba(255, 255, 255, 0.16); */
  padding: 16px 0;
`;

const DateRangeItemButton = styled(ButtonWithoutStyles)`
  transition: color 0.2s ease;
  margin-bottom: 16px;
  width: 100%;
  text-align: left;

  &:last-of-type {
    margin-bottom: 0;
  }

  &:hover > span {
    color: #00fff2;
  }
`;

const InputLabelWrapper = styled(FlexContainer)<{ isActive?: boolean }>`
  background-color: rgba(255, 255, 255, 0.06);
  border: ${props =>
    props.isActive
      ? '1px solid #00FFDD'
      : '1px solid rgba(255, 255, 255, 0.19)'};
  box-sizing: border-box;
  border-radius: 4px;
  padding: 8px;
  transition: background-color 0.2s ease;
  will-change: background-color;

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
    cursor: pointer;
  }

  &:focus {
    border-color: #00ffdd;
  }
`;

const ButtonRightArrow = styled(ButtonWithoutStyles)`
  position: absolute;
  top: 16px;
  right: 16px;
  transition: background-color 0.2s ease;
  will-change: background-color;

  &:hover {
    background-color: rgba(255, 255, 255, 0.4);
  }
`;

const ButtonLeftArrow = styled(ButtonRightArrow)`
  right: auto;
  left: 16px;
`;

const SelectDateButton = styled(ButtonWithoutStyles)`
  display: flex;
  width: 100%;
  justify-content: space-between;
  transition: color 0.2s ease;
  will-change: color;

  &:hover > span {
    color: #00fff2;
  }
`;
