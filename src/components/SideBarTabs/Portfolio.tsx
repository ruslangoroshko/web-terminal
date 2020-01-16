import React, { FC } from 'react';
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
import Scrollbar from 'react-scrollbars-custom';

interface Props {}

const Portfolio: FC<Props> = () => {
  const { quotesStore, mainAppStore, tabsStore } = useStores();

  const handleChangePortfolioTab = (portfolioTab: PortfolioTabEnum) => () => {
    tabsStore.portfolioTab = portfolioTab;
  };

  return (
    <PortfolioWrapper padding="12px 4px" flexDirection="column">
      <FlexContainer flexDirection="column" padding="0 12px">
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
        <FlexContainer flexDirection="column">
          <PrimaryTextParagraph
            color="rgba(255, 255, 255, 0.4)"
            textTransform="uppercase"
            fontSize="10px"
            marginBottom="6px"
          >
            Total Profit
          </PrimaryTextParagraph>
          <Observer>
            {() => (
              <QuoteText
                isGrowth={quotesStore.profit >= 0}
                fontSize="24px"
                lineHeight="28px"
                fontWeight="bold"
                marginBottom="20px"
              >
                {getNumberSign(quotesStore.profit)}
                {mainAppStore.account?.symbol}
                {Math.abs(quotesStore.profit).toFixed(2)}
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
                Total Investments
              </PrimaryTextParagraph>
              <Observer>
                {() => (
                  <PrimaryTextSpan
                    fontSize="14px"
                    lineHeight="16px"
                    fontWeight="bold"
                  >
                    {mainAppStore.account?.symbol}
                    {quotesStore.invest}
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
                Total Equity
              </PrimaryTextParagraph>
              <Observer>
                {() => (
                  <PrimaryTextSpan
                    fontSize="14px"
                    lineHeight="16px"
                    fontWeight="bold"
                  >
                    {mainAppStore.account?.symbol}
                    {quotesStore.totalEquity.toFixed(2)}
                  </PrimaryTextSpan>
                )}
              </Observer>
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
      <Scrollbar noScrollX fallbackScrollbarWidth={4}>
        <Observer>
          {() => (
            <ActivePositionsWrapper
              flexDirection="column"
              padding="0 8px 0 12px"
            >
              {quotesStore.activePositions.map(item => (
                <ActivePositionsPortfolioTab key={item.id} position={item} />
              ))}
            </ActivePositionsWrapper>
          )}
        </Observer>
      </Scrollbar>
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
  position: relative;
`;
