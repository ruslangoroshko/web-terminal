import React, { useRef, FC, useCallback } from 'react';
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
import { PendingOrderWSDTO } from '../../types/PendingOrdersTypes';
import ImageContainer from '../ImageContainer';
import { useTranslation } from 'react-i18next';
import useInstrument from '../../hooks/useInstrument';

interface Props {
  pendingOrder: PendingOrderWSDTO;
  currencySymbol: string;
}

const PendingOrder: FC<Props> = (props) => {
  const { pendingOrder, currencySymbol } = props;
  const isBuy = pendingOrder.operation === AskBidEnum.Buy;
  const Icon = isBuy ? IconShevronUp : IconShevronDown;

  const { t } = useTranslation();

  const { mainAppStore, instrumentsStore } = useStores();
  const clickableWrapperRef = useRef<HTMLDivElement>(null);

  const instrumentRef = useRef<HTMLDivElement>(null);
  const { precision } = useInstrument(pendingOrder.instrument);
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

  const orderInstrument = useCallback(() => {
    return instrumentsStore.instruments.find(
      (item) => item.instrumentItem.id === pendingOrder.instrument
    )?.instrumentItem;
  }, [pendingOrder]);

  return (
    <OrderWrapper
      flexDirection="column"
      onClick={switchInstrument}
      ref={instrumentRef}
      padding="0 16px"
    >
      <OrderWrapperWithBorder padding="12px 0" justifyContent="space-between">
        <FlexContainer
          minWidth="32px"
          width="32px"
          height="32px"
          margin="0 8px 0 0"
        >
          <ImageContainer instrumentId={pendingOrder.instrument} />
        </FlexContainer>
        <FlexContainer flexDirection="column" marginRight="8px" width="100%">
          <PrimaryTextSpan
            color="#fffccc"
            fontSize="12px"
            marginBottom="4px"
            textOverflow="ellipsis"
            overflow="hidden"
            whiteSpace="nowrap"
            maxWidth="70px"
            title={orderInstrument()?.name}
          >
            {orderInstrument()?.name}
          </PrimaryTextSpan>
          <PrimaryTextSpan color="rgba(255, 255, 255, 0.5)" fontSize="10px">
            {moment(pendingOrder.created).format('DD MMM, HH:mm')}
          </PrimaryTextSpan>
        </FlexContainer>
        <FlexContainer flexDirection="column" marginRight="4px" width="100%">
          <FlexContainer>
            <FlexContainer marginRight="4px">
              <SvgIcon {...Icon} fillColor={isBuy ? '#00FFDD' : '#ED145B'} />
            </FlexContainer>
            <PrimaryTextSpan
              fontSize="12px"
              color={isBuy ? '#00FFDD' : '#ED145B'}
              textTransform="uppercase"
            >
              {isBuy ? t('Buy') : t('Sell')}
            </PrimaryTextSpan>
          </FlexContainer>
          <PrimaryTextSpan fontSize="10px" color="rgba(255, 255, 255, 0.5)">
            {t('at')} {pendingOrder.openPrice.toFixed(+precision)}
          </PrimaryTextSpan>
        </FlexContainer>
        <FlexContainer
          flexDirection="column"
          marginRight="8px"
          alignItems="flex-end"
          minWidth="52px"
        >
          <PrimaryTextSpan color="#fffccc" fontSize="12px" marginBottom="4px">
            {currencySymbol}
            {pendingOrder.investmentAmount.toFixed(2)}
          </PrimaryTextSpan>
          <PrimaryTextSpan fontSize="10px" color="rgba(255, 255, 255, 0.5)">
            &times;{pendingOrder.multiplier}
          </PrimaryTextSpan>
        </FlexContainer>
        <FlexContainer alignItems="center" ref={clickableWrapperRef}>
          <FlexContainer marginRight="4px">
            <AutoClosePopupSideBar
              ref={instrumentRef}
              stopLossValue={pendingOrder.sl}
              takeProfitValue={pendingOrder.tp}
              stopLossType={pendingOrder.slType}
              takeProfitType={pendingOrder.tpType}
              removeTP={() => {}}
              removeSl={() => {}}
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
            buttonLabel={`${t('Close')}`}
            ref={instrumentRef}
            confirmText={`${t('Cancel order')}?`}
          ></ClosePositionPopup>
        </FlexContainer>
      </OrderWrapperWithBorder>
    </OrderWrapper>
  );
};

export default PendingOrder;

const OrderWrapper = styled(FlexContainer)`
  transition: all 0.2s ease;
  will-change: background-color;

  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }
`;

const OrderWrapperWithBorder = styled(FlexContainer)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
`;
