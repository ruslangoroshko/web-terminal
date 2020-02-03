import React, { ChangeEvent } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import SvgIcon from '../SvgIcon';
import IconShevronBuy from '../../assets/svg/icon-buy-sell-shevron-buy.svg';
import IconShevronSell from '../../assets/svg/icon-buy-sell-shevron-sell.svg';
import AutoClosePopup from './AutoClosePopup';
import PurchaseAtPopup from './PurchaseAtPopup';
import * as yup from 'yup';
import {
  OpenPositionModel,
  OpenPositionModelFormik,
} from '../../types/Positions';
import { InstrumentModelWSDTO } from '../../types/Instruments';
import { AskBidEnum } from '../../enums/AskBid';
import API from '../../helpers/API';
import InformationPopup from '../InformationPopup';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { Formik, Field, FieldProps, Form } from 'formik';
import Fields from '../../constants/fields';
import { useStores } from '../../hooks/useStores';
import ColorsPallete from '../../styles/colorPallete';
import ErropPopup from '../ErropPopup';
import MultiplierDropdown from './MultiplierDropdown';
import InvestAmountDropdown from './InvestAmountDropdown';
import { Observer } from 'mobx-react-lite';
import { getProcessId } from '../../helpers/getProcessId';
import { AutoCloseTypesEnum } from '../../enums/AutoCloseTypesEnum';
import ConfirmationPopup from './ConfirmationPopup';
import { keyframes } from '@emotion/core';

// TODO: too much code, refactor
interface Props {
  currencySymbol: string;
  accountId: OpenPositionModel['accountId'];
  instrument: InstrumentModelWSDTO;
  digits: number;
}

function BuySellPanel(props: Props) {
  const { currencySymbol, accountId, instrument, digits } = props;
  const { quotesStore } = useStores();

  const initialValues: OpenPositionModelFormik = {
    processId: getProcessId(),
    accountId,
    instrumentId: instrument.id,
    operation: null,
    multiplier: instrument.multiplier[0],
    investmentAmount: '50',
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
        'Minimum trade volume [$1]. Please increase your trade amount or multiplier.'
      )
      .lessThan(
        quotesStore.available,
        `Insufficient funds to open a position. You have only [${quotesStore.available}]`
      )
      .max(
        instrument.maxOperationVolume / initialValues.multiplier,
        'Maximum trade volume [$10000]. Please decrease your trade amount or multiplier.'
      )
      .required('Please fill Invest amount'),
    multiplier: yup.number().required('Required amount'),
    tp: yup.number().nullable(),
    sl: yup.number().nullable(),
    purchaseAt: yup.number().nullable(),
  });

  const investOnBeforeInputHandler = (e: any) => {
    if (e.currentTarget.value && [',', '.'].includes(e.data)) {
      if (e.currentTarget.value.includes('.')) {
        e.preventDefault();
        return;
      }
    }
    if (!e.data.match(/^\d|\.|\,/)) {
      e.preventDefault();
      return;
    }
  };

  const investOnChangeHandler = (setFieldValue: any) => (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    let filteredValue = e.target.value.replace(',', '.');
    setFieldValue(Fields.AMOUNT, filteredValue);
  };

  const invsetOnBlurHanlder = (setFieldValue: any, value: string) => () => {
    setFieldValue(Fields.AMOUNT, +value);
  };

  const handleSubmit = (values: OpenPositionModelFormik, actions: any) => {
    actions.setSubmitting(false);
    const { SLTPType, sl, tp, ...otherValues } = values;

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
      ...values,
      [fieldForTakeProfit]: tp,
      [fieldForStopLoss]: sl,
    };

    if (values.purchaseAt) {
      API.openPendingOrder(modelToSubmit);
    } else {
      API.openPosition(modelToSubmit);
    }
  };

  const calculateVolume = (values: OpenPositionModelFormik) => {
    return +values.investmentAmount;
  };

  const handleChangeInputAmount = (
    setFieldValue: any,
    value: any,
    increase = false
  ) => () => {
    const newValue = increase ? +value + 1 : +value - 1;
    setFieldValue(Fields.AMOUNT, newValue);
  };

  const closePopup = (setFieldValue: any) => () => {
    setFieldValue(Fields.OPERATION, null);
  };

  const openConfirmBuyingPopup = (
    setFieldValue: any,
    operationType: AskBidEnum
  ) => () => {
    setFieldValue(Fields.OPERATION, operationType);
  };

  const confirmBuying = (
    submitForm: () => Promise<void>,
    resetForm: () => void
  ) => () => {
    submitForm().then(() => {
      resetForm();
    });
  };

  return (
    <FlexContainer padding="16px" flexDirection="column">
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        enableReinitialize
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ setFieldValue, values, errors, submitForm, resetForm }) => (
          <CustomForm autoComplete="off">
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
            <Field type="text" name={Fields.AMOUNT}>
              {({ field, meta }: FieldProps) => (
                <InvestedAmoutInputWrapper
                  padding="0 0 0 4px"
                  margin="0 0 14px 0"
                  position="relative"
                  alignItems="center"
                  zIndex="100"
                >
                  {meta.touched && meta.error && (
                    <ErropPopup
                      textColor="#fffccc"
                      bgColor={ColorsPallete.RAZZMATAZZ}
                      classNameTooltip={Fields.AMOUNT}
                    >
                      {meta.error}
                    </ErropPopup>
                  )}
                  <PrimaryTextSpan fontWeight="bold" marginRight="2px">
                    {currencySymbol}
                  </PrimaryTextSpan>

                  <FlexContainer alignItems="center">
                    <InvestInput
                      {...field}
                      onBeforeInput={investOnBeforeInputHandler}
                      onChange={investOnChangeHandler(setFieldValue)}
                      onBlur={invsetOnBlurHanlder(
                        setFieldValue,
                        values.investmentAmount
                      )}
                    />
                    <InvestAmountDropdown
                      setFieldValue={setFieldValue}
                      symbol={currencySymbol}
                    />
                    <PlusMinusButtonWrapper flexDirection="column">
                      <PlusButton
                        type="button"
                        onClick={handleChangeInputAmount(
                          setFieldValue,
                          values.investmentAmount,
                          true
                        )}
                      >
                        <PrimaryTextSpan fontWeight="bold">
                          &#43;
                        </PrimaryTextSpan>
                      </PlusButton>
                      <MinusButton
                        type="button"
                        onClick={handleChangeInputAmount(
                          setFieldValue,
                          values.investmentAmount
                        )}
                        disabled={+values.investmentAmount === 0}
                      >
                        <PrimaryTextSpan fontWeight="bold">
                          &minus;
                        </PrimaryTextSpan>
                      </MinusButton>
                    </PlusMinusButtonWrapper>
                  </FlexContainer>
                </InvestedAmoutInputWrapper>
              )}
            </Field>
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
                Leverage
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
            <AutoClosePopup
              setFieldValue={setFieldValue}
              values={values}
              currencySymbol={currencySymbol}
            ></AutoClosePopup>
            <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
              <PrimaryTextSpan
                fontSize="11px"
                lineHeight="12px"
                textTransform="uppercase"
                color="rgba(255, 255, 255, 0.3)"
              >
                VOLUME
              </PrimaryTextSpan>
              <PrimaryTextSpan fontSize="12px" color="#fffccc">
                {currencySymbol}
                {calculateVolume(values)}
              </PrimaryTextSpan>
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
                  <PrimaryTextSpan fontSize="12px" color="#fffccc">
                    {currencySymbol}
                    {Math.abs(
                      quotesStore.quotes[instrument.id].bid.c -
                        quotesStore.quotes[instrument.id].ask.c
                    ).toFixed(digits)}
                  </PrimaryTextSpan>
                )}
              </Observer>
            </FlexContainer>
            <FlexContainer flexDirection="column" position="relative">
              {values.operation !== null && (
                <ConfirmPopupWrapper
                  position="absolute"
                  right="100%"
                  top="20px"
                >
                  <ConfirmationPopup
                    closePopup={closePopup(setFieldValue)}
                    applyHandler={confirmBuying(submitForm, resetForm)}
                  ></ConfirmationPopup>
                </ConfirmPopupWrapper>
              )}

              <ButtonBuy
                type="button"
                onClick={openConfirmBuyingPopup(setFieldValue, AskBidEnum.Buy)}
              >
                <FlexContainer margin="0 8px 0 0">
                  <SvgIcon {...IconShevronBuy} fillColor="#003A38"></SvgIcon>
                </FlexContainer>
                Buy
              </ButtonBuy>
              <ButtonSell
                type="button"
                onClick={openConfirmBuyingPopup(setFieldValue, AskBidEnum.Buy)}
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
              currencySymbol={currencySymbol}
            ></PurchaseAtPopup>
          </CustomForm>
        )}
      </Formik>
    </FlexContainer>
  );
}

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

  &:focus + .investAmountDropdown {
    opacity: 1;
    visibility: visible;
  }
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

const CustomForm = styled(Form)`
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
`;
