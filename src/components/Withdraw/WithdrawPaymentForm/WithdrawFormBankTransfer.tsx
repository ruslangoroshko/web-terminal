import React, { useCallback, useState, useEffect, ChangeEvent } from 'react';
import * as yup from 'yup';
import styled from '@emotion/styled';
import { PrimaryButton } from '../../../styles/Buttons';
import { PrimaryTextSpan } from '../../../styles/TextsElements';
import { FlexContainer } from '../../../styles/FlexContainer';
import { useFormik } from 'formik';
import { useStores } from '../../../hooks/useStores';
import { WithdrawalTypesEnum } from '../../../enums/WithdrawalTypesEnum';
import { CreateWithdrawalParams } from '../../../types/WithdrawalTypes';
import API from '../../../helpers/API';
import { WithdrawalHistoryResponseStatus } from '../../../enums/WithdrawalHistoryResponseStatus';
import { WithdrawalTabsEnum } from '../../../enums/WithdrawalTabsEnum';
import { useTranslation } from 'react-i18next';
import withdrawalResponseMessages from '../../../constants/withdrawalResponseMessages';
import ConfirmPopup from '../../ConfirmPopup';
import Modal from '../../Modal';
import ConfirmWithdawBonusPopUp from './ConfirmWithdawBonusPopUp';
import { Observer } from 'mobx-react-lite';
import { moneyFormat } from '../../../helpers/moneyFormat';

interface RequestValues {
  amount: number;
  details: string;
}

const PRECISION_USD = 2;

const WithdrawFormBankTransfer = () => {
  const initialValues: RequestValues = {
    amount: 0,
    details: '',
  };
  const { t } = useTranslation();

  const { mainAppStore, withdrawalStore, notificationStore } = useStores();

  const validationSchema = useCallback(
    () =>
      yup.object().shape<RequestValues>({
        amount: yup
          .number()
          .min(10, `${t('min')}: $10`)
          .max(
            ((mainAppStore.realAcc?.balance || 0) - (mainAppStore.realAcc?.bonus || 0)),
            `${t('max')}: ${moneyFormat((mainAppStore.realAcc?.balance || 0) - (mainAppStore.realAcc?.bonus || 0))}`
          ),
        details: yup
          .string()
          .max(2000, t('The field should be less or equal to 2000 characters')),
      }),
    [mainAppStore.accounts]
  );

  const [dissabled, setDissabled] = useState(true);

  const handleSubmitForm = async () => {
    try {
      const dataParam = {
        details: values.details,
      };

      const accountInfo = mainAppStore.accounts.find((item) => item.isLive);

      const data: CreateWithdrawalParams = {
        accountId: accountInfo?.id || '',
        currency: accountInfo?.currency || '',
        amount: +values.amount,
        withdrawalType: WithdrawalTypesEnum.BankTransfer,
        data: JSON.stringify(dataParam),
      };

      const result = await API.createWithdrawal(
        data,
        mainAppStore.initModel.tradingUrl
      );
      if (result.status === WithdrawalHistoryResponseStatus.Successful) {
        withdrawalStore.opentTab(WithdrawalTabsEnum.History);
        notificationStore.setIsSuccessfull(true);
      } else {
        notificationStore.setIsSuccessfull(false);
      }

      if (
        result.status ===
        WithdrawalHistoryResponseStatus.WithdrawalRequestAlreadyCreated
      ) {
        withdrawalStore.setPendingPopup();
      }

      notificationStore.setNotification(
        t(withdrawalResponseMessages[result.status])
      );
      notificationStore.openNotification();
    } catch (error) {}
  };

  const {
    values,
    setFieldError,
    setErrors,
    setFieldValue,
    setSubmitting,
    validateForm,
    handleChange,
    handleSubmit,
    submitForm,
    errors,
    touched,
    isSubmitting,
  } = useFormik({
    initialValues,
    onSubmit: handleSubmitForm,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
  });

  const handleChangeAmount = (e: any) => {
    let filteredValue: any = e.target.value.replace(',', '.');
    setFieldValue('amount', filteredValue);
    setFieldError('amount', undefined);
  };

  const amountOnBeforeInputHandler = (e: any) => {
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

  
  const handlerClickSubmit = async () => {
    const curErrors = await validateForm();
    const curErrorsKeys = Object.keys(curErrors);
    if (curErrorsKeys.length) {
      setErrors(curErrors);
      const el = document.getElementById(curErrorsKeys[0]);
      if (el) el.focus();
      return;
    }
    const bonus = mainAppStore.accounts.find(acc => acc.isLive)?.bonus || 0;
    if (bonus > 0) {
      withdrawalStore.setBonusPopup();
    } else {
      submitForm();
    }
  };

  
  const handleChangeFiled = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFieldValue(e.target.name, e.target.value);
    setFieldError(e.target.name, undefined);
  };

  const handleToggleBonus = (arg: boolean) => {
    withdrawalStore.closeBonusPopup();
  }
  const handleConfirm = () => {
    submitForm();
    withdrawalStore.closeBonusPopup();
  };

  useEffect(() => {
    setDissabled(!values.amount);
  }, [values.amount]);

  return (
    <CustomForm noValidate onSubmit={handleSubmit}>
      <Observer>
        {() => (
          <>
            {withdrawalStore.showBonusPopup && (
              <ConfirmWithdawBonusPopUp
                toggle={handleToggleBonus}
                applyHandler={handleConfirm}
              />
            )}
          </>
        )}
      </Observer>

      <FlexContainer flexDirection="column" width="340px">
        <FlexContainer
          margin="0 0 6px 0"
          alignItems="center"
          justifyContent="space-between"
        >
          <PrimaryTextSpan
            fontSize="11px"
            lineHeight="12px"
            color="rgba(255, 255, 255, 0.3)"
            textTransform="uppercase"
          >
            {t('Amount')}
          </PrimaryTextSpan>
        </FlexContainer>

        <InputWrapper
          margin="0 0 16px 0"
          height="32px"
          width="100%"
          position="relative"
          justifyContent="space-between"
        >
          <InputField
            name="amount"
            id="amount"
            onBeforeInput={amountOnBeforeInputHandler}
            onChange={handleChangeAmount}
            //onBlur={handleBlurAmount}
            value={values.amount || ''}
            type="text"
          />

          {errors.amount && (
            <ErrorText>{errors.amount}</ErrorText>
          )}
        </InputWrapper>

        <FlexContainer
          margin="0 0 6px 0"
          alignItems="center"
          justifyContent="space-between"
        >
          <PrimaryTextSpan
            fontSize="11px"
            lineHeight="12px"
            color="rgba(255, 255, 255, 0.3)"
            textTransform="uppercase"
          >
            {t('Details')}
          </PrimaryTextSpan>
        </FlexContainer>

        <InputWrapper
          margin="0 0 16px 0"
          width="100%"
          position="relative"
          justifyContent="space-between"
        >
          <InputFieldText
            name="details"
            id="details"
            onChange={handleChangeFiled}
            value={values.details}
          />
        </InputWrapper>
        {errors.details && (
          <ErrorLineText>{errors.details}</ErrorLineText>
        )}

        <WithdrawButton
          width="160px"
          padding="12px"
          type="button"
          onClick={handlerClickSubmit}
          disabled={dissabled}
        >
          <PrimaryTextSpan color="#1c2026" fontWeight="bold" fontSize="14px">
            {t('Withdraw')}
          </PrimaryTextSpan>
        </WithdrawButton>
      </FlexContainer>
    </CustomForm>
  );
};

export default WithdrawFormBankTransfer;

const CustomForm = styled.form`
  margin-bottom: 0;
`;

const WithdrawButton = styled(PrimaryButton)`
  margin-top: 16px;
`;

const InputField = styled.input`
  background-color: transparent;
  border: none;
  outline: none;
  width: 100%;
  height: 100%;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  color: #fffccc;
  padding: 8px 0 8px 8px;
  appearance: none;
  -moz-appearance: textfield;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  &:-webkit-input-placeholder {
    color: #fff;
    opacity: 0.3;
    font-weight: normal;
  }

  &:-ms-input-placeholder {
    color: #fff;
    opacity: 0.3;
    font-weight: normal;
  }

  &::placeholder {
    color: #fff;
    opacity: 0.3;
    font-weight: normal;
  }
`;

const InputFieldText = styled.textarea`
  background-color: transparent;
  border: none;
  outline: none;
  width: 100%;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  color: #fffccc;
  padding: 8px 0 8px 8px;
  appearance: none;
  -moz-appearance: textfield;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  &:-webkit-input-placeholder {
    color: #fff;
    opacity: 0.3;
    font-weight: normal;
  }

  &:-ms-input-placeholder {
    color: #fff;
    opacity: 0.3;
    font-weight: normal;
  }

  &::placeholder {
    color: #fff;
    opacity: 0.3;
    font-weight: normal;
  }
`;

const InputWrapper = styled(FlexContainer)`
  border-radius: 4px;
  border: 1px solid
    ${(props) => (props.hasError ? '#ED145B' : 'rgba(255, 255, 255, 0.1)')};
  color: #fff;
  background-color: rgba(255, 255, 255, 0.06);
`;

const ErrorText = styled.span`
  font-weight: bold;
  font-size: 12px;
  line-height: 16px;
  color: #ff557e;
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
`;

const ErrorLineText = styled.span`
  font-weight: bold;
  font-size: 12px;
  line-height: 16px;
  color: #ff557e;
`;
