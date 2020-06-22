import React, { useState, useEffect } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import {
  PrimaryTextParagraph,
  PrimaryTextSpan,
} from '../../styles/TextsElements';
import styled from '@emotion/styled';
import MastercardIdCheckImage from '../../assets/images/mastercard-id-check.png';
import SslCertifiedImage from '../../assets/images/ssl-certified.png';
import VisaSecureImage from '../../assets/images/visa-secure.png';
import { useStores } from '../../hooks/useStores';
import AmountPlaceholder from './AmountPlaceholder';
import CurrencyDropdown from './CurrencyDropdown';
import { paymentCurrencies } from '../../constants/paymentCurrencies';
import Checkbox from '../Checkbox';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '../../styles/Buttons';
import API from '../../helpers/API';
import { DepositApiResponseCodes } from '../../enums/DepositApiResponseCodes';
import * as yup from 'yup';
import { useFormik, Form } from 'formik';

const VisaMasterCardForm = () => {
  const [currency, setCurrency] = useState(paymentCurrencies[0]);
  const placeholderValues = [250, 500, 1000];

  const validationSchema = yup.object().shape({
    amount: yup
      .number()
      .required('min: $50')
      .transform(value => (isNaN(value) ? undefined : value))
      .min(50, 'min: $50')
      .max(1000, 'max: $1000')
      .integer('min: $50')
      .positive('min: $50'),
  });
  const initialValues = {
    amount: 500,
  };

  const { mainAppStore, notificationStore, badRequestPopupStore } = useStores();

  const investOnBeforeInputHandler = (e: any) => {
    if ([',', '.'].includes(e.data)) {
      e.preventDefault();
      return;
    }
    if (!e.data.match(/^\d|\.|\,/)) {
      e.preventDefault();
      return;
    }
  };

  const handleSubmitForm = async () => {
    const params = {
      paymentMethod: 'BANK_CARDS',
      depositSum: values.amount,
      currency: 'USD',
      authToken: mainAppStore.token || '',
      accountId: mainAppStore.accounts.find(item => item.isLive)?.id || ''
    };
    try {
      const response = await API.createDeposit(params);
      if (response.status === DepositApiResponseCodes.Success) {
        window.location.href = response.redirectUrl;
      } else {
        badRequestPopupStore.setMessage('Technical error');
        badRequestPopupStore.openModal();
      }
    } catch (error) {
      badRequestPopupStore.setMessage(error);
      badRequestPopupStore.openModal();
    }
  };

  const {
    values,
    setFieldError,
    setFieldValue,
    validateForm,
    handleChange,
    handleSubmit,
    errors,
    touched,
    isSubmitting,
  } = useFormik({
    initialValues,
    onSubmit: handleSubmitForm,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: true,
  });

  const handlerClickSubmit = async () => {
    const curErrors = await validateForm();
    const curErrorsKeys = Object.keys(curErrors);
    if (curErrorsKeys.length) {
      const el = document.getElementById(curErrorsKeys[0]);
      if (el) el.focus();
    }
  };

  return (
    <FlexContainer flexDirection="column" padding="32px 0 0 68px">
      <form noValidate onSubmit={handleSubmit}>
        <PrimaryTextParagraph
          textTransform="uppercase"
          fontSize="11px"
          color="rgba(255,255,255,0.3)"
          marginBottom="6px"
        >
          Amount
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
          <Input
            value={values.amount}
            onChange={handleChange}
            onBeforeInput={investOnBeforeInputHandler}
            name="amount"
            id="amount"
          />
          {errors.amount && (
            <ErrorText>{errors.amount}</ErrorText>
          )}
          <CurrencyDropdown
            disabled={true}
            width="80px"
            handleSelectCurrency={setCurrency}
            selectedCurrency={currency}
          ></CurrencyDropdown>
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

        <FlexContainer
          alignItems="center"
          justifyContent="space-around"
          marginBottom="20px"
        >
          <ImageBadge src={SslCertifiedImage} width={120}></ImageBadge>
          <ImageBadge src={MastercardIdCheckImage} width={110}></ImageBadge>
          <ImageBadge src={VisaSecureImage} width={28}></ImageBadge>
        </FlexContainer>

        <FlexContainer marginBottom="40px">
          <PrimaryButton
            padding="12px 20px"
            width="100%"
            onClick={handlerClickSubmit}
            disabled={isSubmitting}
          >
            <PrimaryTextSpan color="#003A38" fontSize="14px" fontWeight="bold">
              Deposit {mainAppStore.activeAccount?.symbol}
              {values.amount}
            </PrimaryTextSpan>
          </PrimaryButton>
        </FlexContainer>
      </form>
    </FlexContainer>
  );
};

export default VisaMasterCardForm;

const ImageBadge = styled.img``;

const Input = styled.input`
  border: none;
  outline: none;
  width: calc(100% - 80px);
  height: 48px;
  color: #fffccc;
  font-size: 14px;
  font-weight: bold;
  padding: 24px 16px;
  padding-right: 100px;
  background-color: transparent;
  border-right: 1px solid rgba(255, 255, 255, 0.19);
`;

const LearnMoreLink = styled(Link)`
  color: #fffccc;
  line-height: 120%;
  &:hover {
    color: #fffccc;
  }
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