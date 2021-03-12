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
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../../constants/mixpanelEvents';
import mixapanelProps from '../../constants/mixpanelProps';
import depositMethod from '../../constants/depositMethod';

import { CreateElectronicFundsInvoiceParams } from '../../types/DepositTypes';
import depositResponseMessages from '../../constants/depositResponseMessages';
import { useHistory } from 'react-router-dom';
import { DepositRequestStatusEnum } from '../../enums/DepositRequestStatusEnum';
import PreloaderButtonMask from '../PreloaderButtonMask';
import Page from '../../constants/Pages';
import { getProcessId } from '../../helpers/getProcessId';

const ElectronicFundsTransfer = () => {
  const [currency, setCurrency] = useState(paymentCurrencies[0]);
  const [loading, setLoading] = useState(false);

  const placeholderValues = [250, 500, 1000];

  const { t } = useTranslation();
  const { push } = useHistory();
  const validationSchema = yup.object().shape({
    amount: yup
      .number()
      .min(10, t('min: $10'))
      .max(10000, t('max: $10 000'))
      .required(t('Required field')),
  });

  const initialValues = {
    amount: 500,
  };

  const { mainAppStore, notificationStore, depositFundsStore } = useStores();

  const investOnBeforeInputHandler = (e: any) => {
    const currTargetValue = e.currentTarget.value;

    if (!e.data.match(/^[0-9.]*$/g)) {
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
    const regex = /^[0-9]{1,15}([.][0-9]{1,2})?$/;
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

  const handleSubmitForm = async (values: any) => {
    setLoading(true);

    const params: CreateElectronicFundsInvoiceParams = {
      ...values,
      amount: +values.amount,
      processId: getProcessId(),
      accountId: mainAppStore.accounts.find((acc) => acc.isLive)?.id || ''
    };

    try {
      const result = await API.createElectronicTransferInvoice(params);

      switch (result.status) {
        case DepositRequestStatusEnum.Success:
          const hiddenAnchor = document.getElementById('hidden-anchor');
          if (hiddenAnchor) {
            hiddenAnchor.setAttribute('href', result.data.redirectLink);
            hiddenAnchor.click();
          }

          break;

        case DepositRequestStatusEnum.PaymentDeclined:
          // TODO: Refactor
          depositFundsStore.togglePopup();
          push('/?status=failed');
          mixpanel.track(mixpanelEvents.DEPOSIT_FAILED, {
            [mixapanelProps.ERROR_TEXT]: result.status,
          });
          break;

        default:
          notificationStore.setIsSuccessfull(false);
          notificationStore.setNotification(t(
            depositResponseMessages[result.status]
          ));
          notificationStore.openNotification();
          mixpanel.track(mixpanelEvents.DEPOSIT_FAILED, {
            [mixapanelProps.ERROR_TEXT]: result.status,
          });
          break;
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      push(Page.DEPOSIT_POPUP);
    }
  };

  const {
    values,
    setFieldValue,
    validateForm,
    handleSubmit,
    handleChange,
    errors,
    isSubmitting,
  } = useFormik({
    initialValues,
    onSubmit: handleSubmitForm,
    validationSchema,
    validateOnBlur: true,
    validateOnChange: false,
  });

  const handleChangeAmount = (e: any) => {
    if (e.target.value.length === 19) {
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
      <CustomForm autoComplete="on" noValidate onSubmit={handleSubmit}>
        <FlexContainer flexDirection="column">
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
            <Input
              value={values.amount}
              onChange={handleChangeAmount}
              onBeforeInput={investOnBeforeInputHandler}
              name="amount"
              id="amount"
            />
            {errors.amount && <ErrorText>{errors.amount}</ErrorText>}
            <CurrencyDropdown
              disabled={true}
              width="80px"
              handleSelectCurrency={setCurrency}
              selectedCurrency={currency}
            ></CurrencyDropdown>
          </FlexContainer>
        </FlexContainer>

        <FlexContainer marginBottom="60px">
          {placeholderValues.map((item) => (
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
          marginBottom="40px"
          position="relative"
          overflow="hidden"
          borderRadius="8px"
        >
          <PreloaderButtonMask loading={loading} />
          <PrimaryButton
            padding="12px 20px"
            width="100%"
            onClick={handlerClickSubmit}
            disabled={isSubmitting}
          >
            <PrimaryTextSpan
              className="notranslate"
              color="#003A38"
              fontSize="14px"
              fontWeight="bold"
            >
              {t('Deposit')} {mainAppStore.activeAccount?.symbol}
            </PrimaryTextSpan>
            <PrimaryTextSpan
              className="notranslate"
              color="#003A38"
              fontSize="14px"
              fontWeight="bold"
            >
              {values.amount}
            </PrimaryTextSpan>
          </PrimaryButton>
        </FlexContainer>
      </CustomForm>
    </FlexContainer>
  );
};

export default ElectronicFundsTransfer;

const CustomForm = styled.form`
  margin-bottom: 0;
`;

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
