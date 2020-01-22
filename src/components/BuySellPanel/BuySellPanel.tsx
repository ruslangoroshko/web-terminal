import React, { ChangeEvent } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import MaskedInput from 'react-text-mask';
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
import { darken } from 'polished';
import { getProcessId } from '../../helpers/getProcessId';
import { AutoCloseTypesEnum } from '../../enums/AutoCloseTypesEnum';

interface Props {
  currencySymbol: string;
  accountId: OpenPositionModel['accountId'];
  instrument: InstrumentModelWSDTO;
  digits: number;
}

interface OpenModel {
  sl: OpenPositionModel['sl'];
  tp: OpenPositionModel['tp'];
  investmentAmount: OpenPositionModel['investmentAmount'];
  multiplier: OpenPositionModel['multiplier'];
}

function BuySellPanel(props: Props) {
  const { currencySymbol, accountId, instrument, digits } = props;

  const initialValues: OpenPositionModelFormik = {
    processId: getProcessId(),
    accountId,
    instrumentId: instrument.id,
    operation: AskBidEnum.Buy,
    multiplier: instrument.multiplier[0],
    investmentAmount: '',
    SLTPType: AutoCloseTypesEnum.Profit,
    sl: null,
    tp: null,
    purchaseAt: null,
  };

  const validationSchema = yup.object().shape<OpenModel>({
    investmentAmount: yup
      .number()
      .min(
        instrument.minOperationVolume / initialValues.multiplier,
        'minOperationVolume'
      )
      .max(
        instrument.maxOperationVolume / initialValues.multiplier,
        'maxOperationVolume'
      )
      .required('Required amount'),
    multiplier: yup.number().required('Required amount'),
    tp: yup.number(),
    sl: yup.number(),
  });

  const handleOpenPosition = (
    submitForm: () => Promise<void>,
    operation: AskBidEnum,
    setFieldValue: any
  ) => () => {
    setFieldValue(Fields.OPERATION, operation);
    submitForm();
  };

  const investOnBeforeInputHandler = (prevValue: string) => (e: any) => {
    if (prevValue && [',', '.'].includes(e.data)) {
      if (prevValue.includes('.')) {
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

  const { quotesStore } = useStores();

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
        {({ setFieldValue, values, submitForm }) => (
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
                      ue is higher or lower than the one currently allowed
                    </ErropPopup>
                  )}
                  <PrimaryTextSpan fontWeight="bold" marginRight="2px">
                    {currencySymbol}
                  </PrimaryTextSpan>

                  <FlexContainer alignItems="center">
                    <InvestInput
                      {...field}
                      onBeforeInput={investOnBeforeInputHandler(
                        values.investmentAmount
                      )}
                      onChange={investOnChangeHandler(setFieldValue)}
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
            <FlexContainer flexDirection="column">
              <ButtonBuy
                type="button"
                onClick={handleOpenPosition(
                  submitForm,
                  AskBidEnum.Buy,
                  setFieldValue
                )}
              >
                <FlexContainer margin="0 8px 0 0">
                  <SvgIcon {...IconShevronBuy} fillColor="#003A38"></SvgIcon>
                </FlexContainer>
                Buy
              </ButtonBuy>
              <ButtonSell
                type="button"
                onClick={handleOpenPosition(
                  submitForm,
                  AskBidEnum.Sell,
                  setFieldValue
                )}
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
