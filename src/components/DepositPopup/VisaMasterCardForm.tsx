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
import InputMask from 'react-input-mask';

import LabelBgIcon from '../../assets/svg/icon-triangle-error.svg';

import VisaMasterCardImage from '../../assets/images/visa-master.png';
import SvgIcon from '../SvgIcon';
import { CreateDepositInvoiceParams } from '../../types/DepositTypes';
import moment from 'moment';
import depositResponseMessages from '../../constants/depositResponseMessages';
import { useHistory } from 'react-router-dom';
import { DepositRequestStatusEnum } from '../../enums/DepositRequestStatusEnum';

const VisaMasterCardForm = () => {
  const [currency, setCurrency] = useState(paymentCurrencies[0]);
  const placeholderValues = [250, 500, 1000];

  const { t } = useTranslation();

  const validationSchema = yup.object().shape({
    amount: yup
      .number()
      .min(10, t('min: $10'))
      .max(10000, t('max: $10 000'))
      .required(t('Required field')),

    fullName: yup
      .string()
      .required(t('Required field'))
      .trim()
      .test('fullName', t('Only latin symbols'), (value) => {
        return /[a-zA-Z]/g.test(value);
      })
      .test('fullName', t('Max 40 symbols'), (val) => val?.length <= 40),

    cardNumber: yup
      .string()
      .required(t('Required field'))
      .test('cardNumber', t('Wrong card number'), (value) => {
        return (
          value &&
          checkCardNumLuhn(value.split(' ').join('')) &&
          (/^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/g.test(
            value.split(' ').join('')
          ) ||
            /^4[0-9]{12}(?:[0-9]{3})?$/.test(value.split(' ').join('')))
        );
      }),

    expirationDate: yup
      .string()
      .required(t('Required field'))
      .test('expirationDate', t('Expiry date is invalid'), (val) => {
        if (!val) {
          return false;
        }
        const parts = val.split(' / ');
        const date = moment(`${parts[0]}20${parts[1]}`, 'MMYYYY').endOf(
          'month'
        );
        return (
          !!date.toISOString() &&
          date.valueOf() > moment().startOf('month').valueOf()
        );
      }),

    cvv: yup
      .string()
      .required(t('Required field'))
      .test('cvv', t('CVV is invalid'), (val) => val?.length === 3),
  });
  const initialValues = {
    amount: 500,
    fullName: '',
    cardNumber: '',
    expirationDate: '',
    cvv: '',
  };

  const { mainAppStore, notificationStore, depositFundsStore } = useStores();
  const { push } = useHistory();

  const checkCardNumLuhn = (card: string) => {
    let value = card.replace(/\D/g, '');
    let sum = 0;
    let shouldDouble = false;
    for (let i = value.length - 1; i >= 0; i--) {
      let digit = parseInt(value.charAt(i));
      if (shouldDouble) {
        if ((digit *= 2) > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 == 0;
  };

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

  const handleSubmitForm = async (values: any) => {
    let parts = values.expirationDate.split(' / ');

    const params: CreateDepositInvoiceParams = {
      ...values,
      fullName: values.fullName.trim(),
      cardNumber: values.cardNumber.split(' ').join(''),
      cvv: +values.cvv,
      authToken: mainAppStore.token,
      accountId: mainAppStore.accounts.find((acc) => acc.isLive)?.id || '',
      expirationDate: moment(`${parts[0]}20${parts[1]}`, 'MMYYYY').valueOf(),
    };

    try {
      const result = await API.createDepositInvoice(params);

      if (result.status === DepositRequestStatusEnum.Success) {
        Object.assign(document.createElement('a'), {
          target: '_blank',
          href: result.secureLink,
        }).click();
      }
      if (result.status === DepositRequestStatusEnum.PaymentDeclined) {
        // TODO: Refactor
        depositFundsStore.togglePopup();
        push('/?status=failed');
      } else {
        notificationStore.isSuccessfull = false;
        notificationStore.notificationMessage = t(
          depositResponseMessages[result.status]
        );
        notificationStore.openNotification();
      }
    } catch (error) {}
  };

  const {
    values,
    touched,
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

        <FlexContainer marginBottom="20px">
          <img src={VisaMasterCardImage} alt="" width="40px" />
        </FlexContainer>

        <FlexContainer flexDirection="column" marginBottom="20px">
          <PrimaryTextParagraph
            textTransform="uppercase"
            fontSize="11px"
            color="rgba(255,255,255,0.3)"
            marginBottom="6px"
          >
            {t('Card holder')}
          </PrimaryTextParagraph>

          <FlexContainer
            borderRadius="4px"
            backgroundColor="#292C33"
            marginBottom="10px"
            maxHeight="48px"
            alignItems="center"
            position="relative"
          >
            <CustomInput
              placeholder={t('Your name')}
              value={values.fullName}
              onChange={handleChange}
              name="fullName"
              id="fullName"
              hasError={!!(touched.fullName && errors.fullName)}
            />
            {touched.fullName && errors.fullName && (
              <ErrorInputLabel>
                <ErrorLabelDekor>
                  <SvgIcon {...LabelBgIcon} fillColor="#ED145B" />
                </ErrorLabelDekor>
                {errors.fullName}
              </ErrorInputLabel>
            )}
          </FlexContainer>
        </FlexContainer>

        <FlexContainer flexDirection="column" marginBottom="20px">
          <PrimaryTextParagraph
            textTransform="uppercase"
            fontSize="11px"
            color="rgba(255,255,255,0.3)"
            marginBottom="6px"
          >
            {t('Card number')}
          </PrimaryTextParagraph>

          <FlexContainer
            borderRadius="4px"
            backgroundColor="#292C33"
            marginBottom="10px"
            maxHeight="48px"
            alignItems="center"
            position="relative"
          >
            <CustomInputMask
              // @ts-ignore
              maskPlaceholder={''}
              placeholder="1234 5678 9012 3456"
              mask="9999 9999 9999 9999"
              value={values.cardNumber}
              onChange={handleChange}
              name="cardNumber"
              id="cardNumber"
              className={`input-border ${
                !!(touched.cardNumber && errors.cardNumber) && 'error'
              }`}
            />
            {touched.cardNumber && errors.cardNumber && (
              <ErrorInputLabel>
                <ErrorLabelDekor>
                  <SvgIcon {...LabelBgIcon} fillColor="#ED145B" />
                </ErrorLabelDekor>
                {errors.cardNumber}
              </ErrorInputLabel>
            )}
          </FlexContainer>
        </FlexContainer>

        <CustomFlex>
          <FlexContainer flexDirection="column" marginBottom="20px">
            <PrimaryTextParagraph
              textTransform="uppercase"
              fontSize="11px"
              color="rgba(255,255,255,0.3)"
              marginBottom="6px"
            >
              {t('Expire date')}
            </PrimaryTextParagraph>

            <FlexContainer
              borderRadius="4px"
              backgroundColor="#292C33"
              marginBottom="10px"
              maxHeight="48px"
              alignItems="center"
              position="relative"
            >
              <CustomInputMask
                // @ts-ignore
                maskPlaceholder={''}
                placeholder="12 / 24"
                mask="99 / 99"
                value={values.expirationDate}
                onChange={handleChange}
                name="expirationDate"
                id="expirationDate"
                className={`input-border ${
                  !!(touched.expirationDate && errors.expirationDate) && 'error'
                }`}
              />
              {touched.expirationDate && errors.expirationDate && (
                <ErrorInputLabel>
                  <ErrorLabelDekor>
                    <SvgIcon {...LabelBgIcon} fillColor="#ED145B" />
                  </ErrorLabelDekor>
                  {errors.expirationDate}
                </ErrorInputLabel>
              )}
            </FlexContainer>
          </FlexContainer>
          <FlexContainer flexDirection="column" marginBottom="20px">
            <PrimaryTextParagraph
              textTransform="uppercase"
              fontSize="11px"
              color="rgba(255,255,255,0.3)"
              marginBottom="6px"
            >
              {t('CVV')}
            </PrimaryTextParagraph>

            <FlexContainer
              borderRadius="4px"
              backgroundColor="#292C33"
              marginBottom="10px"
              maxHeight="48px"
              alignItems="center"
              position="relative"
            >
              <CustomInputMask
                type="password"
                // @ts-ignore
                maskPlaceholder={''}
                placeholder="***"
                mask="999"
                value={values.cvv}
                onChange={handleChange}
                name="cvv"
                id="cvv"
                className={`input-border ${
                  !!(touched.cvv && errors.cvv) && 'error'
                }`}
              />
              {touched.cvv && errors.cvv && (
                <ErrorInputLabel>
                  <ErrorLabelDekor>
                    <SvgIcon {...LabelBgIcon} fillColor="#ED145B" />
                  </ErrorLabelDekor>
                  {errors.cvv}
                </ErrorInputLabel>
              )}
            </FlexContainer>
          </FlexContainer>
        </CustomFlex>

        <FlexContainer marginBottom="40px">
          <PrimaryButton
            padding="12px 20px"
            width="100%"
            onClick={handlerClickSubmit}
            disabled={isSubmitting}
          >
            <PrimaryTextSpan color="#003A38" fontSize="14px" fontWeight="bold">
              {t('Deposit')} {mainAppStore.activeAccount?.symbol}
              {values.amount}
            </PrimaryTextSpan>
          </PrimaryButton>
        </FlexContainer>
      </form>
    </FlexContainer>
  );
};

export default VisaMasterCardForm;

const CustomFlex = styled(FlexContainer)`
  justify-content: space-between;
  & > div {
    flex-basis: calc(50% - 8px);
  }
`;

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

const CustomInput = styled.input<{ hasError: boolean }>`
  outline: none;
  height: 48px;
  color: #fffccc;
  font-size: 14px;
  font-weight: bold;
  width: 100%;
  padding: 24px 16px;
  background-color: transparent;
  border: 1px solid
    ${({ hasError }) => (hasError ? '#ED145B !important' : '#494b50')};
  border-radius: 4px;
  transition: all 0.2s ease;
  &::placeholder {
    color: rgba(196, 196, 196, 0.5);
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
  }
  &:focus {
    border-color: #fffccc;
    &::placeholder {
      opacity: 0;
    }
  }
`;

const CustomInputMask = styled(InputMask)`
  outline: none;
  height: 48px;
  color: #fffccc;
  font-size: 14px;
  font-weight: bold;
  width: 100%;
  padding: 24px 16px;
  background-color: transparent;
  border-radius: 4px;
  transition: all 0.2s ease;
  &::placeholder {
    color: rgba(196, 196, 196, 0.5);
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
  }
  &:focus {
    border-color: #fffccc;
    &::placeholder {
      opacity: 0;
    }
  }
`;

const ErrorInputLabel = styled.span`
  border-radius: 5px;
  text-align: center;
  max-width: 100%;
  font-size: 12px;
  line-height: 12px;
  color: #ffffff;
  background: #ed145b;
  position: absolute;
  right: 0;
  bottom: -12px;
  padding: 8px 16px;
  transform: translateY(100%);
`;

const ErrorLabelDekor = styled.span`
  display: inline-block;
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 28px;
  height: 6px;
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
