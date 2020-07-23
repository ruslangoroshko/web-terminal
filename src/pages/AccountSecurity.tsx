import React, { useEffect, useState } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import AccountSettingsContainer from '../containers/AccountSettingsContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import * as yup from 'yup';
import API from '../helpers/API';
import { useStores } from '../hooks/useStores';
import styled from '@emotion/styled';
import SvgIcon from '../components/SvgIcon';
import BadRequestPopup from '../components/BadRequestPopup';
import { Observer } from 'mobx-react-lite';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import IconClose from '../assets/svg/icon-popup-close.svg';
import { useHistory } from 'react-router-dom';
import LoaderForComponents from '../components/LoaderForComponents';
import { useFormik } from 'formik';
import Fields from '../constants/fields';
import validationInputTexts from '../constants/validationInputTexts';
import { PrimaryButton } from '../styles/Buttons';
import ErropPopup from '../components/ErropPopup';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import NotificationPopup from '../components/NotificationPopup';
import Page from '../constants/Pages';
import { useTranslation } from 'react-i18next';

function AccountSecurity() {
  const { t } = useTranslation();
  const validationSchema = yup.object().shape({
    oldPassword: yup
      .string()
      .required(t('Password must be at least 8 characters long'))
      .min(8, t(validationInputTexts.PASSWORD_MIN_CHARACTERS))
      .max(31, t(validationInputTexts.PASSWORD_MAX_CHARACTERS)),
    password: yup
      .string()
      .required(t('Password must be at least 8 characters long'))
      .min(8, t(validationInputTexts.PASSWORD_MIN_CHARACTERS))
      .max(31, t(validationInputTexts.PASSWORD_MAX_CHARACTERS))
      .matches(
        /^(?=.*\d)(?=.*[a-zA-Z])/,
        t(validationInputTexts.PASSWORD_MATCH)
      ),
    repeatPassword: yup
      .string()
      .required(t('Password must be at least 8 characters long'))
      .oneOf(
        [yup.ref(Fields.PASSWORD), null],
        t("New password and confirmation don't match")
      ),
  });
  //
  const initialValues = {
    oldPassword: '',
    password: '',
    repeatPassword: '',
  };

  const { badRequestPopupStore, notificationStore } = useStores();
  const { push } = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = t('Change password');
  }, []);

  const handleSubmitForm = async () => {
    setIsLoading(true);

    try {
      const response = await API.changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.password,
      });
      if (response.result === OperationApiResponseCodes.Ok) {
        resetForm();
        setIsLoading(false);
        notificationStore.notificationMessage = t(
          'Your password has been changed'
        );
        notificationStore.isSuccessfull = true;
        notificationStore.openNotification();
      } else {
        resetForm();
        setIsLoading(false);
        notificationStore.notificationMessage = t(
          'You entered the wrong current password'
        );
        notificationStore.isSuccessfull = false;
        notificationStore.openNotification();
      }
    } catch (error) {
      setIsLoading(false);
      badRequestPopupStore.setMessage(error);
      badRequestPopupStore.openModal();
    }
  };

  const {
    values,
    resetForm,
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
      <FlexContainer
        position="absolute"
        bottom="100px"
        left="14px"
        zIndex="100"
      >
        <Observer>
          {() => (
            <NotificationPopup
              show={notificationStore.isActiveNotification}
            ></NotificationPopup>
          )}
        </Observer>
      </FlexContainer>

      <IconButton onClick={() => push(Page.DASHBOARD)}>
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
          {t('Change password')}
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
                  {t('Current password')}
                </PrimaryTextSpan>
              </FlexContainer>

              <InputWrapper
                margin="0 0 16px 0"
                height="32px"
                width="100%"
                position="relative"
                justifyContent="space-between"
                hasError={!!(touched.oldPassword && errors.oldPassword)}
              >
                <InputField
                  name={Fields.OLD_PASSWORD}
                  id={Fields.OLD_PASSWORD}
                  onChange={handleChange}
                  value={values.oldPassword}
                  type="password"
                ></InputField>

                {!!(touched.oldPassword && errors.oldPassword) && (
                  <ErropPopup
                    textColor="#fffccc"
                    bgColor="#ED145B"
                    classNameTooltip={Fields.OLD_PASSWORD}
                    direction="right"
                  >
                    {errors.oldPassword}
                  </ErropPopup>
                )}
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
                  {t('New password')}
                </PrimaryTextSpan>
              </FlexContainer>

              <InputWrapper
                margin="0 0 16px 0"
                height="32px"
                width="100%"
                position="relative"
                justifyContent="space-between"
                hasError={!!(touched.oldPassword && errors.oldPassword)}
              >
                <InputField
                  name={Fields.PASSWORD}
                  id={Fields.PASSWORD}
                  onChange={handleChange}
                  value={values.password}
                  type="password"
                ></InputField>
                {!!(touched.password && errors.password) && (
                  <ErropPopup
                    textColor="#fffccc"
                    bgColor="#ED145B"
                    classNameTooltip={Fields.PASSWORD}
                    direction="right"
                  >
                    {errors.password}
                  </ErropPopup>
                )}
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
                  {t('Repeat password')}
                </PrimaryTextSpan>
              </FlexContainer>

              <InputWrapper
                margin="0 0 16px 0"
                height="32px"
                width="100%"
                position="relative"
                justifyContent="space-between"
                hasError={!!(touched.oldPassword && errors.oldPassword)}
              >
                <InputField
                  name={Fields.REPEAT_PASSWORD}
                  id={Fields.REPEAT_PASSWORD}
                  onChange={handleChange}
                  value={values.repeatPassword}
                  type="password"
                ></InputField>

                {!!(touched.repeatPassword && errors.repeatPassword) && (
                  <ErropPopup
                    textColor="#fffccc"
                    bgColor="#ED145B"
                    classNameTooltip={Fields.REPEAT_PASSWORD}
                    direction="right"
                  >
                    {errors.repeatPassword}
                  </ErropPopup>
                )}
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
                {t('Change password')}
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
  border: 1px solid
    ${props => (props.hasError ? '#ED145B' : 'rgba(255, 255, 255, 0.1)')};
  color: #fff;
  background-color: rgba(255, 255, 255, 0.06);
`;
