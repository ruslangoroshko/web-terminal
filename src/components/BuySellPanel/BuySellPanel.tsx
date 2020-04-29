import React, { ChangeEvent, useRef, useEffect, FC, useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import SvgIcon from '../SvgIcon';
import IconShevronBuy from '../../assets/svg/icon-buy-sell-shevron-buy.svg';
import IconShevronSell from '../../assets/svg/icon-buy-sell-shevron-sell.svg';
import AutoClosePopup from './AutoClosePopup';
import PurchaseAtPopup from './PurchaseAtPopup';
import * as yup from 'yup';
import { OpenPositionModelFormik } from '../../types/Positions';
import { InstrumentModelWSDTO } from '../../types/InstrumentsTypes';
import { AskBidEnum } from '../../enums/AskBid';
import API from '../../helpers/API';
import InformationPopup from '../InformationPopup';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { useFormik, FormikHelpers } from 'formik';
import Fields from '../../constants/fields';
import { useStores } from '../../hooks/useStores';
import ColorsPallete from '../../styles/colorPallete';
import ErropPopup from '../ErropPopup';
import MultiplierDropdown from './MultiplierDropdown';
import InvestAmountDropdown from './InvestAmountDropdown';
import { getProcessId } from '../../helpers/getProcessId';
import { AutoCloseTypesEnum } from '../../enums/AutoCloseTypesEnum';
import ConfirmationPopup from './ConfirmationPopup';
import { keyframes } from '@emotion/core';
import { OperationApiResponseCodes } from '../../enums/OperationApiResponseCodes';
import apiResponseCodeMessages from '../../constants/apiResponseCodeMessages';
import { Observer } from 'mobx-react-lite';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../../constants/mixpanelEvents';
import { MixpanelMarketOrder } from '../../types/MixpanelTypes';
import BadRequestPopup from '../BadRequestPopup';

// TODO: too much code, refactor

interface Props {
  instrument: InstrumentModelWSDTO;
}

const BuySellPanel: FC<Props> = ({ instrument }) => {
  const {
    quotesStore,
    notificationStore,
    mainAppStore,
    badRequestPopupStore,
  } = useStores();

  const initialValues: OpenPositionModelFormik = {
    processId: getProcessId(),
    accountId: mainAppStore.activeAccount?.id || '',
    instrumentId: instrument.id,
    operation: null,
    multiplier: instrument.multiplier[0],
    investmentAmount: 50,
    SLTPType: AutoCloseTypesEnum.Profit,
    sl: null,
    tp: null,
    purchaseAt: null,
  };

  const validationSchema = yup.object().shape({
    investmentAmount: yup
      .number()
      .min(
        instrument.minOperationVolume / initialValues.multiplier,
        `Minimum trade volume [$${instrument.minOperationVolume /
          initialValues.multiplier}]. Please increase your trade amount or multiplier.`
      )
      .lessThan(
        quotesStore.available,
        `Insufficient funds to open a position. You have only [${quotesStore.available}]`
      )
      .max(
        instrument.maxOperationVolume / initialValues.multiplier,
        `Maximum trade volume [$${instrument.maxOperationVolume /
          initialValues.multiplier}]. Please decrease your trade amount or multiplier.`
      )
      .required('Please fill Invest amount'),
    multiplier: yup.number().required('Required amount'),
    tp: yup.number().nullable(),
    sl: yup.number().nullable(),
    purchaseAt: yup.number().nullable(),
  });

  const onSubmit = async (
    values: OpenPositionModelFormik,
    formikHelpers: FormikHelpers<OpenPositionModelFormik>
  ) => {
    formikHelpers.setSubmitting(false);
    const { SLTPType, sl, tp, operation, ...otherValues } = values;

    let fieldForTakeProfit = Fields.TAKE_PROFIT;
    let fieldForStopLoss = Fields.STOP_LOSS;

    switch (SLTPType) {
      case AutoCloseTypesEnum.Profit:
        fieldForTakeProfit = Fields.TAKE_PROFIT;
        fieldForStopLoss = Fields.STOP_LOSS;
        break;

      case AutoCloseTypesEnum.Percent:
        fieldForTakeProfit = Fields.TAKE_PROFIT_RATE;
        fieldForStopLoss = Fields.STOP_LOSS_RATE;
        break;

      case AutoCloseTypesEnum.Price:
        fieldForTakeProfit = Fields.TAKE_PROFIT_PRICE;
        fieldForStopLoss = Fields.STOP_LOSS_PRICE;
        break;

      default:
        break;
    }

    const modelToSubmit = {
      ...otherValues,
      [fieldForTakeProfit]: tp,
      [fieldForStopLoss]: sl,
      operation: operation === null ? AskBidEnum.Buy : operation,
    };

    if (values.purchaseAt) {
      try {
        const response = await API.openPendingOrder(modelToSubmit);

        notificationStore.notificationMessage =
          apiResponseCodeMessages[response.result];
        notificationStore.isSuccessfull =
          response.result === OperationApiResponseCodes.Ok;
        notificationStore.openNotification();

        if (response.result === OperationApiResponseCodes.Ok) {
          mixpanel.track(mixpanelEvents.LIMIT_ORDER, {
            value: values.investmentAmount,
            multiplier: `x${values.multiplier}`,
            sltp: 'no',
            trend: values.operation === AskBidEnum.Buy ? 'buy' : 'sell',
            label: values.instrumentId,
            event_ref: 'instrument page',
          } as MixpanelMarketOrder);
        }
        resetForm();
      } catch (error) {
        badRequestPopupStore.openModal();
        badRequestPopupStore.setMessage(error);
      }
    } else {
      try {
        const response = await API.openPosition(modelToSubmit);
        notificationStore.notificationMessage =
          apiResponseCodeMessages[response.result];
        notificationStore.isSuccessfull =
          response.result === OperationApiResponseCodes.Ok;
        notificationStore.openNotification();

        if (response.result === OperationApiResponseCodes.Ok) {
          mixpanel.track(mixpanelEvents.MARKET_ORDER, {
            value: values.investmentAmount,
            multiplier: `x${values.multiplier}`,
            sltp: values.sl || values.tp ? 'yes' : 'no',
            trend: values.operation === AskBidEnum.Buy ? 'buy' : 'sell',
            label: values.instrumentId,
            event_ref: 'instrument page',
          } as MixpanelMarketOrder);
        }
        resetForm();
      } catch (error) {
        badRequestPopupStore.openModal();
        badRequestPopupStore.setMessage(error);
      }
    }
  };

  const {
    values,
    setFieldError,
    setFieldValue,
    submitForm,
    resetForm,
    handleSubmit,
    getFieldProps,
    errors,
    touched,
  } = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
  });

  const handleChangeInputAmount = (increase: boolean) => () => {
    const newValue = increase
      ? values.investmentAmount + 1
      : values.investmentAmount - 1;
    setFieldValue(Fields.AMOUNT, newValue);
  };

  const closePopup = () => {
    setFieldValue(Fields.OPERATION, null);
  };

  const openConfirmBuyingPopup = (operationType: AskBidEnum) => () => {
    setFieldValue(Fields.OPERATION, operationType);
  };

  const confirmBuying = () => {
    submitForm();
  };

  const [investedAmountDropdown, toggleInvestemAmountDropdown] = useState(
    false
  );
  const investAmountRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    toggleInvestemAmountDropdown(!investedAmountDropdown);
  };

  const handleClickOutside = (e: any) => {
    if (
      investAmountRef.current &&
      !investAmountRef.current.contains(e.target)
    ) {
      toggleInvestemAmountDropdown(false);
    }
  };

  const investOnBeforeInputHandler = (e: any) => {
    if ([',', '.'].includes(e.data)) {
      if (
        !e.currentTarget.value ||
        (e.currentTarget.value && e.currentTarget.value.includes('.'))
      ) {
        e.preventDefault();
        return;
      }
    }
    if (!e.data.match(/^\d|\.|\,/)) {
      e.preventDefault();
      return;
    }
  };

  const investOnChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let filteredValue = e.target.value.replace(',', '.');
    setFieldValue('investmentAmount', filteredValue);
  };

  const investOnFocusHandler = () => {
    setFieldError(Fields.AMOUNT, '');
    toggleInvestemAmountDropdown(true);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <FlexContainer padding="16px" flexDirection="column">
      <Observer>
        {() => <>{badRequestPopupStore.isActive && <BadRequestPopup />}</>}
      </Observer>
      <CustomForm autoComplete="off" onSubmit={handleSubmit}>
        <FlexContainer
          justifyContent="space-between"
          flexWrap="wrap"
          margin="0 0 4px 0"
          alignItems="center"
        >
          <PrimaryTextSpan
            fontSize="11px"
            lineHeight="12px"
            textTransform="uppercase"
            color="rgba(255, 255, 255, 0.3)"
          >
            Invest
          </PrimaryTextSpan>
          <InformationPopup
            bgColor="#000000"
            classNameTooltip="invest"
            width="212px"
            direction="left"
          >
            <PrimaryTextSpan color="#fffccc" fontSize="12px">
              The amount you’d like to invest
            </PrimaryTextSpan>
          </InformationPopup>
        </FlexContainer>
        <InvestedAmoutInputWrapper
          padding="0 0 0 4px"
          margin="0 0 14px 0"
          position="relative"
          alignItems="center"
          zIndex="100"
        >
          {touched.investmentAmount && errors.investmentAmount && (
            <ErropPopup
              textColor="#fffccc"
              bgColor={ColorsPallete.RAZZMATAZZ}
              classNameTooltip={Fields.AMOUNT}
              direction="left"
            >
              {errors.investmentAmount}
            </ErropPopup>
          )}
          <PrimaryTextSpan fontWeight="bold" marginRight="2px">
            {mainAppStore.activeAccount?.symbol}
          </PrimaryTextSpan>

          <FlexContainer alignItems="center" ref={investAmountRef}>
            <InvestInput
              {...getFieldProps(Fields.AMOUNT)}
              onBeforeInput={investOnBeforeInputHandler}
              onChange={investOnChangeHandler}
              onFocus={investOnFocusHandler}
            />
            {investedAmountDropdown && (
              <InvestAmountDropdown
                toggle={handleToggle}
                setFieldValue={setFieldValue}
              />
            )}
            <PlusMinusButtonWrapper flexDirection="column">
              <PlusButton type="button" onClick={handleChangeInputAmount(true)}>
                <PrimaryTextSpan fontWeight="bold">&#43;</PrimaryTextSpan>
              </PlusButton>
              <MinusButton
                type="button"
                onClick={handleChangeInputAmount(false)}
                disabled={values.investmentAmount === 0}
              >
                <PrimaryTextSpan fontWeight="bold">&minus;</PrimaryTextSpan>
              </MinusButton>
            </PlusMinusButtonWrapper>
          </FlexContainer>
        </InvestedAmoutInputWrapper>
        <FlexContainer
          justifyContent="space-between"
          flexWrap="wrap"
          margin="0 0 4px 0"
          alignItems="center"
        >
          <PrimaryTextSpan
            fontSize="11px"
            lineHeight="12px"
            textTransform="uppercase"
            color="rgba(255, 255, 255, 0.3)"
          >
            Multiplier
          </PrimaryTextSpan>
          <InformationPopup
            bgColor="#000000"
            classNameTooltip="leverage"
            width="212px"
            direction="left"
          >
            <PrimaryTextSpan color="#fffccc" fontSize="12px">
              The amount you’d like to invest
            </PrimaryTextSpan>
          </InformationPopup>
        </FlexContainer>
        <MultiplierDropdown
          multipliers={instrument.multiplier}
          selectedMultiplier={values.multiplier}
          setFieldValue={setFieldValue}
        ></MultiplierDropdown>
        <FlexContainer
          justifyContent="space-between"
          flexWrap="wrap"
          margin="0 0 4px 0"
          alignItems="center"
        >
          <PrimaryTextSpan
            fontSize="11px"
            lineHeight="12px"
            textTransform="uppercase"
            color="rgba(255, 255, 255, 0.3)"
          >
            Autoclose
          </PrimaryTextSpan>
          <InformationPopup
            bgColor="#000000"
            classNameTooltip="autoclose"
            width="212px"
            direction="left"
          >
            <PrimaryTextSpan color="#fffccc" fontSize="12px">
              The amount you’d like to invest
            </PrimaryTextSpan>
          </InformationPopup>
        </FlexContainer>
        <FlexContainer position="relative" flexDirection="column">
          {(touched.sl && errors.sl) ||
            (touched.tp && errors.tp && (
              <ErropPopup
                textColor="#fffccc"
                bgColor={ColorsPallete.RAZZMATAZZ}
                classNameTooltip={Fields.AMOUNT}
                direction="left"
              >
                {errors.sl || errors.tp}
              </ErropPopup>
            ))}
          <AutoClosePopup
            setFieldValue={setFieldValue}
            setFieldError={setFieldError}
            values={values}
          ></AutoClosePopup>
        </FlexContainer>

        <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
          <PrimaryTextSpan
            fontSize="11px"
            lineHeight="12px"
            textTransform="uppercase"
            color="rgba(255, 255, 255, 0.3)"
          >
            VOLUME
          </PrimaryTextSpan>
          <Observer>
            {() => (
              <PrimaryTextSpan fontSize="12px" color="#fffccc">
                {mainAppStore.activeAccount?.symbol}
                {values.investmentAmount * values.multiplier}
              </PrimaryTextSpan>
            )}
          </Observer>
        </FlexContainer>
        <FlexContainer justifyContent="space-between" margin="0 0 12px 0">
          <PrimaryTextSpan
            fontSize="11px"
            lineHeight="12px"
            textTransform="uppercase"
            color="rgba(255, 255, 255, 0.3)"
          >
            Spread
          </PrimaryTextSpan>
          <Observer>
            {() => (
              <>
                {quotesStore.quotes[instrument.id] && (
                  <PrimaryTextSpan fontSize="12px" color="#fffccc">
                    {/* {mainAppStore.activeAccount?.symbol} */}
                    {Math.abs(
                      quotesStore.quotes[instrument.id].bid.c -
                        quotesStore.quotes[instrument.id].ask.c
                    ).toFixed(instrument.digits)}
                  </PrimaryTextSpan>
                )}
              </>
            )}
          </Observer>
        </FlexContainer>
        <FlexContainer flexDirection="column" position="relative">
          {values.operation !== null && (
            <ConfirmPopupWrapper position="absolute" right="100%" top="0px">
              <ConfirmationPopup
                closePopup={closePopup}
                applyHandler={confirmBuying}
                values={values}
                digits={instrument.digits}
                instrumentId={instrument.id}
              ></ConfirmationPopup>
            </ConfirmPopupWrapper>
          )}
          <ButtonBuy
            type="button"
            onClick={openConfirmBuyingPopup(AskBidEnum.Buy)}
          >
            <FlexContainer margin="0 8px 0 0">
              <SvgIcon {...IconShevronBuy} fillColor="#003A38"></SvgIcon>
            </FlexContainer>
            Buy
          </ButtonBuy>
          <ButtonSell
            type="button"
            onClick={openConfirmBuyingPopup(AskBidEnum.Sell)}
          >
            <FlexContainer margin="0 8px 0 0">
              <SvgIcon {...IconShevronSell} fillColor="#fff"></SvgIcon>
            </FlexContainer>
            Sell
          </ButtonSell>
        </FlexContainer>
        <FlexContainer
          justifyContent="space-between"
          flexWrap="wrap"
          margin="0 0 4px 0"
        >
          <PrimaryTextSpan
            fontSize="11px"
            lineHeight="12px"
            textTransform="uppercase"
            color="rgba(255, 255, 255, 0.3)"
          >
            Purchase at
          </PrimaryTextSpan>
          <InformationPopup
            bgColor="#000000"
            classNameTooltip="purchase-at"
            width="212px"
            direction="left"
          >
            <PrimaryTextSpan color="#fffccc" fontSize="12px">
              The amount you’d like to invest
            </PrimaryTextSpan>
          </InformationPopup>
        </FlexContainer>
        <PurchaseAtPopup
          setFieldValue={setFieldValue}
          purchaseAtValue={values.purchaseAt}
          instrumentId={instrument.id}
          digits={instrument.digits}
        ></PurchaseAtPopup>
      </CustomForm>
    </FlexContainer>
  );
};

export default BuySellPanel;

const InvestInput = styled.input`
  height: 100%;
  width: 100%;
  outline: none;
  border: none;
  background-color: transparent;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  color: #fffccc;
`;

const ButtonSell = styled(ButtonWithoutStyles)`
  background-color: #ed145b;
  border-radius: 4px;
  height: 56px;
  color: #fff;
  font-weight: bold;
  font-size: 20px;
  line-height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 18px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #ff557e;
  }

  &:focus {
    background-color: #bd1d51;
  }

  &:disabled {
    background-color: rgba(255, 255, 255, 0.04);
  }
`;

const ButtonBuy = styled(ButtonSell)`
  background-color: #00ffdd;
  box-shadow: 0px 4px 8px rgba(0, 255, 242, 0.17),
    inset 0px -3px 6px rgba(0, 255, 242, 0.26);
  color: #003a38;
  margin-bottom: 8px;

  &:hover {
    background-color: #9ffff2;
  }

  &:focus {
    background-color: #21b3a4;
  }

  &:disabled {
    background-color: rgba(255, 255, 255, 0.04);
  }
`;

const CustomForm = styled.form`
  margin: 0;
`;

const InvestedAmoutInputWrapper = styled(FlexContainer)`
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.06);

  &:focus-within {
    border: 1px solid #21b3a4;
  }
`;

const MinusButton = styled(ButtonWithoutStyles)`
  display: flex;
  width: 26px;
  height: 19px;
  padding: 2px 8px;
  justify-content: center;
  align-items: center;
`;

const PlusButton = styled(MinusButton)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const PlusMinusButtonWrapper = styled(FlexContainer)`
  border-left: 1px solid rgba(255, 255, 255, 0.1);
`;

const fadein = keyframes`
  from {
    opacity: 0;
    visibility: visible;
  }
  to {
    opacity: 1;
    visibility: visible;
  }
`;
const ConfirmPopupWrapper = styled(FlexContainer)`
  animation: ${fadein} 0.2s ease forwards;

  @media (max-height: 700px) {
    top: -40px;
  }
`;
