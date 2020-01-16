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
import { Observer } from 'mobx-react-lite';
import { TabPortfolitButton } from './Portfolio';
import { PortfolioTabEnum } from '../../enums/PortfolioTabEnum';
import { getNumberSign } from '../../helpers/getNumberSign';
import ActivePositionExpanded from './ActivePositionExpanded';

interface Props {}

const PortfolioExpanded: FC<Props> = props => {
  const {} = props;
  const { tabsStore, mainAppStore, quotesStore } = useStores();
  const closeExpanded = () => {
    tabsStore.isTabExpanded = false;
  };

  const handleChangePortfolioTab = (portfolioTab: PortfolioTabEnum) => () => {
    tabsStore.portfolioTab = portfolioTab;
  };

  return (
    <PortfolioWrapper flexDirection="column" width="100%">
      <FlexContainer margin="0 0 40px 0" padding="0 0 0 8px">
        <Observer>
          {() => (
            <>
              <TabPortfolitButton
                isActive={tabsStore.portfolioTab === PortfolioTabEnum.Portfolio}
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
      <FlexContainer padding="0 100px" flexDirection="column">
        <FlexContainer
          justifyContent="space-between"
          alignItems="flex-end"
          padding="0 32px 0 12px"
        >
          <FlexContainer>
            <FlexContainer
              flexDirection="column"
              width="140px"
              margin="0 60px 0 0"
            >
              <PrimaryTextParagraph
                color="rgba(255, 255, 255, 0.4)"
                fontSize="10px"
                marginBottom="8px"
                textTransform="uppercase"
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
                  >
                    {getNumberSign(quotesStore.profit)}
                    {mainAppStore.account?.symbol}
                    {Math.abs(quotesStore.profit).toFixed(2)}
                  </QuoteText>
                )}
              </Observer>
            </FlexContainer>
            <FlexContainer
              flexDirection="column"
              width="140px"
              margin="0 60px 0 0"
            >
              <PrimaryTextParagraph
                color="rgba(255, 255, 255, 0.4)"
                fontSize="10px"
                marginBottom="14px"
                textTransform="uppercase"
              >
                Total Investments
              </PrimaryTextParagraph>
              <Observer>
                {() => (
                  <PrimaryTextSpan
                    fontSize="14px"
                    lineHeight="16px"
                    fontWeight="bold"
                    color="#fffccc"
                  >
                    {mainAppStore.account?.symbol}
                    {quotesStore.invest}
                  </PrimaryTextSpan>
                )}
              </Observer>
            </FlexContainer>
            <FlexContainer
              flexDirection="column"
              width="140px"
              margin="0 60px 0 0"
            >
              <PrimaryTextParagraph
                color="rgba(255, 255, 255, 0.4)"
                fontSize="10px"
                marginBottom="14px"
                textTransform="uppercase"
              >
                Total Equity
              </PrimaryTextParagraph>
              <Observer>
                {() => (
                  <PrimaryTextSpan
                    fontSize="14px"
                    lineHeight="16px"
                    fontWeight="bold"
                    color="#fffccc"
                  >
                    {mainAppStore.account?.symbol}
                    {quotesStore.totalEquity.toFixed(2)}
                  </PrimaryTextSpan>
                )}
              </Observer>
            </FlexContainer>
          </FlexContainer>
          <ButtonCloseAll>
            <PrimaryTextSpan color="#fff" fontSize="12px">
              Close All
            </PrimaryTextSpan>
          </ButtonCloseAll>
        </FlexContainer>
      </FlexContainer>
      <FlexContainer padding="0 100px" alignItems="center">
        <Table>
          <tbody>
            {quotesStore.activePositions.map(item => (
              <ActivePositionExpanded
                key={item.id}
                currencySymbol={mainAppStore.account?.symbol || ''}
                position={item}
              />
            ))}
          </tbody>
        </Table>
      </FlexContainer>
    </PortfolioWrapper>
  );
};

export default PortfolioExpanded;

const PortfolioWrapper = styled(FlexContainer)`
  background: radial-gradient(
      92.11% 100% at 0% 0%,
      rgba(255, 252, 204, 0.08) 0%,
      rgba(255, 252, 204, 0) 100%
    ),
    #252636;
  box-shadow: inset 0px 1px 0px rgba(255, 255, 255, 0.08);
  border-radius: 8px 0px 0px 0px;
`;

const ButtonCloseAll = styled(ButtonWithoutStyles)`
  padding: 8px 16px;
  width: 80px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
`;

const Table = styled.table`
  table-layout: fixed;
  width: 100%;
`;
