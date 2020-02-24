import React, { FC, useRef } from 'react';
import { observer, Observer } from 'mobx-react-lite';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan, QuoteText } from '../../styles/TextsElements';
import { AskBidEnum } from '../../enums/AskBid';
import SvgIcon from '../SvgIcon';
import IconShevronDown from '../../assets/svg/icon-shevron-logo-down.svg';
import IconShevronUp from '../../assets/svg/icon-shevron-logo-up.svg';
import test from '../../assets/images/test2.png';
import { useStores } from '../../hooks/useStores';
import calculateFloatingProfitAndLoss from '../../helpers/calculateFloatingProfitAndLoss';
import API from '../../helpers/API';
import { PositionModelWSDTO, UpdateSLTP } from '../../types/Positions';
import { getProcessId } from '../../helpers/getProcessId';
import moment from 'moment';
import InformationPopup from '../InformationPopup';
import Fields from '../../constants/fields';
import { AutoCloseTypesEnum } from '../../enums/AutoCloseTypesEnum';
import AutoClosePopupSideBar from './AutoClosePopupSideBar';
import { getNumberSign } from '../../helpers/getNumberSign';
import { calculateInPercent } from '../../helpers/calculateInPercent';
import ClosePositionPopup from './ClosePositionPopup';

interface Props {
  position: PositionModelWSDTO;
}

const ActivePositionsPortfolioTab: FC<Props> = observer(props => {
  const {
    position: {
      instrument,
      investmentAmount,
      multiplier,
      openDate,
      openPrice,
      operation,
      commission,
      swap,
      id,
      stopLossInCurrency,
      stopLossRate,
      takeProfitInCurrency,
      takeProfitRate,
    },
  } = props;

  const isBuy = operation === AskBidEnum.Buy;

  const instrumentRef = useRef<HTMLDivElement>(null);
  const clickableWrapper = useRef<HTMLDivElement>(null);
  const tooltipWrapperRef = useRef<HTMLDivElement>(null);

  const Icon = isBuy ? IconShevronUp : IconShevronDown;

  const {
    quotesStore,
    mainAppStore,
    SLTPStore,
    instrumentsStore,
  } = useStores();

  const PnL = calculateFloatingProfitAndLoss({
    investment: investmentAmount,
    leverage: multiplier,
    costs: swap + commission,
    side: isBuy ? 1 : -1,
    currentPrice: isBuy
      ? quotesStore.quotes[instrument].bid.c
      : quotesStore.quotes[instrument].ask.c,
    openPrice: openPrice,
  });

  const closePosition = () => {
    API.closePosition({
      accountId: mainAppStore.activeAccount!.id,
      positionId: id,
      processId: getProcessId(),
    });
  };

  const updateSLTP = () => {
    let fieldForTakeProfit = Fields.TAKE_PROFIT;
    let fieldForStopLoss = Fields.STOP_LOSS;

    switch (SLTPStore.autoCloseTPType) {
      case AutoCloseTypesEnum.Profit:
        fieldForTakeProfit = Fields.TAKE_PROFIT;

        break;
      case AutoCloseTypesEnum.Percent:
        fieldForTakeProfit = Fields.TAKE_PROFIT_RATE;

        break;
      case AutoCloseTypesEnum.Price:
        fieldForTakeProfit = Fields.TAKE_PROFIT_PRICE;

        break;
      default:
        break;
    }

    switch (SLTPStore.autoCloseSLType) {
      case AutoCloseTypesEnum.Profit:
        fieldForStopLoss = Fields.STOP_LOSS;

        break;
      case AutoCloseTypesEnum.Percent:
        fieldForStopLoss = Fields.STOP_LOSS_RATE;

        break;
      case AutoCloseTypesEnum.Price:
        fieldForStopLoss = Fields.STOP_LOSS_PRICE;

        break;
      default:
        break;
    }
    const values: UpdateSLTP = {
      accountId: mainAppStore.activeAccount!.id,
      positionId: id,
      processId: getProcessId(),
      [fieldForTakeProfit]: SLTPStore.takeProfitValue,
      [fieldForStopLoss]: SLTPStore.stopLossValue,
    };

    API.updateSLTP(values);
  };

  const setInstrumentActive = (e: any) => {
    if (
      (clickableWrapper.current &&
        clickableWrapper.current.contains(e.target)) ||
      (tooltipWrapperRef.current &&
        tooltipWrapperRef.current.contains(e.target))
    ) {
      e.preventDefault();
    } else {
      instrumentsStore.swiitchInstrument(instrument);
    }
  };

  return (
    <InstrumentInfoWrapper
      padding="8px 8px 0 12px"
      ref={instrumentRef}
      flexDirection="column"
      onClick={setInstrumentActive}
    >
      <InstrumentInfoWrapperForBorder
        justifyContent="space-between"
        padding="0 0 8px 0"
      >
        <FlexContainer width="32px" alignItems="flex-start">
          <img src={test} style={{ display: 'block', objectFit: 'contain' }} />
        </FlexContainer>
        <FlexContainer flexDirection="column" margin="0 6px 0 0">
          <PrimaryTextSpan fontSize="12px" lineHeight="14px" marginBottom="2px">
            {instrument}
          </PrimaryTextSpan>
          <FlexContainer margin="0 0 12px 0" alignItems="center">
            <FlexContainer margin="0 4px 0 0">
              <SvgIcon {...Icon} fillColor={isBuy ? '#00FFDD' : '#ED145B'} />
            </FlexContainer>
            <PrimaryTextSpan
              fontSize="10px"
              color={isBuy ? '#00FFDD' : '#ED145B'}
              textTransform="uppercase"
              fontWeight="bold"
            >
              {isBuy ? 'Buy' : 'Sell'}
            </PrimaryTextSpan>
          </FlexContainer>
          <PrimaryTextSpan
            color="rgba(255, 255, 255, 0.5)"
            fontSize="10px"
            lineHeight="12px"
          >
            {moment(openDate).format('DD MMM, HH:mm')}
          </PrimaryTextSpan>
        </FlexContainer>
        <FlexContainer flexDirection="column" alignItems="flex-end">
          <PrimaryTextSpan marginBottom="4px" fontSize="12px" lineHeight="14px">
            {mainAppStore.activeAccount?.symbol}
            {investmentAmount}
          </PrimaryTextSpan>
          <PrimaryTextSpan
            color="rgba(255, 255, 255, 0.5)"
            fontSize="10px"
            lineHeight="12px"
            marginBottom="12px"
          >
            &times;{multiplier}
          </PrimaryTextSpan>

          <FlexContainer ref={tooltipWrapperRef}>
            <InformationPopup
              classNameTooltip={`position_${id}`}
              bgColor="#000"
              width="200px"
              direction="bottom"
            >
              <FlexContainer flexDirection="column" width="100%">
                <FlexContainer
                  justifyContent="space-between"
                  margin="0 0 8px 0"
                >
                  <PrimaryTextSpan
                    color="rgba(255, 255, 255, 0.4)"
                    fontSize="12px"
                  >
                    Price opened
                  </PrimaryTextSpan>
                  <PrimaryTextSpan color="#fffccc" fontSize="12px">
                    at {openPrice}
                  </PrimaryTextSpan>
                </FlexContainer>
                <FlexContainer
                  justifyContent="space-between"
                  margin="0 0 8px 0"
                >
                  <PrimaryTextSpan
                    color="rgba(255, 255, 255, 0.4)"
                    fontSize="12px"
                  >
                    Opened
                  </PrimaryTextSpan>
                  <PrimaryTextSpan color="#fffccc" fontSize="12px">
                    {moment(openDate).format('DD MMM, HH:mm')}
                  </PrimaryTextSpan>
                </FlexContainer>
                <FlexContainer
                  justifyContent="space-between"
                  margin="0 0 8px 0"
                >
                  <PrimaryTextSpan
                    color="rgba(255, 255, 255, 0.4)"
                    fontSize="12px"
                  >
                    Equity
                  </PrimaryTextSpan>
                  <Observer>
                    {() => (
                      <PrimaryTextSpan color="#fffccc" fontSize="12px">
                        {getNumberSign(PnL + investmentAmount)}
                        {mainAppStore.activeAccount?.symbol}
                        {Math.abs(PnL + investmentAmount).toFixed(2)}
                      </PrimaryTextSpan>
                    )}
                  </Observer>
                </FlexContainer>
                {/* <FlexContainer justifyContent="space-between" margin="0 8px 0 0">
              <PrimaryTextSpan color="rgba(255, 255, 255, 0.4)" fontSize="12px">
               Overnight fee
              </PrimaryTextSpan>
              <PrimaryTextSpan color="#fffccc" fontSize="12px">
                at {openPrice}
              </PrimaryTextSpan>
            </FlexContainer> */}
                <FlexContainer justifyContent="space-between">
                  <PrimaryTextSpan
                    color="rgba(255, 255, 255, 0.4)"
                    fontSize="12px"
                  >
                    Position ID
                  </PrimaryTextSpan>
                  <PrimaryTextSpan color="#fffccc" fontSize="12px">
                    {id}
                  </PrimaryTextSpan>
                </FlexContainer>
              </FlexContainer>
            </InformationPopup>
          </FlexContainer>
        </FlexContainer>
        <FlexContainer flexDirection="column">
          <FlexContainer justifyContent="flex-end" margin="0 0 8px 0">
            <FlexContainer
              flexDirection="column"
              alignItems="flex-end"
              margin="0 8px 0 0"
            >
              <QuoteText
                isGrowth={PnL >= 0}
                marginBottom="4px"
                fontSize="12px"
                lineHeight="14px"
              >
                {PnL >= 0 ? '+' : '-'}
                {mainAppStore.activeAccount?.symbol}
                {Math.abs(PnL)}
              </QuoteText>
              <PrimaryTextSpan
                fontSize="10px"
                lineHeight="12px"
                color="rgba(255, 255, 255, 0.5)"
              >
                {PnL >= 0 ? '+' : ''}
                {calculateInPercent(investmentAmount, PnL)}%
              </PrimaryTextSpan>
            </FlexContainer>
          </FlexContainer>
          <FlexContainer ref={clickableWrapper}>
            <AutoClosePopupSideBar
              ref={instrumentRef}
              stopLossValue={stopLossInCurrency || stopLossRate || null}
              takeProfitValue={takeProfitInCurrency || takeProfitRate || null}
              investedAmount={investmentAmount}
              updateSLTP={updateSLTP}
            ></AutoClosePopupSideBar>
            <ClosePositionPopup
              applyHandler={closePosition}
              ref={instrumentRef}
            ></ClosePositionPopup>
          </FlexContainer>
        </FlexContainer>
      </InstrumentInfoWrapperForBorder>
    </InstrumentInfoWrapper>
  );
});

export default ActivePositionsPortfolioTab;

const InstrumentInfoWrapper = styled(FlexContainer)`
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }
`;

const InstrumentInfoWrapperForBorder = styled(FlexContainer)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
`;
