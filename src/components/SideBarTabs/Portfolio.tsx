import React, { FC, useState, useCallback } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import {
  PrimaryTextSpan,
  PrimaryTextParagraph,
  QuoteText,
} from '../../styles/TextsElements';
import styled from '@emotion/styled';
import { useStores } from '../../hooks/useStores';
import ActivePositionsPortfolioTab from './ActivePositions';
import { getNumberSign } from '../../helpers/getNumberSign';
import { Observer } from 'mobx-react-lite';
import { PortfolioTabEnum } from '../../enums/PortfolioTabEnum';
import SortByDropdown from '../SortByDropdown';
import IconPortfolioNoDataExpanded from '../../assets/svg/icon-portfolio-no-data-expanded.svg';
import SvgIcon from '../SvgIcon';
import { sortByDropdownProfitLabels } from '../../constants/sortByDropdownValues';
import { SortByProfitEnum } from '../../enums/SortByProfitEnum';
import { useTranslation } from 'react-i18next';

interface Props {}

const Portfolio: FC<Props> = () => {
  const { sortingStore, mainAppStore, tabsStore, quotesStore } = useStores();

  const handleChangePortfolioTab = (portfolioTab: PortfolioTabEnum) => () => {
    tabsStore.portfolioTab = portfolioTab;
  };

  const [on, toggle] = useState(false);

  const handleToggle = (flag: boolean) => {
    toggle(flag);
  };

  const handleChangeSorting = (sortType: SortByProfitEnum) => () => {
    sortingStore.activePositionsSortBy = sortType;
    toggle(false);
  };

  const profit = useCallback(() => quotesStore.profit, [quotesStore.profit]);

  const { t } = useTranslation();

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
          <Observer>
            {() => (
              <QuoteText
                isGrowth={profit() >= 0}
                fontSize="24px"
                lineHeight="28px"
                fontWeight="bold"
                marginBottom="20px"
              >
                {getNumberSign(profit())}
                {mainAppStore.activeAccount?.symbol}
                {Math.abs(profit()).toFixed(2)}
              </QuoteText>
            )}
          </Observer>
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
                    {quotesStore.invest.toFixed(2)}
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
              <Observer>
                {() => (
                  <PrimaryTextSpan
                    fontSize="14px"
                    lineHeight="16px"
                    fontWeight="bold"
                  >
                    {mainAppStore.activeAccount?.symbol}
                    {Math.abs(quotesStore.totalEquity).toFixed(2)}
                  </PrimaryTextSpan>
                )}
              </Observer>
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
      <SortByWrapper
        backgroundColor="rgba(65, 66, 83, 0.5)"
        padding="10px 16px"
      >
        <PrimaryTextSpan
          color="rgba(255, 255, 255, 0.4)"
          marginRight="4px"
          fontSize="10px"
          textTransform="uppercase"
        >
          {t('Sort by')}:
        </PrimaryTextSpan>
        <SortByDropdown
          selectedLabel={t(
            sortByDropdownProfitLabels[sortingStore.activePositionsSortBy]
          )}
          opened={on}
          toggle={handleToggle}
        >
          {Object.entries(sortByDropdownProfitLabels).map(([key, value]) => (
            <DropdownItemText
              color="#fffccc"
              fontSize="12px"
              key={key}
              onClick={handleChangeSorting(+key)}
              whiteSpace="nowrap"
            >
              {t(value)}
            </DropdownItemText>
          ))}
        </SortByDropdown>
      </SortByWrapper>
      <Observer>
        {() => (
          <ActivePositionsWrapper flexDirection="column">
            {quotesStore.sortedActivePositions.map(item => (
              <ActivePositionsPortfolioTab key={item.id} position={item} />
            ))}
            {!quotesStore.sortedActivePositions.length && (
              <FlexContainer
                flexDirection="column"
                alignItems="center"
                padding="30px 0 0 0"
              >
                <FlexContainer margin="0 0 18px 0">
                  <SvgIcon
                    {...IconPortfolioNoDataExpanded}
                    fillColor="rgba(255,255,255,0.4)"
                    width={40}
                    height={32}
                  />
                </FlexContainer>
                <PrimaryTextParagraph
                  fontSize="14px"
                  color="rgba(255,255,255, 0.4)"
                >
                  {t("You haven't opened any positions yet")}
                </PrimaryTextParagraph>
              </FlexContainer>
            )}
          </ActivePositionsWrapper>
        )}
      </Observer>
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
  will-change: background;

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
  overflow-y: auto;
  height: 100%;
  max-height: calc(100% - 205px);

  ::-webkit-scrollbar {
    width: 4px;
    border-radius: 2px;
  }

  ::-webkit-scrollbar-track-piece {
    background-color: transparent;
  }
  ::-webkit-scrollbar-thumb:vertical {
    background-color: rgba(0, 0, 0, 0.6);
  }
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
    color: #00ffdd;
  }

  &:last-of-type {
    margin-bottom: 0;
  }
`;
