import React, { useEffect, useState, useCallback } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import AccountSettingsContainer from '../containers/AccountSettingsContainer';
import { PrimaryTextSpan, PrimaryTextParagraph } from '../styles/TextsElements';
import * as yup from 'yup';
import API from '../helpers/API';
import { useStores } from '../hooks/useStores';
import { BalanceHistoryReport } from '../types/HistoryReportTypes';
import styled from '@emotion/styled';
import SvgIcon from '../components/SvgIcon';
import IconNoTradingHistory from '../assets/svg/icon-no-trading-history.svg';
import DatePickerDropdown from '../components/DatePickerDropdown';
import { TableGrid, Th } from '../styles/TableElements';
import BalanceHistoryItem from '../components/BalanceHistoryItem';
import InfinityScrollList from '../components/InfinityScrollList';
import BadRequestPopup from '../components/BadRequestPopup';
import { Observer } from 'mobx-react-lite';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import IconClose from '../assets/svg/icon-popup-close.svg';
import { useHistory } from 'react-router-dom';
import LoaderForComponents from '../components/LoaderForComponents';
import LabelInput from '../components/LabelInput';
import { useFormik } from 'formik';
import Fields from '../constants/fields';
import validationInputTexts from '../constants/validationInputTexts';
import { PrimaryButton } from '../styles/Buttons';

function AccountSecurity() {
  const validationSchema = yup.object().shape({
    oldPassword: yup
      .string()
      .required('Password must be at least 8 characters long')
      .min(8, validationInputTexts.PASSWORD_MIN_CHARACTERS)
      .max(40, validationInputTexts.PASSWORD_MAX_CHARACTERS),
    password: yup
      .string()
      .required('Password must be at least 8 characters long')
      .min(8, validationInputTexts.PASSWORD_MIN_CHARACTERS)
      .max(40, validationInputTexts.PASSWORD_MAX_CHARACTERS)
      .matches(/^(?=.*\d)(?=.*[a-zA-Z])/, validationInputTexts.PASSWORD_MATCH),
    repeatPassword: yup
      .string()
      .required('Password must be at least 8 characters long')
      .oneOf(
        [yup.ref(Fields.PASSWORD), null],
        validationInputTexts.REPEAT_PASSWORD_MATCH
      ),
  });
  //
  const initialValues = {
    oldPassword: '',
    password: '',
    repeatPassword: '',
  };

  const { mainAppStore, badRequestPopupStore, dateRangeStore } = useStores();
  const { goBack } = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = 'Change password';
  }, []);

  const handleSubmitForm = () => {};
  const {
    values,
    setFieldValue,
    validateForm,
    handleSubmit,
    handleChange,
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
    <AccountSettingsContainer>
      <IconButton onClick={goBack}>
        <SvgIcon
          {...IconClose}
          fillColor="rgba(255, 255, 255, 0.6)"
          hoverFillColor="#00FFDD"
        ></SvgIcon>
      </IconButton>
      <Observer>
        {() => <>{badRequestPopupStore.isActive && <BadRequestPopup />}</>}
      </Observer>
      <Observer>
        {() => (
          <LoaderForComponents
            isLoading={isLoading}
            backgroundColor="#252637"
          />
        )}
      </Observer>
      <FlexContainer flexDirection="column">
        <PrimaryTextSpan
          color="#FFFCCC"
          fontSize="24px"
          fontWeight="bold"
          marginBottom="40px"
        >
          Change password
        </PrimaryTextSpan>

        <CustomForm onSubmit={handleSubmit} noValidate>
          <FlexContainer flexDirection="column" width="360px">

            <FlexContainer flexDirection="column">
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
                  Current password
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
                  name={Fields.OLD_PASSWORD}
                  id={Fields.OLD_PASSWORD}
                  onChange={handleChange}
                  value={values.oldPassword}
                  type="password"
                ></InputField>
              </InputWrapper>
            </FlexContainer>

            <FlexContainer flexDirection="column">
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
                  New password
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
                  name={Fields.PASSWORD}
                  id={Fields.PASSWORD}
                  onChange={handleChange}
                  value={values.password}
                  type="password"
                ></InputField>
              </InputWrapper>
            </FlexContainer>

            <FlexContainer flexDirection="column">
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
                  Repeat password
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
                  name={Fields.REPEAT_PASSWORD}
                  id={Fields.REPEAT_PASSWORD}
                  onChange={handleChange}
                  value={values.repeatPassword}
                  type="password"
                ></InputField>
              </InputWrapper>
            </FlexContainer>

            <PrimaryButton
              width="160px"
              padding="12px"
              type="submit"
              onClick={handlerClickSubmit}
              disabled={isSubmitting}
            >
              <PrimaryTextSpan
                color="#1c2026"
                fontWeight="bold"
                fontSize="14px"
                textTransform="uppercase"
              >
                Change password
              </PrimaryTextSpan>
            </PrimaryButton>
          </FlexContainer>
        </CustomForm>
      </FlexContainer>
    </AccountSettingsContainer>
  );
}

export default AccountSecurity;

const IconButton = styled(ButtonWithoutStyles)`
  margin-right: 8px;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  &:last-of-type {
    margin-right: 0;
  }
`;

const CustomForm = styled.form`
  margin: 0;
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
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  background-color: rgba(255, 255, 255, 0.06);
`;
