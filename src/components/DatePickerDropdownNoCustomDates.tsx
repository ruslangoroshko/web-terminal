import React, { useEffect, FC, useRef } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import IconDroplistShevron from '../assets/svg/icon-droplist-arrow-down.svg';
import SvgIcon from './SvgIcon';
import { useStores } from '../hooks/useStores';
import 'react-dates/initialize';
import { observer, Observer } from 'mobx-react-lite';
import { ShowDatesDropdownEnum } from '../enums/ShowDatesDropdownEnum';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import {
  LOCAL_HISTORY_DATERANGE,
  LOCAL_HISTORY_PAGE,
  LOCAL_HISTORY_POSITION,
  LOCAL_HISTORY_TIME,
} from '../constants/global';
import Colors from '../constants/Colors';

interface Props {
  datesChangeCallback: () => void;
}

const DatePickerDropdownNoCustomDates: FC<Props> = observer(
  ({ datesChangeCallback }) => {
    const { dateRangeStore } = useStores();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();
    const toggle = (flag: boolean) => () => {
      dateRangeStore.setOpenedDropdown(flag);
    };

    const handleSelectRange = (dateRange: ShowDatesDropdownEnum) => () => {
      dateRangeStore.setDropdownValueType(dateRange);

      switch (dateRange) {
        case ShowDatesDropdownEnum.Today:
          dateRangeStore.setStartDate(moment().startOf('day'));
          dateRangeStore.setEndDate(moment());
          break;

        case ShowDatesDropdownEnum.Week:
          dateRangeStore.setStartDate(moment().subtract(1, 'weeks'));
          dateRangeStore.setEndDate(moment());
          break;

        case ShowDatesDropdownEnum.Month:
          dateRangeStore.setStartDate(moment().subtract(1, 'months'));
          dateRangeStore.setEndDate(moment());
          break;

        case ShowDatesDropdownEnum.Year:
          dateRangeStore.setStartDate(moment().subtract(1, 'years'));
          dateRangeStore.setEndDate(moment());
          break;

        default:
          break;
      }
      localStorage.setItem(
        LOCAL_HISTORY_TIME,
        `${moment(dateRangeStore.startDate)}`
      );
      localStorage.setItem(LOCAL_HISTORY_DATERANGE, `${dateRange}`);
      localStorage.removeItem(LOCAL_HISTORY_PAGE);
      localStorage.removeItem(LOCAL_HISTORY_POSITION);
      dateRangeStore.setOpenedDropdown(false);
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
                color={
                  dateRangeStore.openedDropdown ? Colors.PRIMARY : Colors.ACCENT
                }
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
                  dateRangeStore.openedDropdown ? Colors.PRIMARY : Colors.ACCENT
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
    color: ${Colors.PRIMARY};
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
