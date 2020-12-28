import React, { useRef, FC, useCallback, useEffect } from 'react';
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
import { LOCAL_PENDING_POSITION } from '../../constants/global';
import { Observer } from 'mobx-react-lite';

interface Props {
  pendingOrder: PendingOrderWSDTO;
  currencySymbol: string;
}

const PendingOrder: FC<Props> = props => {
  const { pendingOrder, currencySymbol } = props;
  const isBuy = pendingOrder.operation === AskBidEnum.Buy;
  const Icon = isBuy ? IconShevronUp : IconShevronDown;

  const { t } = useTranslation();

  const { mainAppStore, instrumentsStore, tradingViewStore } = useStores();
  const clickableWrapperRef = useRef<HTMLDivElement>(null);

  const instrumentRef = useRef<HTMLDivElement>(document.createElement("div"));
  const { precision } = useInstrument(pendingOrder.instrument);
  const handleCloseOrder = () => {
    API.removePendingOrder({
      accountId: mainAppStore.activeAccount!.id,
      orderId: pendingOrder.id,
      processId: getProcessId(),
    });
  };

  const switchInstrument = (e: any) => {
    tradingViewStore.selectedPendingPosition = pendingOrder.id;
    localStorage.setItem(LOCAL_PENDING_POSITION, `${pendingOrder.id}`);
    if (
      clickableWrapperRef.current &&
      clickableWrapperRef.current.contains(e.target)
    ) {
      e.preventDefault();
    } else {
      instrumentsStore.switchInstrument(pendingOrder.instrument);
    }
  };

  const activeInstrument = useCallback(() => {
    return instrumentsStore.instruments.find(item => item.instrumentItem.id === pendingOrder.instrument)?.instrumentItem;
  }, [pendingOrder]);

  useEffect(() => {
    const lastPendingActive = localStorage.getItem(LOCAL_PENDING_POSITION);
    if (!!lastPendingActive && pendingOrder.id === parseFloat(lastPendingActive)) {
      instrumentRef.current.scrollIntoView();
      tradingViewStore.selectedPendingPosition = parseFloat(lastPendingActive);
      instrumentsStore.switchInstrument(pendingOrder.instrument);
    }
  }, [])

  return (
    <Observer>
      {() => (
        <OrderWrapper
          flexDirection="column"
          onClick={switchInstrument}
          ref={instrumentRef}
          padding="0 16px"
          minHeight="67px"
          className={tradingViewStore.selectedPendingPosition === pendingOrder.id
            ? 'active'
            : ''
          }
        >
          <OrderWrapperWithBorder padding="12px 0" justifyContent="space-between">
            <FlexContainer width="32px" height="32px" margin="0 8px 0 0">
              <ImageContainer instrumentId={pendingOrder.instrument} />
            </FlexContainer>
            <FlexContainer flexDirection="column" margin="0 38px 0 0">
              <PrimaryTextSpan color="#fffccc" fontSize="12px" marginBottom="4px">
                {activeInstrument()?.name}
              </PrimaryTextSpan>
              <PrimaryTextSpan color="rgba(255, 255, 255, 0.5)" fontSize="10px">
                {moment(pendingOrder.created).format('DD MMM, HH:mm:ss')}
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
                  {isBuy ? t('Buy') : t('Sell')}
                </PrimaryTextSpan>
              </FlexContainer>
              <PrimaryTextSpan fontSize="10px" color="rgba(255, 255, 255, 0.5)">
                {t('at')} {pendingOrder.openPrice.toFixed(+precision)}
              </PrimaryTextSpan>
            </FlexContainer>
            <FlexContainer
              flexDirection="column"
              margin="0 8px 0 0"
              alignItems="flex-end"
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
              <FlexContainer margin="0 4px 0 0">
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
      )}
    </Observer>
  );
};

export default PendingOrder;

const OrderWrapper = styled(FlexContainer)`
  transition: all 0.2s ease;
  will-change: background-color;

  &:hover,
  &.active {
    background-color: rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }
`;

const OrderWrapperWithBorder = styled(FlexContainer)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
`;
