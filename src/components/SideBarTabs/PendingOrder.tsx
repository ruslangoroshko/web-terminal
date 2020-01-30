import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { PendingOrdersWSDTO } from '../../types/PendingOrders';
import moment from 'moment';
import styled from '@emotion/styled';
import SvgIcon from '../SvgIcon';
import { AskBidEnum } from '../../enums/AskBid';
import IconShevronDown from '../../assets/svg/icon-shevron-logo-down.svg';
import IconShevronUp from '../../assets/svg/icon-shevron-logo-up.svg';
import IconSettings from '../../assets/svg/icon-chart-settings.svg';
import IconClose from '../../assets/svg/icon-close.svg';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import API from '../../helpers/API';
import { useStores } from '../../hooks/useStores';
import { getProcessId } from '../../helpers/getProcessId';

interface Props {
  pendingOrder: PendingOrdersWSDTO;
  currencySymbol: string;
}

function PendingOrder(props: Props) {
  const { pendingOrder, currencySymbol } = props;
  const isBuy = pendingOrder.operation === AskBidEnum.Buy;
  const Icon = isBuy ? IconShevronUp : IconShevronDown;

  const { mainAppStore } = useStores();

  const handleEditSlTp = () => {};

  const handleCloseOrder = () => {
    API.removePendingOrder({
      accountId: mainAppStore.activeAccount!.id,
      orderId: pendingOrder.id,
      processId: getProcessId(),
    });
  };

  return (
    <OrderWrapper padding="12px 0" justifyContent="space-between">
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
      <FlexContainer alignItems="center">
        <FlexContainer margin="0 4px 0 0">
          <ButtonWithoutStyles onClick={handleEditSlTp}>
            <SvgIcon {...IconSettings} fillColor="rgba(255, 255, 255, 0.6)" />
          </ButtonWithoutStyles>
        </FlexContainer>
        <ButtonWithoutStyles onClick={handleCloseOrder}>
          <SvgIcon {...IconClose} fillColor="rgba(255, 255, 255, 0.8)" />
        </ButtonWithoutStyles>
      </FlexContainer>
    </OrderWrapper>
  );
}

export default PendingOrder;

const OrderWrapper = styled(FlexContainer)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
`;
