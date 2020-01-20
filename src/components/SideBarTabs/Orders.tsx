import React, { FC, useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import styled from '@emotion/styled';
import { useStores } from '../../hooks/useStores';
import { Observer } from 'mobx-react-lite';
import { PortfolioTabEnum } from '../../enums/PortfolioTabEnum';
import PendingOrder from './PendingOrder';
import {
  PrimaryTextSpan,
  PrimaryTextParagraph,
} from '../../styles/TextsElements';
import Toggle from '../Toggle';
import moment, { Moment } from 'moment';
import { DateRangePicker } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import SvgIcon from '../SvgIcon';
import IconRightArrow from '../../assets/svg/icon-arrow-to-right.svg';
import IconLeftArrow from '../../assets/svg/icon-arrow-to-left.svg';

const Orders: FC = () => {
  const { quotesStore, tabsStore, mainAppStore } = useStores();

  const [startDate, setStartDate] = useState<moment.Moment | null>(moment());
  const [endDate, setEndDate] = useState<moment.Moment | null>(moment());
  const [focusedInput, setFocusedInput] = useState<
    'startDate' | 'endDate' | null
  >(null);

  const handleChangePortfolioTab = (portfolioTab: PortfolioTabEnum) => () => {
    tabsStore.portfolioTab = portfolioTab;
  };

  return (
    <PortfolioWrapper padding="12px 16px" flexDirection="column">
      <FlexContainer flexDirection="column">
        <FlexContainer margin="0 0 28px">
          <Observer>
            {() => (
              <>
                <TabPortfolitButton
                  isActive={
                    tabsStore.portfolioTab === PortfolioTabEnum.Portfolio
                  }
                  onClick={handleChangePortfolioTab(PortfolioTabEnum.Portfolio)}
                >
                  Portfolio
                </TabPortfolitButton>
                <TabPortfolitButton
                  isActive={tabsStore.portfolioTab === PortfolioTabEnum.Orders}
                  onClick={handleChangePortfolioTab(PortfolioTabEnum.Orders)}
                >
                  Orders
                </TabPortfolitButton>
              </>
            )}
          </Observer>
        </FlexContainer>
      </FlexContainer>
      <SortByWrapper
        backgroundColor="rgba(65, 66, 83, 0.5)"
        padding="10px 16px"
      >
        <Toggle>
          {({ on, toggle }) => (
            <>
              <ButtonWithoutStyles onClick={toggle}>
                <PrimaryTextSpan color="rgba(255, 255, 255, 0.4)">
                  Sort by:
                </PrimaryTextSpan>
              </ButtonWithoutStyles>
              {on && (
                <DateRangePicker
                  startDate={startDate}
                  startDateId="your_unique_start_date_id"
                  endDate={endDate}
                  small
                  endDateId="your_unique_end_date_id"
                  onDatesChange={({ startDate, endDate }) => {
                    setStartDate(startDate);
                    setEndDate(endDate);
                  }}
                  focusedInput={focusedInput}
                  onFocusChange={focusedInput => {
                    setFocusedInput(focusedInput);
                  }}
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
                  renderMonthElement={({
                    month,
                    onMonthSelect,
                    onYearSelect,
                    isVisible,
                  }) => (
                    <PrimaryTextParagraph>
                      {month.format()}
                    </PrimaryTextParagraph>
                  )}
                />
              )}
            </>
          )}
        </Toggle>
      </SortByWrapper>
      <Observer>
        {() => (
          <ActivePositionsWrapper flexDirection="column">
            {quotesStore.pendingOrders.map(item => (
              <PendingOrder
                key={item.id}
                pendingOrder={item}
                currencySymbol={mainAppStore.account?.symbol || ''}
              />
            ))}
          </ActivePositionsWrapper>
        )}
      </Observer>
    </PortfolioWrapper>
  );
};

export default Orders;

const TabPortfolitButton = styled(ButtonWithoutStyles)<{ isActive?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 12px 8px;
  font-size: 12px;
  color: ${props => (props.isActive ? '#fffcbd' : 'rgba(255,255,255,0.4)')};
  text-transform: uppercase;
  background: ${props =>
    props.isActive
      ? `radial-gradient(
      50.41% 50% at 50% 0%,
      rgba(0, 255, 221, 0.08) 0%,
      rgba(0, 255, 221, 0) 100%
    ),
    rgba(255, 255, 255, 0.08)`
      : 'none'};
  box-shadow: ${props =>
    props.isActive ? 'inset 0px 1px 0px #00ffdd' : 'none'};
  border-radius: 0px 0px 4px 4px;
  transition: all 0.2s ease;

  &:hover {
    color: #fffcbd;
    background: radial-gradient(
        50.41% 50% at 50% 0%,
        rgba(0, 255, 221, 0.08) 0%,
        rgba(0, 255, 221, 0) 100%
      ),
      rgba(255, 255, 255, 0.08);
    box-shadow: inset 0px 1px 0px #00ffdd;
  }
`;

const PortfolioWrapper = styled(FlexContainer)`
  min-width: 320px;
`;

const ActivePositionsWrapper = styled(FlexContainer)`
  overflow: auto;
  max-height: calc(100vh - 236px);
`;

const SortByWrapper = styled(FlexContainer)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
`;

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
