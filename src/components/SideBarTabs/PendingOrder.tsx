import React, { useRef } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import moment from 'moment';
import styled from '@emotion/styled';
import SvgIcon from '../SvgIcon';
import { AskBidEnum } from '../../enums/AskBid';
import IconShevronDown from '../../assets/svg/icon-shevron-logo-down.svg';
import IconShevronUp from '../../assets/svg/icon-shevron-logo-up.svg';
import IconSettings from '../../assets/svg/icon-chart-settings.svg';
import API from '../../helpers/API';
import { useStores } from '../../hooks/useStores';
import { getProcessId } from '../../helpers/getProcessId';
import AutoClosePopupSideBar from './AutoClosePopupSideBar';
import ClosePositionPopup from './ClosePositionPopup';
import { PendingOrdersWSDTO } from '../../types/PendingOrdersTypes';

interface Props {
  pendingOrder: PendingOrdersWSDTO;
  currencySymbol: string;
}

function PendingOrder(props: Props) {
  const { pendingOrder, currencySymbol } = props;
  const isBuy = pendingOrder.operation === AskBidEnum.Buy;
  const Icon = isBuy ? IconShevronUp : IconShevronDown;

  const { mainAppStore, instrumentsStore } = useStores();
  const clickableWrapperRef = useRef<HTMLDivElement>(null);

  const instrumentRef = useRef<HTMLDivElement>(null);

  const handleCloseOrder = () => {
    API.removePendingOrder({
      accountId: mainAppStore.activeAccount!.id,
      orderId: pendingOrder.id,
      processId: getProcessId(),
    });
  };

  const switchInstrument = (e: any) => {
    if (
      clickableWrapperRef.current &&
      clickableWrapperRef.current.contains(e.target)
    ) {
      e.preventDefault();
    } else {
      instrumentsStore.switchInstrument(pendingOrder.instrument);
    }
  };

  return (
    <OrderWrapper
      flexDirection="column"
      onClick={switchInstrument}
      ref={instrumentRef}
      padding="0 16px"
    >
      <OrderWrapperWithBorder padding="12px 0" justifyContent="space-between">
        <FlexContainer
          width="32px"
          height="32px"
          margin="0 8px 0 0"
        ></FlexContainer>
        <FlexContainer flexDirection="column" margin="0 38px 0 0">
          <PrimaryTextSpan color="#fffccc" fontSize="12px" marginBottom="4px">
            {pendingOrder.instrument}
          </PrimaryTextSpan>
          <PrimaryTextSpan color="rgba(255, 255, 255, 0.5)" fontSize="10px">
            {moment(pendingOrder.created).format('DD MMM, HH:mm')}
          </PrimaryTextSpan>
        </FlexContainer>
        <FlexContainer flexDirection="column" margin="0 24px 0 0">
          <FlexContainer margin="0 4px 0 0">
            <FlexContainer margin="0 4px 0 0">
              <SvgIcon {...Icon} fillColor={isBuy ? '#00FFDD' : '#ED145B'} />
            </FlexContainer>
            <PrimaryTextSpan
              fontSize="12px"
              color={isBuy ? '#00FFDD' : '#ED145B'}
            >
              {isBuy ? 'Buy' : 'Sell'}
            </PrimaryTextSpan>
          </FlexContainer>
          <PrimaryTextSpan fontSize="10px" color="rgba(255, 255, 255, 0.5)">
            at {currencySymbol}
            {pendingOrder.openPrice}
          </PrimaryTextSpan>
        </FlexContainer>
        <FlexContainer
          flexDirection="column"
          margin="0 8px 0 0"
          alignItems="flex-end"
        >
          <PrimaryTextSpan color="#fffccc" fontSize="12px" marginBottom="4px">
            {currencySymbol}
            {pendingOrder.investmentAmount}
          </PrimaryTextSpan>
          <PrimaryTextSpan fontSize="10px" color="rgba(255, 255, 255, 0.5)">
            &times;{pendingOrder.multiplier}
          </PrimaryTextSpan>
        </FlexContainer>
        <FlexContainer alignItems="center" ref={clickableWrapperRef}>
          <FlexContainer margin="0 4px 0 0">
            <AutoClosePopupSideBar
              ref={instrumentRef}
              stopLossValue={
                pendingOrder.stopLossInCurrency ||
                pendingOrder.stopLossRate ||
                null
              }
              takeProfitValue={
                pendingOrder.takeProfitInCurrency ||
                pendingOrder.takeProfitRate ||
                null
              }
              investedAmount={pendingOrder.investmentAmount}
              updateSLTP={() => {}}
              isDisabled
            >
              <SvgIcon
                {...IconSettings}
                fillColor="rgba(255, 255, 255, 0.6)"
                hoverFillColor="#00FFDD"
              />
            </AutoClosePopupSideBar>
          </FlexContainer>
          <ClosePositionPopup
            applyHandler={handleCloseOrder}
            ref={instrumentRef}
          ></ClosePositionPopup>
        </FlexContainer>
      </OrderWrapperWithBorder>
    </OrderWrapper>
  );
}

export default PendingOrder;

const OrderWrapper = styled(FlexContainer)`
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }
`;

const OrderWrapperWithBorder = styled(FlexContainer)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
`;
