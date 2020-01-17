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
        <SvgIcon {...IconClose} fillColor="rgba(255, 255, 255, 0.6)" />
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
          <FlexContainer flexDirection="column">
            <TableGrid>
              <Td>
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  Asset Name
                </PrimaryTextSpan>
              </Td>
              <Td>
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  Time Opened
                </PrimaryTextSpan>
              </Td>
              <Td justifyContent="flex-end">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  Investment
                </PrimaryTextSpan>
              </Td>
              <Td justifyContent="flex-end">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  Profit/loss
                </PrimaryTextSpan>
              </Td>
              <Td justifyContent="flex-end">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  Equity
                </PrimaryTextSpan>
              </Td>
              <Td justifyContent="center">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  Take Profit
                </PrimaryTextSpan>
              </Td>
              <Td justifyContent="center">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  Stop Loss
                </PrimaryTextSpan>
              </Td>
              <Td></Td>
              {quotesStore.activePositions.map(item => (
                <ActivePositionExpanded
                  key={item.id}
                  currencySymbol={mainAppStore.account?.symbol || ''}
                  position={item}
                />
              ))}
            </TableGrid>
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

const Td = styled(FlexContainer)`
  margin-bottom: 4px;
`;

const TableGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(300px, 1fr) repeat(7, minmax(100px, 1fr));
`;
