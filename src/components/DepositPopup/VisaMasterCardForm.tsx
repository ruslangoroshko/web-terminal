import React, {
  useState,
  useEffect,
  ChangeEvent,
  useRef,
  createRef,
  FormEvent,
} from 'react';
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
import LoaderComponent from '../LoaderComponent';
import PreloaderButtonMask from '../PreloaderButtonMask';
import Page from '../../constants/Pages';
import testIds from '../../constants/testIds';
import e2eTests from '../../constants/e2eTests';
import Fields from '../../constants/fields';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import { InputMaskedCustom } from '../../styles/FormControls';
import { logger } from '../../helpers/ConsoleLoggerTool';

const VisaMasterCardForm = () => {
  const [currency, setCurrency] = useState(paymentCurrencies[0]);
  const [loading, setLoading] = useState(false);

  const isMozilla = navigator.userAgent.indexOf('Mozilla') !== -1;
  const placeholderValues = [250, 500, 1000];

  const { t } = useTranslation();
  const { push } = useHistory();

  const numberCardInputRef = useRef<HTMLInputElement>(null);

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
      .test('fullName', t('Cardholder name is invalid'), (value) => {
        return /^[a-zA-Z .~`'-]+$/i.test(value);
      })
      .test(
        'fullName',
        t('Cardholder name is invalid'),
        (val) => val?.length <= 49
      )
      .test('fullName', t('Cardholder name is invalid'), (val) => {
        if (val?.length) {
          let value: String[] = val
            ?.trim()
            .split(' ')
            .filter((item: string) => item);
          return !!(
            value[0] &&
            value[1] &&
            value[0].length <= 24 &&
            value[1].length <= 24
          );
        }
        return false;
      }),

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
        const parts = val.split('/');
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
    const regex = /^[0-9]{1,15}([.,][0-9]{1,2})?$/;
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

  const onBeforeCardHolderNameInput = (e: any) => {
    if (!e.data.match(/^[a-zA-Z .~`'-]+$/)) {
      e.preventDefault();
      return;
    }
  };

  const handleSubmitForm = async (values: any) => {
    setLoading(true);
    let parts = values.expirationDate.split('/');

    const params: CreateDepositInvoiceParams = {
      ...values,
      amount: +values.amount,
      fullName: values.fullName.trim(),
      cardNumber: values.cardNumber.split(' ').join(''),
      accountId: mainAppStore.accounts.find((acc) => acc.isLive)?.id || '',
      expirationDate: new Date(`20${parts[1]}-${parts[0]}`).getTime(),
    };

    try {
      const result = await API.createDepositInvoice(params);

      switch (result.status) {
        case DepositRequestStatusEnum.Success:
          const hiddenAnchor = document.getElementById('hidden-anchor');
          if (hiddenAnchor) {
            hiddenAnchor.setAttribute('href', result.secureLink);
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
          notificationStore.setNotification(
            t(depositResponseMessages[result.status])
          );
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
    touched,
    setFieldValue,
    validateForm,
    handleSubmit,
    handleChange,
    errors,
    isSubmitting,
    setFieldError,
  } = useFormik({
    initialValues,
    onSubmit: handleSubmitForm,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
  });

  const handleChangeAmount = (e: any) => {
    setFieldError(Fields.AMOUNT, undefined);
    if (e.target.value.length === 19) {
      return;
    }
    e.currentTarget.value = e.currentTarget.value.replace(/,/g, '.');
    handleChange(e);
  };
  const handleBlurFullname = () => {
    setFieldValue('fullName', values.fullName.trim());
  };
  const handleChangeFullname = (e: any) => {
    setFieldValue('fullName', e.target.value.trimLeft().replace(/\s+/g, ' '));
    setFieldError('fullName', undefined);
  };

  const handleBeforeInputChange = (e: any) => {
    const regexp = '^(0[1-9]|1[0-2])/?(([0-9]{4})$)';
    if (e.data && e.data.match(regexp)) {
      const parts = e.data.split('/');
      const year = parts[1].split('');
      const value = `${parts[0]}/${year[2]}${year[3]}`;
      setFieldValue(e.target.name, value);
      return e.preventDefault();
    }
  };

  const hadleBeforeInputCardNumber = (e: any) => {
    const value = e.data;
    if (value.toString().split(' ').join('').length === 16) {
      const cardNumber = value.toString().replace(/\d{4,5}?(?=...)/g, '$& ');
      setFieldValue(e.target.name, cardNumber);
      return cardNumber;
    }
  };

  const handleFocusCardNumber = (e: any) => {
    console.log('focus found');
    setTimeout(() => {
      e.target.setSelectionRange(19, 19);
    }, 500);
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldError(e.target.name, undefined);
    handleChange(e);
  };

  const handleChangeExpireDate = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldError(e.target.name, undefined);
    handleChange(e);
  };

  const handleChangeFormated = (field: string) => (val: NumberFormatValues) => {
    setFieldValue(field, val.formattedValue);
    setFieldError(field, undefined);
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
              autoComplete="off"
              data-testid={testIds.VISAMASTERFORM_AMOUNT}
              data-e2e-id={e2eTests.DEPOSIT_AMOUNT}
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
              isActive={
                parseFloat(item.toString()) ===
                parseFloat(values.amount.toString())
              }
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
            <NumberFormat
              mask={' '}
              format="#### #### #### ####"
              placeholder="1234 5678 9012 3456"
              value={values.cardNumber}
              onBeforeInput={hadleBeforeInputCardNumber}
              onFocus={handleFocusCardNumber}
              onValueChange={handleChangeFormated('cardNumber')}
              // displayType={'text'}
              name="cardNumber"
              id="cardNumber"
              inputMode="numeric"
              autoComplete="cc-number"
              customInput={InputMaskedCustom}
              className={`input-border ${
                !!(touched.cvv && errors.cvv) && 'error'
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
                placeholder="12/24"
                mask="99/99"
                onBeforeInput={handleBeforeInputChange}
                value={values.expirationDate}
                onChange={handleChangeExpireDate}
                autoComplete="cc-exp"
                //maxLength={5}
                name="expirationDate"
                id="expirationDate"
                data-testid={testIds.VISAMASTERFORM_DATE}
                className={`input-border ${
                  !!(touched.expirationDate && errors.expirationDate) && 'error'
                }`}
                data-e2e-id={e2eTests.DEPOSIT_EXPIRE_DATE}
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
                autoComplete={isMozilla ? 'off' : 'cc-csc'}
                placeholder="***"
                mask="999"
                value={values.cvv}
                onChange={handleChangeInput}
                name="cvv"
                id="cvv"
                data-testid={testIds.VISAMASTERFORM_CVV}
                className={`input-border ${
                  !!(touched.cvv && errors.cvv) && 'error'
                }`}
                data-e2e-id={e2eTests.DEPOSIT_CVV}
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
              autoComplete="cc-name"
              placeholder={t('Your name')}
              value={values.fullName}
              onChange={handleChangeFullname}
              onBlur={handleBlurFullname}
              onBeforeInput={onBeforeCardHolderNameInput}
              name="fullName"
              id="fullName"
              data-testid={testIds.VISAMASTERFORM_CARDHOLDER_NAME}
              hasError={!!(touched.fullName && errors.fullName)}
              data-e2e-id={e2eTests.DEPOSIT_CARDHOLDER}
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
            data-testid={testIds.VISAMASTERFORM_SUBMIT}
            data-e2e-id={e2eTests.DEPOSIT_SUBMIT_BTN}
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

export default VisaMasterCardForm;

const CustomForm = styled.form`
  margin-bottom: 0;
`;
const CustomFlex = styled(FlexContainer)`
  justify-content: space-between;
  & > div {
    flex-basis: calc(50% - 8px);
  }
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

const CustomInput = styled.input<{ hasError: boolean }>`
  outline: none;
  height: 48px;
  color: #fffccc;
  font-size: 14px;
  font-weight: bold;
  width: 100%;
  padding: 12px 16px;
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

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:valid,
  &:-webkit-autofill:active {
    transition: border 0.2s ease, background-color 50000s ease-in-out 0s;
    -webkit-text-fill-color: #fffccc !important;
    font-size: 14px;
  }
`;

const CustomInputMask = styled(InputMask)`
  outline: none;
  height: 48px;
  color: #fffccc;
  font-size: 14px;
  font-weight: bold;
  width: 100%;
  padding: 12px 16px;
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

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:valid,
  &:-webkit-autofill:active {
    transition: border 0.2s ease, background-color 50000s ease-in-out 0s;
    -webkit-text-fill-color: #fffccc !important;
    font-size: 14px;
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
  z-index: 1;
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
