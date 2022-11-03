import React, { FC, useState, useEffect } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import {
  PrimaryTextSpan,
  PrimaryTextParagraph,
} from '../../styles/TextsElements';
import styled from '@emotion/styled';
import { useStores } from '../../hooks/useStores';

import { Observer } from 'mobx-react-lite';
import { PortfolioTabEnum } from '../../enums/PortfolioTabEnum';
import SortByDropdown from '../SortByDropdown';

import { sortByDropdownProfitLabels } from '../../constants/sortByDropdownValues';
import { SortByProfitEnum } from '../../enums/SortByProfitEnum';
import { useTranslation } from 'react-i18next';
import PortfolioTotalProfit from './PortfolioTotalProfit';
import PortfolioTotalEquity from './PortfolioTotalEquity';
import {
  LOCAL_PORTFOLIO_TABS,
  LOCAL_POSITION_SORT,
} from '../../constants/global';
import { moneyFormatPart } from '../../helpers/moneyFormat';
import Colors from '../../constants/Colors';
import PortfolioInstrumentList from './Portfolio/PortfolioInstrumentList';

interface Props {}

const Portfolio: FC<Props> = () => {
  const {
    sortingStore,
    mainAppStore,
    tabsStore,
    quotesStore,
    tradingViewStore,
    markersOnChartStore,
  } = useStores();

  const handleChangePortfolioTab = (portfolioTab: PortfolioTabEnum) => () => {
    markersOnChartStore.renderActivePositionsMarkersOnChart();
    localStorage.setItem(LOCAL_PORTFOLIO_TABS, `${portfolioTab}`);
    tabsStore.setPortfolioTab(portfolioTab);
  };

  const [on, toggle] = useState(false);

  const handleToggle = (flag: boolean) => {
    toggle(flag);
  };

  const handleChangeSorting = (sortType: SortByProfitEnum) => () => {
    sortingStore.setActivePositionsSortBy(sortType);
    localStorage.setItem(LOCAL_POSITION_SORT, `${sortType}`);
    toggle(false);
  };

  const { t } = useTranslation();

  useEffect(() => {
    const activeTab = localStorage.getItem(LOCAL_PORTFOLIO_TABS);
    const activeSort = localStorage.getItem(LOCAL_POSITION_SORT);
    if (!!activeTab) {
      tabsStore.setPortfolioTab(parseFloat(activeTab));
    }
    if (!!activeSort) {
      sortingStore.setActivePositionsSortBy(parseFloat(activeSort));
    }
  }, []);

  return (
    <PortfolioWrapper flexDirection="column" height="100%">
      <FlexContainer flexDirection="column" padding="0 8px">
        <FlexContainer margin="0 0 16px">
          <Observer>
            {() => (
              <>
                <TabPortfolitButton
                  isActive={
                    tabsStore.portfolioTab === PortfolioTabEnum.Portfolio
                  }
                  onClick={handleChangePortfolioTab(PortfolioTabEnum.Portfolio)}
                >
                  {t('Portfolio')}
                </TabPortfolitButton>
                <TabPortfolitButton
                  isActive={tabsStore.portfolioTab === PortfolioTabEnum.Orders}
                  onClick={handleChangePortfolioTab(PortfolioTabEnum.Orders)}
                >
                  {t('Orders')}
                </TabPortfolitButton>
              </>
            )}
          </Observer>
        </FlexContainer>
        <FlexContainer flexDirection="column" padding="0 8px">
          <PrimaryTextParagraph
            color="rgba(255, 255, 255, 0.4)"
            textTransform="uppercase"
            fontSize="10px"
            marginBottom="6px"
          >
            {t('Total Profit')}
          </PrimaryTextParagraph>
          <PortfolioTotalProfit />
          <FlexContainer>
            <FlexContainer flexDirection="column" margin="0 38px 20px 0">
              <PrimaryTextParagraph
                color="rgba(255, 255, 255, 0.4)"
                textTransform="uppercase"
                fontSize="10px"
                marginBottom="6px"
              >
                {t('Total Investments')}
              </PrimaryTextParagraph>
              <Observer>
                {() => (
                  <PrimaryTextSpan
                    fontSize="14px"
                    lineHeight="16px"
                    fontWeight="bold"
                  >
                    {mainAppStore.activeAccount?.symbol}
                    {moneyFormatPart(quotesStore.invest).int}
                    <PrimaryTextSpan
                      fontSize="10px"
                      lineHeight="16px"
                      fontWeight="bold"
                    >
                      .{moneyFormatPart(quotesStore.invest).decimal}
                    </PrimaryTextSpan>
                  </PrimaryTextSpan>
                )}
              </Observer>
            </FlexContainer>
            <FlexContainer flexDirection="column">
              <PrimaryTextParagraph
                color="rgba(255, 255, 255, 0.4)"
                textTransform="uppercase"
                fontSize="10px"
                marginBottom="6px"
              >
                {t('Total Equity')}
              </PrimaryTextParagraph>
              <PortfolioTotalEquity />
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
      <SortByWrapper
        backgroundColor="rgba(65, 66, 83, 0.5)"
        padding="10px 16px"
      >
        <PrimaryTextSpan
          color={Colors.WHITE_LIGHT}
          marginRight="4px"
          fontSize="10px"
          textTransform="uppercase"
        >
          {t('Sort by')}:
        </PrimaryTextSpan>
        <Observer>
          {() => (
            <SortByDropdown
              selectedLabel={t(
                sortByDropdownProfitLabels[sortingStore.activePositionsSortBy] 
              )}
              opened={on}
              toggle={handleToggle}
            >
              {Object.entries(sortByDropdownProfitLabels).map(
                ([key, value]) => (
                  <DropdownItemText
                    color={Colors.ACCENT}
                    fontSize="12px"
                    key={key}
                    onClick={handleChangeSorting(+key)}
                    whiteSpace="nowrap"
                  >
                    {t(value)}
                  </DropdownItemText>
                )
              )}
            </SortByDropdown>
          )}
        </Observer>
      </SortByWrapper>
      
      <PortfolioInstrumentList />
    </PortfolioWrapper>
  );
};

export default Portfolio;

export const TabPortfolitButton = styled(ButtonWithoutStyles)<{
  isActive?: boolean;
}>`
  display: flex;
  flex-direction: column;
  padding: 12px 8px;
  font-size: 12px;
  color: ${(props) => (props.isActive ? Colors.ACCENT : Colors.WHITE_LIGHT)};
  text-transform: uppercase;
  background: ${(props) =>
    props.isActive
      ? `radial-gradient(
      50.41% 50% at 50% 0%,
      rgba(0, 255, 221, 0.08) 0%,
      rgba(0, 255, 221, 0) 100%
    ),
    rgba(255, 255, 255, 0.08)`
      : 'none'};
  box-shadow: ${(props) =>
    props.isActive ? `inset 0px 1px 0px ${Colors.PRIMARY}` : 'none'};
  border-radius: 0px 0px 4px 4px;
  transition: all 0.2s ease;
  will-change: background;

  &:hover {
    color: ${Colors.ACCENT};
    background: radial-gradient(
        50.41% 50% at 50% 0%,
        rgba(0, 255, 221, 0.08) 0%,
        rgba(0, 255, 221, 0) 100%
      ),
      rgba(255, 255, 255, 0.08);
    box-shadow: inset 0px 1px 0px ${Colors.PRIMARY};
  }
`;

const PortfolioWrapper = styled(FlexContainer)`
  min-width: 320px;
`;

const SortByWrapper = styled(FlexContainer)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
`;

const DropdownItemText = styled(PrimaryTextSpan)`
  transition: color 0.2s ease;
  will-change: color;
  margin-bottom: 16px;

  &:hover {
    cursor: pointer;
    color: ${Colors.PRIMARY};
  }

  &:last-of-type {
    margin-bottom: 0;
  }
`;
