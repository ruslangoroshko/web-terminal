import React, {
  ChangeEvent,
  useRef,
  useEffect,
  FC,
  useState,
  useCallback,
} from 'react';
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
import ConfirmationPopup from './ConfirmationPopup';
import { keyframes } from '@emotion/core';
import { OperationApiResponseCodes } from '../../enums/OperationApiResponseCodes';
import apiResponseCodeMessages from '../../constants/apiResponseCodeMessages';
import { Observer } from 'mobx-react-lite';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../../constants/mixpanelEvents';
import { MixpanelMarketOrder } from '../../types/MixpanelTypes';
import BadRequestPopup from '../BadRequestPopup';
import { TpSlTypeEnum } from '../../enums/TpSlTypeEnum';

// TODO: too much code, refactor

const PRECISION_USD = 2;
const DEFAULT_INVEST_AMOUNT = 10;
const MAX_INPUT_VALUE = 9999999.99;

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

  const initialValues = useCallback(
    () => ({
      processId: getProcessId(),
      accountId: mainAppStore.activeAccount?.id || '',
      instrumentId: instrument.id,
      operation: null,
      multiplier: instrument.multiplier[0],
      investmentAmount: DEFAULT_INVEST_AMOUNT,
      tp: null,
      sl: null,
      slType: null,
      tpType: null,
    }),
    [instrument]
  );

  const currentPriceAsk = useCallback(
    () => quotesStore.quotes[instrument.id].ask.c,
    [quotesStore.quotes[instrument.id].ask.c]
  );
  const currentPriceBid = useCallback(
    () => quotesStore.quotes[instrument.id].bid.c,
    [quotesStore.quotes[instrument.id].bid.c]
  );

  const validationSchema = useCallback(
    () =>
      yup.object().shape({
        investmentAmount: yup
          .number()
          .min(
            instrument.minOperationVolume / initialValues().multiplier,
            `Minimum trade volume $${instrument.minOperationVolume /
              initialValues()
                .multiplier}. Please increase your trade amount or multiplier.`
          )
          .max(
            instrument.maxOperationVolume / initialValues().multiplier,
            `Maximum trade volume $${instrument.maxOperationVolume /
              initialValues()
                .multiplier}. Please decrease your trade amount or multiplier.`
          )
          .test(
            Fields.AMOUNT,
            `Insufficient funds to open a position. You have only $${mainAppStore.activeAccount?.balance}`,
            value => {
              if (value) {
                return value < (mainAppStore.activeAccount?.balance || 0);
              }
              return true;
            }
          )
          .required('Please fill Invest amount'),
        multiplier: yup.number().required('Required amount'),
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
                value => value > currentPriceAsk()
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
                value => value < currentPriceBid()
              ),
          }),
        sl: yup
          .number()
          .nullable()
          .when([Fields.OPERATION, Fields.STOP_LOSS_TYPE], {
            is: (operation, slType) =>
              operation === AskBidEnum.Buy && slType === TpSlTypeEnum.Price,
            then: yup
              .number()
              .nullable()
              .test(
                Fields.STOP_LOSS,
                'Error message: This level is higher or lower than the one currently allowed',
                value => value < currentPriceAsk()
              ),
          })
          .when([Fields.OPERATION, Fields.STOP_LOSS_TYPE], {
            is: (operation, slType) =>
              operation === AskBidEnum.Sell && slType === TpSlTypeEnum.Price,
            then: yup
              .number()
              .nullable()
              .test(
                Fields.STOP_LOSS,
                'Error message: This level is higher or lower than the one currently allowed',
                value => value > currentPriceBid()
              ),
          }),
        openPrice: yup.number().nullable(),
        tpType: yup.number().nullable(),
        slType: yup.number().nullable(),
      }),
    [instrument]
  );

  const onSubmit = async (
    values: OpenPositionModelFormik,
    formikHelpers: FormikHelpers<OpenPositionModelFormik>
  ) => {
    formikHelpers.setSubmitting(true);
    const { operation, ...otherValues } = values;

    if (otherValues.openPrice) {
      const modelToSubmit = {
        ...otherValues,
        operation: operation === null ? AskBidEnum.Buy : operation,
        openPrice: otherValues.openPrice || 0,
        investmentAmount: +otherValues.investmentAmount,
      };
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
      const modelToSubmit = {
        ...otherValues,
        operation: operation === null ? AskBidEnum.Buy : operation,
        investmentAmount: +otherValues.investmentAmount,
      };
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
    resetForm,
    handleSubmit,
    getFieldProps,
    errors,
    touched,
    isSubmitting,
  } = useFormik({
    initialValues: initialValues(),
    onSubmit,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
  });

  useEffect(() => {
    setFieldValue(Fields.INSTRUMNENT_ID, instrument.id);
    setFieldValue(Fields.MULTIPLIER, instrument.multiplier[0]);
  }, [instrument]);

  useEffect(() => {
    setFieldValue(Fields.ACCOUNT_ID, mainAppStore.activeAccount?.id);
  }, [mainAppStore.activeAccount]);

  const handleChangeInputAmount = (increase: boolean) => () => {
    const newValue = increase
      ? Number(+values.investmentAmount + 1).toFixed(PRECISION_USD)
      : values.investmentAmount < 1
      ? 0
      : Number(+values.investmentAmount - 1).toFixed(PRECISION_USD);

    if (newValue <= MAX_INPUT_VALUE) {
      setFieldValue(Fields.AMOUNT, newValue);
    }
  };

  const closePopup = () => {
    setFieldValue(Fields.OPERATION, null);
  };

  const openConfirmBuyingPopup = (operationType: AskBidEnum) => () => {
    setFieldValue(Fields.OPERATION, operationType, false);
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

  // TODO: make one helper for all inputs (autoclose, price at)
  const investOnBeforeInputHandler = (e: any) => {
    const currTargetValue = e.currentTarget.value;

    if (!e.data.match(/^[0-9.,]*$/g)) {
      e.preventDefault();
      return;
    }

    if (!currTargetValue && [',', '.'].includes(e.data)) {
      e.preventDefault();
      return;
    }

    if ([',', '.'].includes(e.data)) {
      if (
        !currTargetValue ||
        (currTargetValue && currTargetValue.includes('.'))
      ) {
        e.preventDefault();
        return;
      }
    }
    // see another regex
    const regex = `^[0-9]{1,7}([,.][0-9]{1,${PRECISION_USD}})?$`;
    const splittedValue =
      currTargetValue.substring(0, e.currentTarget.selectionStart) +
      e.data +
      currTargetValue.substring(e.currentTarget.selectionStart);
    if (
      currTargetValue &&
      ![',', '.'].includes(e.data) &&
      !splittedValue.match(regex)
    ) {
      e.preventDefault();
      return;
    }
    if (e.data.length > 1 && !splittedValue.match(regex)) {
      e.preventDefault();
      return;
    }
  };

  const investOnChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let filteredValue: any = e.target.value.replace(',', '.');
    setFieldValue(Fields.AMOUNT, filteredValue);
  };

  const investOnFocusHandler = () => {
    setFieldError(Fields.AMOUNT, '');
    toggleInvestemAmountDropdown(true);
  };

  const investOnBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    if (
      // TODO: research typings
      // @ts-ignore 
      !investAmountRef.current?.contains(e.relatedTarget) &&
      !values.investmentAmount
    ) {
      setFieldValue(Fields.AMOUNT, DEFAULT_INVEST_AMOUNT);
    }
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
              onBlur={investOnBlurHandler}
            />
            {investedAmountDropdown && (
              <InvestAmountDropdown
                toggle={handleToggle}
                setFieldValue={setFieldValue}
              />
            )}
            <PlusMinusButtonWrapper flexDirection="column">
              <PlusButton
                type="button"
                onClick={handleChangeInputAmount(true)}
              >
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
              The coefficient that multiplies the potential profit and level of
              risk accordingly the value of Multiplier.
            </PrimaryTextSpan>
          </InformationPopup>
        </FlexContainer>
        <Observer>
          {() => (
            <MultiplierDropdown
              multipliers={instrument.multiplier}
              selectedMultiplier={values.multiplier}
              setFieldValue={setFieldValue}
            ></MultiplierDropdown>
          )}
        </Observer>
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
              When the position reached the specified take profit or stop loss
              level, the position will be closed automatically.
            </PrimaryTextSpan>
          </InformationPopup>
        </FlexContainer>
        <FlexContainer position="relative" flexDirection="column">
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
                {(values.investmentAmount * values.multiplier).toFixed(
                  PRECISION_USD
                )}
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
                values={values}
                digits={instrument.digits}
                instrumentId={instrument.id}
                disabled={isSubmitting}
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
              Position will be opened automatically when the price reaches this
              level.
            </PrimaryTextSpan>
          </InformationPopup>
        </FlexContainer>
        <PurchaseAtPopup
          setFieldValue={setFieldValue}
          purchaseAtValue={values.openPrice}
          instrumentId={instrument.id}
          digits={instrument.digits}
        ></PurchaseAtPopup>
      </CustomForm>
    </FlexContainer>
  );
};

export default BuySellPanel;

const InvestInput = styled.input`
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
  will-change: background-color;

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
