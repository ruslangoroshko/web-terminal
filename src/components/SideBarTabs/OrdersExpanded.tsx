import React, { FC } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import {
  PrimaryTextSpan,
  PrimaryTextParagraph,
} from '../../styles/TextsElements';
import styled from '@emotion/styled';
import { useStores } from '../../hooks/useStores';
import { Observer } from 'mobx-react-lite';
import { TabPortfolitButton } from './Portfolio';
import { PortfolioTabEnum } from '../../enums/PortfolioTabEnum';
import SvgIcon from '../SvgIcon';
import IconClose from '../../assets/svg/icon-close.svg';
import IconPortfolioNoData from '../../assets/svg/icon-portfolio-no-data-expanded.svg';
import { Th, TableGrid } from '../../styles/TableElements';
import OrderExpandedItem from './OrderExpandedItem';
import { useTranslation } from 'react-i18next';

const OrdersExpanded: FC = () => {
  const { tabsStore, mainAppStore, quotesStore } = useStores();
  const closeExpanded = () => {
    tabsStore.isTabExpanded = false;
  };

  const handleChangePortfolioTab = (portfolioTab: PortfolioTabEnum) => () => {
    tabsStore.portfolioTab = portfolioTab;
  };

  const { t } = useTranslation();

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
          <FlexContainer flexDirection="column" justifyContent="center">
            <TableGrid columnsCount={7} maxHeight="calc(100vh - 180px)">
              <Th>
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  {t('Asset Name')}
                </PrimaryTextSpan>
              </Th>
              <Th>
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  {t('Open price')}
                </PrimaryTextSpan>
              </Th>
              <Th>
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  {t('Created')}
                </PrimaryTextSpan>
              </Th>
              <Th justifyContent="center">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  {t('Investment')}
                </PrimaryTextSpan>
              </Th>
              <Th justifyContent="center">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  {t('Take Profit')}
                </PrimaryTextSpan>
              </Th>
              <Th justifyContent="center">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                >
                  {t('Stop Loss')}
                </PrimaryTextSpan>
              </Th>
              <Th></Th>
              <Observer>
                {() => (
                  <>
                    {quotesStore.sortedPendingOrders.map(item => (
                      <OrderExpandedItem
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
            {!quotesStore.sortedPendingOrders.length && (
              <FlexContainer
                flexDirection="column"
                alignItems="center"
                padding="160px 0 0 0"
              >
                <FlexContainer margin="0 0 30px 0">
                  <SvgIcon
                    {...IconPortfolioNoData}
                    fillColor="rgba(255,255,255,0.4)"
                  />
                </FlexContainer>
                <PrimaryTextParagraph
                  fontSize="16px"
                  color="rgba(255,255,255, 0.4)"
                >
                  {t("You haven't made any order yet")}
                </PrimaryTextParagraph>
              </FlexContainer>
            )}
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </PortfolioWrapper>
  );
};

export default OrdersExpanded;

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


const ButtonClose = styled(ButtonWithoutStyles)`
  position: absolute;
  top: 12px;
  right: 12px;
`;
