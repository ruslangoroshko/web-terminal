import React, { useState, useEffect } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import {
  PrimaryTextParagraph,
  PrimaryTextSpan,
} from '../../styles/TextsElements';
import styled from '@emotion/styled';

import { useStores } from '../../hooks/useStores';
import AmountPlaceholder from './AmountPlaceholder';
import CurrencyDropdown from './CurrencyDropdown';
import { paymentCurrencies } from '../../constants/paymentCurrencies';
import { PrimaryButton } from '../../styles/Buttons';
import API from '../../helpers/API';
import { DepositApiResponseCodes } from '../../enums/DepositApiResponseCodes';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../../constants/mixpanelEvents';
import mixapanelProps from '../../constants/mixpanelProps';
import depositMethod from '../../constants/depositMethod';
import depositApiResponseCodeMessages from '../../constants/depositApiResponseCodeMessages';

const BankTransferForm = () => {
  const [currency, setCurrency] = useState(paymentCurrencies[0]);
  const placeholderValues = [250, 500, 1000];

  const { t } = useTranslation();

  const validationSchema = yup.object().shape({
    amount: yup
      .number()
      .min(50, 'min: $50')
      .max(1000, 'max: $1000')
      .required('min: $50'),
  });
  const initialValues = {
    amount: 500,
  };

  const { mainAppStore, badRequestPopupStore, notificationStore } = useStores();

  const investOnBeforeInputHandler = (e: any) => {
    const currTargetValue = e.currentTarget.value;
    if ([',', '.'].includes(e.data)) {
      e.preventDefault();
      return;
    }
    if (!e.data.match(/^\d|\.|\,/)) {
      e.preventDefault();
      return;
    }
    const regex = /^[0-9]{1,15}/;
    if (e.data.length > 1 && !currTargetValue.match(regex)) {
      e.preventDefault();
      return;
    }
  };

  const handleSubmitForm = async () => {
    const params = {
      paymentMethod: 'BANK_CARDS',
      depositSum: +values.amount,
      currency: 'USD',
      accountId: mainAppStore.accounts.find(item => item.isLive)?.id || '',
    };
    try {
      const response = await API.createDeposit(params);
      if (response.status === DepositApiResponseCodes.Success) {
        mixpanel.track(mixpanelEvents.DEPOSIT, {
          [mixapanelProps.AMOUNT]: +values.amount,
          [mixapanelProps.DEPOSIT_METHOD]: depositMethod.BANK_CARD,
          [mixapanelProps.ACCOUNT_ID]: mainAppStore.activeAccount?.isLive
            ? mainAppStore.activeAccount.id
            : mainAppStore.accounts.find(item => item.isLive)?.id || '',
        });
        window.location.href = response.redirectUrl;
      } else if (response.status === DepositApiResponseCodes.PaymentDisabled){
        notificationStore.setNotification(
          t(depositApiResponseCodeMessages[response.status])
        );
        notificationStore.setIsSuccessfull(false);
        notificationStore.openNotification();
      } else {
        mixpanel.track(mixpanelEvents.DEPOSIT_FAILED, {
          [mixapanelProps.SERVER_ERROR]: response.status
        });
        badRequestPopupStore.setMessage(t('Technical error'));
        badRequestPopupStore.openModal();
      }
    } catch (error) {
    }
  };

  const {
    values,
    setFieldValue,
    validateForm,
    handleChange,
    handleSubmit,
    errors,
    isSubmitting,
  } = useFormik({
    initialValues,
    onSubmit: handleSubmitForm,
    validationSchema,
    validateOnBlur: true,
    validateOnChange: true,
  });

  const handleChangeAmount = (e: any) => {
    if (e.target.value.length === 15) {
      return;
    }
    handleChange(e);
  };

  const handlerClickSubmit = async () => {
    const curErrors = await validateForm();
    const curErrorsKeys = Object.keys(curErrors);
    if (curErrorsKeys.length) {
      const el = document.getElementById(curErrorsKeys[0]);
      if (el) el.focus();
    }
  };

  useEffect(() => {
    mixpanel.track(mixpanelEvents.DEPOSIT_METHOD_VIEW, {
      [mixapanelProps.DEPOSIT_METHOD]: depositMethod.BANK_CARD,
    });
  }, []);

  return (
    <FlexContainer flexDirection="column" padding="32px 0 0 68px">
      <form noValidate onSubmit={handleSubmit}>
        <PrimaryTextParagraph
          textTransform="uppercase"
          fontSize="11px"
          color="rgba(255,255,255,0.3)"
          marginBottom="6px"
        >
          {t('Amount')}
        </PrimaryTextParagraph>

        <FlexContainer
          borderRadius="4px"
          border="1px solid #FFFCCC"
          backgroundColor="#292C33"
          marginBottom="10px"
          maxHeight="48px"
          alignItems="center"
          position="relative"
        >
          <CurrencyDropdown
            disabled={true}
            width="120px"
            handleSelectCurrency={setCurrency}
            selectedCurrency={currency}
          ></CurrencyDropdown>
          <Input
            value={values.amount}
            onChange={handleChangeAmount}
            onBeforeInput={investOnBeforeInputHandler}
            name="amount"
            id="amount"
          />
          {errors.amount && <ErrorText>{errors.amount}</ErrorText>}
        </FlexContainer>

        <FlexContainer marginBottom="92px">
          {placeholderValues.map(item => (
            <AmountPlaceholder
              key={item}
              isActive={item === values.amount}
              value={item}
              currencySymbol={`${mainAppStore.activeAccount?.symbol}`}
              handleClick={() => {
                setFieldValue('amount', item);
              }}
            />
          ))}
        </FlexContainer>

        

        <FlexContainer marginBottom="40px">
          <PrimaryButton
            padding="12px 20px"
            width="100%"
            onClick={handlerClickSubmit}
            disabled={isSubmitting}
          >
            <PrimaryTextSpan color="#003A38" fontSize="14px" fontWeight="bold">
              {t('Deposit')} {mainAppStore.activeAccount?.symbol} (USD) {values.amount}
            </PrimaryTextSpan>
          </PrimaryButton>
        </FlexContainer>
      </form>
    </FlexContainer>
  );
};

export default BankTransferForm;

const ImageBadge = styled.img``;

const Input = styled.input`
  border: none;
  outline: none;
  width: calc(100% - 120px);
  text-align: right;
  height: 48px;
  color: #fffccc;
  font-size: 14px;
  font-weight: bold;
  padding: 24px 16px;
  padding-left: 100px;
  background-color: transparent;
  border-right: 1px solid rgba(255, 255, 255, 0.19);
`;

const ErrorText = styled.span`
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  color: #ff557e;
  position: absolute;
  top: 50%;
  right: 95px;
  transform: translateY(-50%);
`;
