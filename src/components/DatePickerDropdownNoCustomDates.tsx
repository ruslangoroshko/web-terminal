import React, { useEffect, FC, useRef } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { PrimaryTextSpan, PrimaryTextParagraph } from '../styles/TextsElements';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import IconDroplistShevron from '../assets/svg/icon-droplist-arrow-down.svg';
import SvgIcon from './SvgIcon';
import IconCalendar from '../assets/svg/icon-calendar.svg';
import IconRightArrow from '../assets/svg/icon-arrow-to-right.svg';
import IconLeftArrow from '../assets/svg/icon-arrow-to-left.svg';
import { useStores } from '../hooks/useStores';
import 'react-dates/initialize';
import { observer, Observer } from 'mobx-react-lite';
import { ShowDatesDropdownEnum } from '../enums/ShowDatesDropdownEnum';
import moment from 'moment';
import { DayPickerRangeController } from 'react-dates';
import { useTranslation } from 'react-i18next';
import {
  LOCAL_HISTORY_DATERANGE,
  LOCAL_HISTORY_TIME
} from '../constants/global';

 interface Props {
  datesChangeCallback: () => void;
}

const DatePickerDropdownNoCustomDates: FC<Props> = observer(
  ({ datesChangeCallback }) => {
    const { dateRangeStore } = useStores();
    const wrapperRef = useRef<HTMLDivElement>(null);
const {t} = useTranslation()
    const toggle = (flag: boolean) => () => {
      dateRangeStore.openedDropdown = flag;
    };

    const handleSelectRange = (dateRange: ShowDatesDropdownEnum) => () => {
      dateRangeStore.dropdownValueType = dateRange;

      switch (dateRange) {
        case ShowDatesDropdownEnum.Today:
          dateRangeStore.startDate = moment().startOf('day');
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
      localStorage.setItem(LOCAL_HISTORY_TIME, `${dateRangeStore.startDate}`);
      localStorage.setItem(LOCAL_HISTORY_DATERANGE, `${dateRange}`);
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
        <Observer>
          {() => (
            <ButtonDropdown onClick={toggle(!dateRangeStore.openedDropdown)}>
              <PrimaryTextSpan
                fontSize="10px"
                color={dateRangeStore.openedDropdown ? '#00FFDD' : '#fffccc'}
                textTransform="uppercase"
                marginRight="4px"
              >
                {dateRangeStore.dropdownValueType ===
                ShowDatesDropdownEnum.Custom
                  ? `${
                      dateRangeStore.startDate
                        ? dateRangeStore.startDate.format('DD/MM/YYYY')
                        : ''
                    } - ${
                      dateRangeStore.endDate
                        ? dateRangeStore.endDate.format('DD/MM/YYYY')
                        : ''
                    }`
                  : t(ShowDatesDropdownEnum[dateRangeStore.dropdownValueType])}
              </PrimaryTextSpan>
              <SvgIcon
                {...IconDroplistShevron}
                fillColor={
                  dateRangeStore.openedDropdown ? '#00FFDD' : '#fffccc'
                }
                transformProp={
                  dateRangeStore.openedDropdown ? 'rotate(0)' : 'rotate(180deg)'
                }
              />
            </ButtonDropdown>
          )}
        </Observer>
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
              <SelectDateButton
                onClick={dataRangeStoreNoCustomDates.toggleDatepicker}
              >
                <PrimaryTextSpan>Select Date</PrimaryTextSpan>
                <SvgIcon
                  {...IconCalendar}
                  fillColor="rgba(255, 255, 255, 0.6)"
                />
              </SelectDateButton>
              {dataRangeStoreNoCustomDates.focusedInput && (
                <FlexContainer position="absolute" top="100%" left="100%">
                  <DayPickerRangeController
                    keepOpenOnDateSelect={false}
                    startDate={dataRangeStoreNoCustomDates.startDate}
                    endDate={dataRangeStoreNoCustomDates.endDate}
                    onOutsideClick={dataRangeStoreNoCustomDates.closeDatepicker}
                    onDatesChange={({ startDate, endDate }) => {
                      dataRangeStoreNoCustomDates.startDate =
                        startDate || moment();
                      dataRangeStoreNoCustomDates.endDate = endDate || moment();
                      dataRangeStoreNoCustomDates.dropdownValueType =
                        ShowDatesDropdownEnum.Custom;
                      datesChangeCallback();
                    }}
                    focusedInput={dataRangeStoreNoCustomDates.focusedInput}
                    onFocusChange={focusedInput => {
                      dataRangeStoreNoCustomDates.focusedInput = focusedInput;
                      if (focusedInput === null) {
                        dataRangeStoreNoCustomDates.closeDropdown();
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
  }
);

export default DatePickerDropdownNoCustomDates;

const DatePickerWrapper = styled(FlexContainer)`
  position: absolute;
  top: 100%;
  left: -16px;
  width: 172px;
  background-color: #1c2026;
  box-shadow: 0px 4px 8px rgba(41, 42, 57, 0.24),
    0px 8px 16px rgba(37, 38, 54, 0.6);
  border-radius: 4px;
  padding: 0 16px;
  z-index: 1;
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
  will-change: color;

  &:last-of-type {
    margin-bottom: 0;
  }

  &:hover > span {
    color: #00fff2;
  }
`;

const ButtonDropdown = styled(ButtonWithoutStyles)`
  display: flex;
  align-items: center;
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
