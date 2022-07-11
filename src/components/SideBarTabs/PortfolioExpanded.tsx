import React, { FC, useMemo } from 'react';
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
import { useTranslation } from 'react-i18next';
import PortfolioTotalProfit from './PortfolioTotalProfit';
import PortfolioTotalEquity from './PortfolioTotalEquity';
import { LOCAL_PORTFOLIO_TABS } from '../../constants/global';
import { moneyFormatPart } from '../../helpers/moneyFormat';
import Colors from '../../constants/Colors';

interface Props {}

const PortfolioExpanded: FC<Props> = () => {
  const { tabsStore, mainAppStore, quotesStore, markersOnChartStore } = useStores();
  const closeExpanded = () => {
    tabsStore.setTabExpanded(false);
  };

  const handleChangePortfolioTab = (portfolioTab: PortfolioTabEnum) => () => {
    markersOnChartStore.renderActivePositionsMarkersOnChart();
    localStorage.setItem(LOCAL_PORTFOLIO_TABS, `${portfolioTab}`);
    tabsStore.setPortfolioTab(portfolioTab);
  };

  const { t } = useTranslation();

  const profit = useMemo(() => quotesStore.profit, [quotesStore.profit]);

  return (
    <PortfolioWrapper flexDirection="column" width="100%" position="relative">
      <ButtonClose onClick={closeExpanded}>
        <SvgIcon
          {...IconClose}
          fillColor={Colors.WHITE_DARK}
          hoverFillColor={Colors.PRIMARY}
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
                  color={Colors.WHITE_LIGHT}
                  fontSize="10px"
                  marginBottom="8px"
                  textTransform="uppercase"
                >
                  {t('Total Profit')}
                </PrimaryTextParagraph>
                <PortfolioTotalProfit></PortfolioTotalProfit>
              </FlexContainer>
              <FlexContainer
                flexDirection="column"
                width="140px"
                margin="0 60px 0 0"
              >
                <PrimaryTextParagraph
                  color={Colors.WHITE_LIGHT}
                  fontSize="10px"
                  marginBottom="14px"
                  textTransform="uppercase"
                >
                  {t('Total Investments')}
                </PrimaryTextParagraph>
                <Observer>
                  {() => (
                    <PrimaryTextSpan
                      fontSize="14px"
                      lineHeight="16px"
                      fontWeight="bold"
                      color={Colors.ACCENT}
                    >
                      {mainAppStore.activeAccount?.symbol}
                      {moneyFormatPart(quotesStore.invest).int}
                      <PrimaryTextSpan
                        fontSize="10px"
                        lineHeight="16px"
                        fontWeight="bold"
                        color={Colors.ACCENT}
                      >
                        .{moneyFormatPart(quotesStore.invest).decimal}
                      </PrimaryTextSpan>
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
                  color={Colors.WHITE_LIGHT}
                  fontSize="10px"
                  marginBottom="14px"
                  textTransform="uppercase"
                >
                  {t('Total Equity')}
                </PrimaryTextParagraph>
                <PortfolioTotalEquity />
              </FlexContainer>
            </FlexContainer>
          </FlexContainer>
          <FlexContainer flexDirection="column" justifyContent="center">
            <TableGrid columnsCount={9} maxHeight="calc(100vh - 235px)">
              <Th>
                <HeaderTitleItem
                  color={Colors.WHITE_LIGHT}
                  fontSize="10px"
                  textTransform="uppercase"
                >
                  {t('Asset Name')}
                </HeaderTitleItem>
              </Th>
              <Th>
                <HeaderTitleItem
                  color={Colors.WHITE_LIGHT}
                  fontSize="10px"
                  textTransform="uppercase"
                >
                  {t('Open price')}
                </HeaderTitleItem>
              </Th>
              <Th>
                <HeaderTitleItem
                  color={Colors.WHITE_LIGHT}
                  fontSize="10px"
                  textTransform="uppercase"
                >
                  {t('Time Opened')}
                </HeaderTitleItem>
              </Th>
              <Th justifyContent="flex-end">
                <HeaderTitleItem
                  color={Colors.WHITE_LIGHT}
                  fontSize="10px"
                  textTransform="uppercase"
                >
                  {t('Investment')}
                </HeaderTitleItem>
              </Th>
              <Th justifyContent="flex-end">
                <HeaderTitleItem
                  color={Colors.WHITE_LIGHT}
                  fontSize="10px"
                  textTransform="uppercase"
                  textAlign="center"
                >
                  {t('Profit/loss')}
                </HeaderTitleItem>
              </Th>
              <Th justifyContent="center">
                <HeaderTitleItem
                  color={Colors.WHITE_LIGHT}
                  fontSize="10px"
                  textTransform="uppercase"
                >
                  {t('Equity')}
                </HeaderTitleItem>
              </Th>
              <Th justifyContent="center">
                <HeaderTitleItem
                  color={Colors.WHITE_LIGHT}
                  fontSize="10px"
                  textTransform="uppercase"
                  textAlign="center"
                >
                  {t('Take Profit')}
                </HeaderTitleItem>
              </Th>
              <Th justifyContent="center">
                <HeaderTitleItem
                  color={Colors.WHITE_LIGHT}
                  fontSize="10px"
                  textTransform="uppercase"
                  textAlign="center"
                >
                  {t('Stop Loss')}
                </HeaderTitleItem>
              </Th>
              <Th></Th>
              <Observer>
                {() => (
                  <>
                    {quotesStore.sortedActivePositions.map((item) => (
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
            {!quotesStore.sortedActivePositions.length && (
              <FlexContainer
                flexDirection="column"
                alignItems="center"
                padding="160px 0 0 0"
              >
                <FlexContainer margin="0 0 30px 0">
                  <SvgIcon
                    {...IconPortfolioNoDataExpanded}
                    fillColor={Colors.WHITE_LIGHT}
                  />
                </FlexContainer>
                <PrimaryTextParagraph
                  fontSize="16px"
                  color={Colors.WHITE_LIGHT}
                >
                  {t("You haven't opened any positions yet")}
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

const HeaderTitleItem = styled(PrimaryTextSpan)`
  word-break: break-word;
`;

const PortfolioWrapper = styled(FlexContainer)`
  background: radial-gradient(
      92.11% 100% at 0% 0%,
      rgba(255, 252, 204, 0.08) 0%,
      rgba(255, 252, 204, 0) 100%
    ),
    ${Colors.DARK_BLACK};
  box-shadow: inset 0px 1px 0px rgba(255, 255, 255, 0.08);
  border-radius: 8px 0px 0px 0px;
`;

const ButtonClose = styled(ButtonWithoutStyles)`
  position: absolute;
  top: 12px;
  right: 12px;
`;
