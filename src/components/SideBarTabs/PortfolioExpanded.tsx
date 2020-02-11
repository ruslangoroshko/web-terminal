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
import SvgIcon from '../SvgIcon';
import IconClose from '../../assets/svg/icon-close.svg';
import IconPortfolioNoDataExpanded from '../../assets/svg/icon-portfolio-no-data-expanded.svg';
import { Th, TableGrid } from '../../styles/TableElements';

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
    <PortfolioWrapper flexDirection="column" width="100%" position="relative">
      <ButtonClose onClick={closeExpanded}>
        <SvgIcon
          {...IconClose}
          fillColor="rgba(255, 255, 255, 0.6)"
          hoverFillColor="#00FFDD"
        />
      </ButtonClose>
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
      <FlexContainer width="100%" justifyContent="center">
        <FlexContainer flexDirection="column" width="1020px">
          <FlexContainer
            justifyContent="space-between"
            alignItems="flex-end"
            padding="0 32px 0 12px"
            margin="0 0 32px 0"
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
                      {mainAppStore.activeAccount?.symbol}
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
                      {mainAppStore.activeAccount?.symbol}
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
                      {getNumberSign(quotesStore.totalEquity)}
                      {mainAppStore.activeAccount?.symbol}
                      {Math.abs(quotesStore.totalEquity).toFixed(2)}
                    </PrimaryTextSpan>
                  )}
                </Observer>
              </FlexContainer>
            </FlexContainer>
            {/* <ButtonCloseAll>
              <PrimaryTextSpan color="#fff" fontSize="12px">
                Close All
              </PrimaryTextSpan>
            </ButtonCloseAll> */}
          </FlexContainer>
          <FlexContainer flexDirection="column" justifyContent="center">
            <TableGrid columnsCount={9}>
              <Th>
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  Asset Name
                </PrimaryTextSpan>
              </Th>
              <Th>
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  Open price
                </PrimaryTextSpan>
              </Th>
              <Th>
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  Time Opened
                </PrimaryTextSpan>
              </Th>
              <Th justifyContent="flex-end">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  Investment
                </PrimaryTextSpan>
              </Th>
              <Th justifyContent="flex-end">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  Profit/loss
                </PrimaryTextSpan>
              </Th>
              <Th justifyContent="flex-end">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  Equity
                </PrimaryTextSpan>
              </Th>
              <Th justifyContent="center">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  Take Profit
                </PrimaryTextSpan>
              </Th>
              <Th justifyContent="center">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  Stop Loss
                </PrimaryTextSpan>
              </Th>
              <Th></Th>
              <Observer>
                {() => (
                  <>
                    {quotesStore.activePositions.map(item => (
                      <ActivePositionExpanded
                        key={item.id}
                        currencySymbol={
                          mainAppStore.activeAccount?.symbol || ''
                        }
                        position={item}
                      />
                    ))}
                  </>
                )}
              </Observer>
            </TableGrid>
            {!quotesStore.activePositions.length && (
              <FlexContainer
                flexDirection="column"
                alignItems="center"
                padding="160px 0 0 0"
              >
                <FlexContainer margin="0 0 30px 0">
                  <SvgIcon
                    {...IconPortfolioNoDataExpanded}
                    fillColor="rgba(255,255,255,0.4)"
                  />
                </FlexContainer>
                <PrimaryTextParagraph
                  fontSize="16px"
                  color="rgba(255,255,255, 0.4)"
                >
                  You haven't opened any positions yet
                </PrimaryTextParagraph>
              </FlexContainer>
            )}
          </FlexContainer>
        </FlexContainer>
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

const ButtonClose = styled(ButtonWithoutStyles)`
  position: absolute;
  top: 12px;
  right: 12px;
`;
