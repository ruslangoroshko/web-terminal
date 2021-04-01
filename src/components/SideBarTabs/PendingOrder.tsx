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
import useInstrumentPrecision from '../../hooks/useInstrumentPrecision';
import { LOCAL_PENDING_POSITION } from '../../constants/global';
import { Observer } from 'mobx-react-lite';
import { FormProvider, useForm } from 'react-hook-form';
import { FormValues } from '../../types/Positions';
import hasValue from '../../helpers/hasValue';
import { SortByPendingOrdersEnum } from '../../enums/SortByPendingOrdersEnum';

interface Props {
  pendingOrder: PendingOrderWSDTO;
  currencySymbol: string;
}

const PendingOrder: FC<Props> = (props) => {
  const { pendingOrder, currencySymbol } = props;
  const isBuy = pendingOrder.operation === AskBidEnum.Buy;
  const Icon = isBuy ? IconShevronUp : IconShevronDown;

  const { t } = useTranslation();

  const {
    mainAppStore,
    instrumentsStore,
    tradingViewStore,
    sortingStore,
  } = useStores();
  const clickableWrapperRef = useRef<HTMLDivElement>(null);

  const instrumentRef = useRef<HTMLDivElement>(document.createElement('div'));
  const { precision } = useInstrumentPrecision(pendingOrder.instrument);
  const handleCloseOrder = () => {
    return API.removePendingOrder({
      accountId: mainAppStore.activeAccount!.id,
      orderId: pendingOrder.id,
      processId: getProcessId(),
    });
  };

  const switchInstrument = (e: any) => {
    tradingViewStore.setSelectedPendingPosition(pendingOrder.id);
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

  const orderInstrument = useCallback(() => {
    return instrumentsStore.instruments.find(
      (item) => item.instrumentItem.id === pendingOrder.instrument
    )?.instrumentItem;
  }, [pendingOrder]);

  useEffect(() => {
    const lastPendingActive = mainAppStore.paramsPortfolioOrder || localStorage.getItem(LOCAL_PENDING_POSITION);
    if (mainAppStore.paramsPortfolioOrder) {
      localStorage.setItem(LOCAL_PENDING_POSITION, mainAppStore.paramsPortfolioOrder);
      sortingStore.setPendingOrdersSortBy(SortByPendingOrdersEnum.NewFirstAsc);
    }
    if (
      !!lastPendingActive &&
      pendingOrder.id === parseFloat(lastPendingActive)
    ) {
      instrumentRef.current.scrollIntoView();
      tradingViewStore.setSelectedPendingPosition(
        parseFloat(lastPendingActive)
      );
      instrumentsStore.switchInstrument(pendingOrder.instrument);
    }
  }, []);

  const methodsForForm = useForm<FormValues>({
    reValidateMode: 'onSubmit',
    defaultValues: {
      tp: pendingOrder.tp ?? undefined,
      sl: hasValue(pendingOrder.sl) ? Math.abs(pendingOrder.sl!) : undefined,
      investmentAmount: pendingOrder.investmentAmount,
    },
  });

  return (
    <Observer>
      {() => (
        <OrderWrapper
          flexDirection="column"
          onClick={switchInstrument}
          ref={instrumentRef}
          padding="0 16px"
          className={
            tradingViewStore.selectedPendingPosition === pendingOrder.id
              ? 'active'
              : ''
          }
        >
          <OrderWrapperWithBorder
            padding="12px 0"
            justifyContent="space-between"
          >
            <FlexContainer
              minWidth="32px"
              width="32px"
              height="32px"
              marginRight="8px"
            >
              <ImageContainer instrumentId={pendingOrder.instrument} />
            </FlexContainer>
            <FlexContainer
              flexDirection="column"
              marginRight="8px"
              width="100%"
            >
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
            <FlexContainer
              flexDirection="column"
              marginRight="4px"
              width="100%"
            >
              <FlexContainer>
                <FlexContainer marginRight="4px">
                  <SvgIcon
                    {...Icon}
                    fillColor={isBuy ? '#00FFDD' : '#ED145B'}
                  />
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
              <PrimaryTextSpan
                color="#fffccc"
                fontSize="12px"
                marginBottom="4px"
              >
                {currencySymbol}
                {pendingOrder.investmentAmount.toFixed(2)}
              </PrimaryTextSpan>
              <PrimaryTextSpan fontSize="10px" color="rgba(255, 255, 255, 0.5)">
                &times;{pendingOrder.multiplier}
              </PrimaryTextSpan>
            </FlexContainer>
            <FlexContainer alignItems="center" ref={clickableWrapperRef}>
              <FlexContainer marginRight="4px">
                <FormProvider {...methodsForForm}>
                  <AutoClosePopupSideBar
                    ref={instrumentRef}
                    isDisabled
                    handleSumbitMethod={handleCloseOrder}
                    tpType={pendingOrder.tpType}
                    slType={pendingOrder.slType}
                    instrumentId={pendingOrder.instrument}
                    positionId={pendingOrder.id}
                  >
                    <SvgIcon
                      {...IconSettings}
                      fillColor="rgba(255, 255, 255, 0.6)"
                      hoverFillColor="#00FFDD"
                    />
                  </AutoClosePopupSideBar>
                </FormProvider>
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
