import React, { FC, useRef, useCallback, useMemo } from 'react';
import * as yup from 'yup';
import { Observer } from 'mobx-react-lite';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan, QuoteText } from '../../styles/TextsElements';
import { AskBidEnum } from '../../enums/AskBid';
import SvgIcon from '../SvgIcon';
import IconShevronDown from '../../assets/svg/icon-shevron-logo-down.svg';
import IconShevronUp from '../../assets/svg/icon-shevron-logo-up.svg';
import { useStores } from '../../hooks/useStores';
import calculateFloatingProfitAndLoss from '../../helpers/calculateFloatingProfitAndLoss';
import API from '../../helpers/API';
import { PositionModelWSDTO, UpdateSLTP } from '../../types/Positions';
import { getProcessId } from '../../helpers/getProcessId';
import moment from 'moment';
import InformationPopup from '../InformationPopup';
import AutoClosePopupSideBar from './AutoClosePopupSideBar';
import { getNumberSign } from '../../helpers/getNumberSign';
import { calculateInPercent } from '../../helpers/calculateInPercent';
import ClosePositionPopup from './ClosePositionPopup';
import ImageContainer from '../ImageContainer';
import Fields from '../../constants/fields';
import { TpSlTypeEnum } from '../../enums/TpSlTypeEnum';
import { useFormik } from 'formik';
import ErropPopup from '../ErropPopup';
import ColorsPallete from '../../styles/colorPallete';

interface Props {
  position: PositionModelWSDTO;
}

const ActivePositionsPortfolioTab: FC<Props> = ({ position }) => {
  const isBuy = position.operation === AskBidEnum.Buy;

  const instrumentRef = useRef<HTMLDivElement>(null);
  const clickableWrapper = useRef<HTMLDivElement>(null);
  const tooltipWrapperRef = useRef<HTMLDivElement>(null);

  const Icon = isBuy ? IconShevronUp : IconShevronDown;

  const {
    quotesStore,
    mainAppStore,
    badRequestPopupStore,
    instrumentsStore,
    SLTPStore,
  } = useStores();

  const initialValues = useCallback(
    () => ({
      accountId: mainAppStore.activeAccount?.id || '',
      instrumentId: position.instrument,
      positionId: position.id,
      processId: getProcessId(),
      tp: position.tp,
      sl: position.sl,
      tpType: position.tpType,
      slType: position.slType,
      operation: position.operation,
    }),
    [position]
  );

  const currentPriceAsk = useCallback(
    () => quotesStore.quotes[position.instrument].ask.c,
    [quotesStore.quotes[position.instrument].ask.c, position.instrument]
  );

  const currentPriceBid = useCallback(
    () => quotesStore.quotes[position.instrument].bid.c,
    [quotesStore.quotes[position.instrument].bid.c, position.instrument]
  );

  const validationSchema = useCallback(
    () =>
      yup.object().shape({
        tp: yup
          .number()
          .nullable()
          .when([Fields.OPERATION, Fields.TAKE_PROFIT_TYPE], {
            is: (operation, tpType) =>
              operation === AskBidEnum.Buy && tpType === TpSlTypeEnum.Price,
            then: yup
              .number()
              .nullable()
              .test(
                Fields.TAKE_PROFIT,
                'Error message: This level is higher or lower than the one currently allowed',
                value => value > currentPriceBid()
              ),
          })
          .when([Fields.OPERATION, Fields.TAKE_PROFIT_TYPE], {
            is: (operation, tpType) =>
              operation === AskBidEnum.Sell && tpType === TpSlTypeEnum.Price,
            then: yup
              .number()
              .nullable()
              .test(
                Fields.TAKE_PROFIT,
                'Error message: This level is higher or lower than the one currently allowed',
                value => value < currentPriceAsk()
              ),
          })
          .when([Fields.TAKE_PROFIT_TYPE], {
            is: tpType => tpType === TpSlTypeEnum.Currency,
            then: yup
              .number()
              .nullable()
              .test(
                Fields.TAKE_PROFIT,
                'Take profit level should be higher than the current P/L',
                value => value > PnL()
              ),
            // .test(
            //   Fields.TAKE_PROFIT,
            //   'Take profit level can not be zero',
            //   value => {
            //     console.log(value)
            //     return value !== 0;
            //   }
            // ),
          }),
        sl: yup
          .number()
          .nullable()
          .when([Fields.OPERATION, Fields.STOP_LOSS_TYPE], {
            is: (operation, slType) =>
              operation === AskBidEnum.Buy && slType === TpSlTypeEnum.Price,
            then: yup
              .number()
              .test(
                Fields.STOP_LOSS,
                'Error message: This level is higher or lower than the one currently allowed',
                value => value < currentPriceBid()
              ),
          })
          .when([Fields.OPERATION, Fields.STOP_LOSS_TYPE], {
            is: (operation, slType) =>
              operation === AskBidEnum.Sell && slType === TpSlTypeEnum.Price,
            then: yup
              .number()
              .test(
                Fields.STOP_LOSS,
                'Error message: This level is higher or lower than the one currently allowed',
                value => value > currentPriceAsk()
              ),
          })
          .when([Fields.STOP_LOSS_TYPE], {
            is: slType => slType === TpSlTypeEnum.Currency,
            then: yup
              .number()
              .test(
                Fields.STOP_LOSS,
                'Stop loss level should be lower than the current P/L',
                value => -1 * Math.abs(value) <= PnL()
              )
              .test(
                Fields.STOP_LOSS,
                'Stop loss level can not be higher than the Invest amount',
                value => Math.abs(value) < position.investmentAmount
              ),
          }),
        tpType: yup.number().nullable(),
        slType: yup.number().nullable(),
      }),
    [position, currentPriceBid, currentPriceAsk]
  );

  const PnL = useCallback(
    () =>
      calculateFloatingProfitAndLoss({
        investment: position.investmentAmount,
        multiplier: position.multiplier,
        costs: position.swap + position.commission,
        side: isBuy ? 1 : -1,
        currentPrice: isBuy ? currentPriceBid() : currentPriceAsk(),
        openPrice: position.openPrice,
      }),
    [currentPriceBid, currentPriceAsk, position]
  );

  const closePosition = () => {
    API.closePosition({
      accountId: mainAppStore.activeAccount!.id,
      positionId: position.id,
      processId: getProcessId(),
    });
  };

  const updateSLTP = async (values: UpdateSLTP) => {
    if (!values.sl && !values.tp) {
      return;
    }
    const valuesToSubmit = {
      ...values,
      slType: values.sl ? values.slType : null,
      tpType: values.tp ? values.tpType : null,
      sl: values.sl || null,
      tp: values.tp || null,
    };
    try {
      await API.updateSLTP(valuesToSubmit);
    } catch (error) {
      badRequestPopupStore.openModal();
      badRequestPopupStore.setMessage(error);
    }
  };

  const {
    setFieldValue,
    errors,
    submitForm,
    validateForm,
    resetForm,
    touched,
  } = useFormik<UpdateSLTP>({
    initialValues: initialValues(),
    onSubmit: updateSLTP,
    validationSchema: validationSchema(),
    validateOnBlur: true,
    validateOnChange: true,
  });

  const setInstrumentActive = (e: any) => {
    if (
      (clickableWrapper.current &&
        clickableWrapper.current.contains(e.target)) ||
      (tooltipWrapperRef.current &&
        tooltipWrapperRef.current.contains(e.target))
    ) {
      e.preventDefault();
    } else {
      instrumentsStore.switchInstrument(position.instrument);
    }
  };

  const handleApply = useCallback(async () => {
    await setFieldValue(
      Fields.TAKE_PROFIT_TYPE,
      SLTPStore.takeProfitValue !== '' ? SLTPStore.autoCloseTPType : null
    );
    await setFieldValue(
      Fields.STOP_LOSS_TYPE,
      SLTPStore.stopLossValue !== '' ? SLTPStore.autoCloseSLType : null
    );
    await setFieldValue(
      Fields.TAKE_PROFIT,
      SLTPStore.takeProfitValue !== '' ? +SLTPStore.takeProfitValue : null
    );
    await setFieldValue(
      Fields.STOP_LOSS,
      SLTPStore.stopLossValue !== '' ? +SLTPStore.stopLossValue : null
    );
    return new Promise<void>(async (resolve, reject) => {
      const errors = await validateForm();
      if (!Object.keys(errors).length) {
        submitForm();
        resolve();
      } else {
        reject();
      }
    });
  }, [SLTPStore.takeProfitValue, SLTPStore.stopLossValue]);

  const removeSL = () => {
    SLTPStore.stopLossValue = '';
    setFieldValue(Fields.STOP_LOSS, null);
  };

  const removeTP = () => {
    SLTPStore.takeProfitValue = '';
    setFieldValue(Fields.TAKE_PROFIT, null);
  };

  return (
    <InstrumentInfoWrapper
      padding="8px 8px 0 12px"
      ref={instrumentRef}
      flexDirection="column"
      onClick={setInstrumentActive}
      minHeight="79px"
    >
      <InstrumentInfoWrapperForBorder
        justifyContent="space-between"
        padding="0 0 8px 0"
      >
        <FlexContainer width="32px" alignItems="flex-start">
          <ImageContainer instrumentId={position.instrument} />
        </FlexContainer>
        <FlexContainer flexDirection="column" margin="0 6px 0 0">
          <PrimaryTextSpan fontSize="12px" lineHeight="14px" marginBottom="2px">
            {position.instrument}
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
            {moment(position.openDate).format('DD MMM, HH:mm:ss')}
          </PrimaryTextSpan>
        </FlexContainer>
        <FlexContainer flexDirection="column" alignItems="flex-end">
          <PrimaryTextSpan marginBottom="4px" fontSize="12px" lineHeight="14px">
            {mainAppStore.activeAccount?.symbol}
            {position.investmentAmount.toFixed(2)}
          </PrimaryTextSpan>
          <PrimaryTextSpan
            color="rgba(255, 255, 255, 0.5)"
            fontSize="10px"
            lineHeight="12px"
            marginBottom="12px"
          >
            &times;{position.multiplier}
          </PrimaryTextSpan>

          <FlexContainer ref={tooltipWrapperRef}>
            <InformationPopup
              classNameTooltip={`position_${position.id}`}
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
                    at {position.openPrice}
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
                    {moment(position.openDate).format('DD MMM, HH:mm:ss')}
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
                        {getNumberSign(PnL() + position.investmentAmount)}
                        {mainAppStore.activeAccount?.symbol}
                        {Math.abs(PnL() + position.investmentAmount).toFixed(2)}
                      </PrimaryTextSpan>
                    )}
                  </Observer>
                </FlexContainer>
                <FlexContainer
                  justifyContent="space-between"
                  margin="0 0 8px 0"
                >
                  <PrimaryTextSpan
                    color="rgba(255, 255, 255, 0.4)"
                    fontSize="12px"
                  >
                    Overnight fee
                  </PrimaryTextSpan>
                  <PrimaryTextSpan color="#fffccc" fontSize="12px">
                    {getNumberSign(position.swap)}
                    {mainAppStore.activeAccount?.symbol}
                    {Math.abs(position.swap).toFixed(2)}
                  </PrimaryTextSpan>
                </FlexContainer>
                <FlexContainer justifyContent="space-between">
                  <PrimaryTextSpan
                    color="rgba(255, 255, 255, 0.4)"
                    fontSize="12px"
                  >
                    Position ID
                  </PrimaryTextSpan>
                  <PrimaryTextSpan color="#fffccc" fontSize="12px">
                    {position.id}
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
              <Observer>
                {() => (
                  <QuoteText
                    isGrowth={PnL() >= 0}
                    marginBottom="4px"
                    fontSize="12px"
                    lineHeight="14px"
                  >
                    {PnL() >= 0 ? '+' : '-'}
                    {mainAppStore.activeAccount?.symbol}
                    {Math.abs(PnL()).toFixed(2)}
                  </QuoteText>
                )}
              </Observer>
              <Observer>
                {() => (
                  <PrimaryTextSpan
                    fontSize="10px"
                    lineHeight="12px"
                    color="rgba(255, 255, 255, 0.5)"
                  >
                    {PnL() >= 0 ? '+' : ''}
                    {calculateInPercent(position.investmentAmount, PnL())}%
                  </PrimaryTextSpan>
                )}
              </Observer>
            </FlexContainer>
          </FlexContainer>
          <FlexContainer ref={clickableWrapper}>
            {((touched.sl && errors.sl) || (touched.tp && errors.tp)) && (
              <ErropPopup
                textColor="#fffccc"
                bgColor={ColorsPallete.RAZZMATAZZ}
                classNameTooltip={Fields.AMOUNT}
                direction="left"
              >
                {errors.sl || errors.tp}
              </ErropPopup>
            )}

            <CustomForm>
              <AutoClosePopupSideBar
                ref={instrumentRef}
                stopLossValue={position.sl}
                takeProfitValue={position.tp}
                stopLossType={position.slType}
                takeProfitType={position.tpType}
                updateSLTP={handleApply}
                stopLossError={errors.sl}
                takeProfitError={errors.tp}
                removeSl={removeSL}
                removeTP={removeTP}
                resetForm={resetForm}
              >
                <SetSLTPButton>
                  <PrimaryTextSpan
                    fontSize="12px"
                    lineHeight="14px"
                    color={position.tp ? '#fffccc' : 'rgba(255, 255, 255, 0.6)'}
                  >
                    TP
                  </PrimaryTextSpan>
                  &nbsp;
                  <PrimaryTextSpan
                    fontSize="12px"
                    lineHeight="14px"
                    color={position.sl ? '#fffccc' : 'rgba(255, 255, 255, 0.6)'}
                  >
                    SL
                  </PrimaryTextSpan>
                </SetSLTPButton>
              </AutoClosePopupSideBar>
            </CustomForm>

            <ClosePositionPopup
              applyHandler={closePosition}
              ref={instrumentRef}
              confirmText="Close position?"
              isButton
            ></ClosePositionPopup>
          </FlexContainer>
        </FlexContainer>
      </InstrumentInfoWrapperForBorder>
    </InstrumentInfoWrapper>
  );
};

export default ActivePositionsPortfolioTab;

const InstrumentInfoWrapper = styled(FlexContainer)`
  transition: all 0.2s ease;
  will-change: background-color;

  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }
`;

const InstrumentInfoWrapperForBorder = styled(FlexContainer)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
`;

const SetSLTPButton = styled(FlexContainer)`
  border: 1px solid rgba(255, 255, 255, 0.12);
  margin-right: 8px;
  background-color: transparent;
  padding: 4px 8px;
  transition: background-color 0.2s ease;
  will-change: background-color;
  border-radius: 4px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.24);
  }

  &:focus {
    background-color: rgba(0, 0, 0, 0.24);
  }

  &:disabled {
    background-color: rgba(255, 255, 255, 0.04);
    & span {
      color: rgba(255, 255, 255, 0.4);
    }
  }
`;

const CustomForm = styled.form`
  margin: 0;
`;
