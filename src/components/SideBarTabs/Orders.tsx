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
import SortByDropdown from '../SortByDropdown';
import SvgIcon from '../SvgIcon';
import IconPortfolioNoDataExpanded from '../../assets/svg/icon-portfolio-no-data-expanded.svg';
import { sortByPendingOrdersLabels } from '../../constants/sortByDropdownValues';
import { SortByPendingOrdersEnum } from '../../enums/SortByPendingOrdersEnum';

const Orders: FC = () => {
  const { sortingStore, tabsStore, mainAppStore, quotesStore } = useStores();

  const handleChangePortfolioTab = (portfolioTab: PortfolioTabEnum) => () => {
    tabsStore.portfolioTab = portfolioTab;
  };

  const [on, toggle] = useState(false);

  const handleToggle = (flag: boolean) => {
    toggle(flag);
  };

  const handleChangeSorting = (sortType: SortByPendingOrdersEnum) => () => {
    sortingStore.pendingOrdersSortBy = sortType;
    toggle(false);
  };

  return (
    <PortfolioWrapper flexDirection="column">
      <FlexContainer flexDirection="column" padding="0 8px">
        <FlexContainer margin="0 0 8px">
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
        <PrimaryTextSpan
          color="rgba(255, 255, 255, 0.4)"
          marginRight="4px"
          fontSize="10px"
          textTransform="uppercase"
        >
          Sort by:
        </PrimaryTextSpan>
        <SortByDropdown
          opened={on}
          selectedLabel={
            sortByPendingOrdersLabels[sortingStore.pendingOrdersSortBy]
          }
          toggle={handleToggle}
        >
          {Object.entries(sortByPendingOrdersLabels).map(([key, value]) => (
            <DropdownItemText
              color="#fffccc"
              fontSize="12px"
              key={key}
              onClick={handleChangeSorting(+key)}
              whiteSpace="nowrap"
            >
              {value}
            </DropdownItemText>
          ))}
        </SortByDropdown>
      </SortByWrapper>
      <Observer>
        {() => (
          <ActivePositionsWrapper flexDirection="column">
            {quotesStore.sortedPendingOrders.map(item => (
              <PendingOrder
                key={item.id}
                pendingOrder={item}
                currencySymbol={mainAppStore.activeAccount?.symbol || ''}
              />
            ))}

            {!quotesStore.sortedPendingOrders.length && (
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
                  You haven't made any order yet
                </PrimaryTextParagraph>
              </FlexContainer>
            )}
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
  overflow: auto;
  max-height: calc(100vh - 126px);
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
