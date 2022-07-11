import React, { FC, useEffect, useRef } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import IconCalendar from '../assets/svg/icon-calendar.svg';
import IconDroplistShevron from '../assets/svg/icon-droplist-arrow-down.svg';
import SvgIcon from './SvgIcon';
import { useStores } from '../hooks/useStores';
import 'react-dates/initialize';
import { observer } from 'mobx-react-lite';
import { ShowDatesDropdownEnum } from '../enums/ShowDatesDropdownEnum';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import Colors from '../constants/Colors';

interface Props {
  datesChangeCallback: () => void;
}

const DatePickerAccountBalanceDropdown: FC<Props> = observer(
  ({ datesChangeCallback }) => {
    const { dateRangeAccountBalanceStore } = useStores();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();
    const toggle = (flag: boolean) => () => {
      dateRangeAccountBalanceStore.setOpenedDropdown(flag);
    };

    const handleSelectRange = (dateRange: ShowDatesDropdownEnum) => () => {
      dateRangeAccountBalanceStore.setDropdownValueType(dateRange);

      switch (dateRange) {
        case ShowDatesDropdownEnum.Today:
          dateRangeAccountBalanceStore.setStartDate(moment().startOf('day'));
          dateRangeAccountBalanceStore.setEndDate(moment());
          break;

        case ShowDatesDropdownEnum.Week:
          dateRangeAccountBalanceStore.setStartDate(moment().subtract(1, 'weeks'));
          dateRangeAccountBalanceStore.setEndDate(moment());
          break;

        case ShowDatesDropdownEnum.Month:
          dateRangeAccountBalanceStore.setStartDate(moment().subtract(1, 'months'));
          dateRangeAccountBalanceStore.setEndDate(moment());
          break;

        case ShowDatesDropdownEnum.Year:
          dateRangeAccountBalanceStore.setStartDate(moment().subtract(1, 'years'));
          dateRangeAccountBalanceStore.setEndDate(moment());
          break;

        default:
          break;
      }
      dateRangeAccountBalanceStore.setOpenedDropdown(false);
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
          onClick={toggle(!dateRangeAccountBalanceStore.openedDropdown)}
          isActive={dateRangeAccountBalanceStore.openedDropdown}
          tabIndex={-1}
        >
          <FlexContainer alignItems="center">
            <FlexContainer margin="0 8px 0 0">
              <SvgIcon {...IconCalendar} fillColor={Colors.WHITE_DARK} />
            </FlexContainer>
            <PrimaryTextSpan fontSize="12px" whiteSpace="nowrap">
              {dateRangeAccountBalanceStore.startDate ||
              dateRangeAccountBalanceStore.endDate
                ? `${
                    dateRangeAccountBalanceStore.startDate
                      ? dateRangeAccountBalanceStore.startDate.format(
                          'DD/MM/YYYY'
                        )
                      : ''
                  } - ${
                    dateRangeAccountBalanceStore.endDate
                      ? dateRangeAccountBalanceStore.endDate.format(
                          'DD/MM/YYYY'
                        )
                      : ''
                  }`
                : t('Select dates')}
            </PrimaryTextSpan>
          </FlexContainer>
          <FlexContainer>
            <SvgIcon
              {...IconDroplistShevron}
              fillColor={Colors.WHITE_DARK}
            />
          </FlexContainer>
        </InputLabelWrapper>
        {dateRangeAccountBalanceStore.openedDropdown && (
          <DatePickerWrapper flexDirection="column">
            <DefinedDaterangeWrapper
              flexDirection="column"
              alignItems="flex-start"
            >
              <DateRangeItemButton
                onClick={handleSelectRange(ShowDatesDropdownEnum.Today)}
              >
                <PrimaryTextSpan fontSize="14px" color={Colors.ACCENT}>
                  {t('Today')}
                </PrimaryTextSpan>
              </DateRangeItemButton>
              <DateRangeItemButton
                onClick={handleSelectRange(ShowDatesDropdownEnum.Week)}
              >
                <PrimaryTextSpan fontSize="14px" color={Colors.ACCENT}>
                  {t('Week')}
                </PrimaryTextSpan>
              </DateRangeItemButton>
              <DateRangeItemButton
                onClick={handleSelectRange(ShowDatesDropdownEnum.Month)}
              >
                <PrimaryTextSpan fontSize="14px" color={Colors.ACCENT}>
                  {t('Month')}
                </PrimaryTextSpan>
              </DateRangeItemButton>
              <DateRangeItemButton
                onClick={handleSelectRange(ShowDatesDropdownEnum.Year)}
              >
                <PrimaryTextSpan fontSize="14px" color={Colors.ACCENT}>
                  {t('Year')}
                </PrimaryTextSpan>
              </DateRangeItemButton>
            </DefinedDaterangeWrapper>
          </DatePickerWrapper>
        )}
      </FlexContainer>
    );
  }
);

export default DatePickerAccountBalanceDropdown;

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
    color: ${Colors.PRIMARY_LIGHT};
  }
`;

const InputLabelWrapper = styled(FlexContainer)<{ isActive?: boolean }>`
  background-color: rgba(255, 255, 255, 0.06);
  border: ${(props) =>
    props.isActive
      ? `1px solid ${Colors.PRIMARY}`
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
    border-color: ${Colors.PRIMARY_LIGHT};
  }
`;

const ButtonRightArrow = styled(ButtonWithoutStyles)`
  position: absolute;
  top: 16px;
  right: 16px;
  transition: background-color 0.2s ease;
  will-change: background-color;

  &:hover {
    background-color: ${Colors.WHITE_LIGHT};
  }
`;
