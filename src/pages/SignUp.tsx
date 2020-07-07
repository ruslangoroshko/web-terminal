import React, { useEffect, useState } from 'react';
import { FormikHelpers, useFormik } from 'formik';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { UserRegistration } from '../types/UserInfo';
import * as yup from 'yup';
import Fields from '../constants/fields';
import { useStores } from '../hooks/useStores';
import SignFlowLayout from '../components/SignFlowLayout';
import LabelInput from '../components/LabelInput';
import { PrimaryButton } from '../styles/Buttons';
import { PrimaryTextSpan } from '../styles/TextsElements';
import SignTypeTabs from '../components/SignTypeTabs';
import Page from '../constants/Pages';
import { useHistory } from 'react-router-dom';
import Checkbox from '../components/Checkbox';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../constants/mixpanelEvents';
import validationInputTexts from '../constants/validationInputTexts';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import apiResponseCodeMessages from '../constants/apiResponseCodeMessages';
import NotificationPopup from '../components/NotificationPopup';
import { Observer } from 'mobx-react-lite';
import BadRequestPopup from '../components/BadRequestPopup';
import { useTranslation } from 'react-i18next';

function SignUp() {
  const { t } = useTranslation();
  const validationSchema = yup.object().shape<UserRegistration>({
    email: yup
      .string()
      .required(validationInputTexts.EMAIL)
      .email(validationInputTexts.EMAIL),
    password: yup
      .string()
      .required(validationInputTexts.REQUIRED_FIELD)
      .min(8, validationInputTexts.PASSWORD_MIN_CHARACTERS)
      .max(40, validationInputTexts.PASSWORD_MAX_CHARACTERS)
      .matches(/^(?=.*\d)(?=.*[a-zA-Z])/, validationInputTexts.PASSWORD_MATCH),
    repeatPassword: yup
      .string()
      .required(validationInputTexts.REPEAT_PASSWORD)
      .oneOf(
        [yup.ref(Fields.PASSWORD), null],
        validationInputTexts.REPEAT_PASSWORD_MATCH
      ),
    userAgreement: yup
      .bool()
      .oneOf([true], validationInputTexts.USER_AGREEMENT),
    captcha: yup.string(),
  });

  const initialValues: UserRegistration = {
    email: '',
    password: '',
    repeatPassword: '',
    userAgreement: false,
    captcha: '',
  };

  const { push } = useHistory();
  const { mainAppStore, notificationStore, badRequestPopupStore } = useStores();

  const [validateAssigments, setValitdateAssigments] = useState(false);

  const handleSubmitForm = async (
    { email, password }: UserRegistration,
    { setStatus, setSubmitting }: FormikHelpers<UserRegistration>
  ) => {
    setSubmitting(true);
    mainAppStore.isInitLoading = true;

    grecaptcha.ready(function() {
      grecaptcha
        .execute(RECAPTCHA_KEY, {
          action: 'submit',
        })
        .then(
          async function(captcha: any) {
            try {
              const result = await mainAppStore.signUp({
                email,
                password,
                captcha,
              });
              if (result !== OperationApiResponseCodes.Ok) {
                notificationStore.notificationMessage = t(
                  apiResponseCodeMessages[result]
                );
                notificationStore.isSuccessfull = false;
                notificationStore.openNotification();
                mainAppStore.isInitLoading = false;
              } else {
                push(Page.DASHBOARD);
              }
            } catch (error) {
              badRequestPopupStore.openModal();
              badRequestPopupStore.setMessage(error);
              setStatus(error);
              setSubmitting(false);
              mainAppStore.isInitLoading = false;
            }
          },
          () => {
            badRequestPopupStore.openModal();
            badRequestPopupStore.setMessage(
              t(
                apiResponseCodeMessages[
                  OperationApiResponseCodes.TechnicalError
                ]
              )
            );
            setStatus(
              t(
                apiResponseCodeMessages[
                  OperationApiResponseCodes.TechnicalError
                ]
              )
            );
            setSubmitting(false);
            mainAppStore.isInitLoading = false;
          }
        );
    });
  };

  const {
    values,
    setFieldError,
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

  const handleChangeUserAgreements = (setFieldValue: any) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFieldValue(Fields.USER_AGREEMENT, e.target.checked);
    e.target.checked
      ? setFieldError(Fields.USER_AGREEMENT, '')
      : setFieldError(
          Fields.USER_AGREEMENT,
          validationInputTexts.USER_AGREEMENT
        );
  };

  const handlerClickSubmit = async () => {
    const curErrors = await validateForm();
    const curErrorsKeys = Object.keys(curErrors);
    if (curErrorsKeys.length) {
      const el = document.getElementById(curErrorsKeys[0]);
      if (el) el.focus();
    }
    if (
      curErrorsKeys.length === 1 &&
      curErrorsKeys.includes(Fields.USER_AGREEMENT)
    ) {
      setValitdateAssigments(true);
      setFieldError(Fields.USER_AGREEMENT, '');
    }
  };

  useEffect(() => {
    mixpanel.track(mixpanelEvents.SIGN_UP_VIEW);
    // TODO: add react-helmet for dynamic title
    document.title = 'Sign Up';
  }, []);

  return (
    <SignFlowLayout>
      <Observer>
        {() => <>{badRequestPopupStore.isActive && <BadRequestPopup />}</>}
      </Observer>
      <FlexContainer
        position="absolute"
        bottom="100px"
        left="100px"
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
      <FlexContainer width="320px" flexDirection="column">
        <SignTypeTabs></SignTypeTabs>
        <CustomForm noValidate onSubmit={handleSubmit}>
          <FlexContainer flexDirection="column">
            <FlexContainer
              position="relative"
              flexDirection="column"
              margin="0 0 16px 0"
            >
              <LabelInput
                onChange={handleChange}
                name={Fields.EMAIL}
                labelText="Email"
                value={values.email || ''}
                id={Fields.EMAIL}
                hasError={!!(touched.email && errors.email)}
                errorText={errors.email}
              ></LabelInput>
            </FlexContainer>
            <FlexContainer
              position="relative"
              flexDirection="column"
              margin="0 0 16px 0"
            >
              <LabelInput
                onChange={handleChange}
                name={Fields.PASSWORD}
                labelText="Password"
                value={values.password || ''}
                id={Fields.PASSWORD}
                autoComplete="new-password"
                type="password"
                hasError={!!(touched.password && errors.password)}
                errorText={errors.password}
              ></LabelInput>
            </FlexContainer>
            <FlexContainer
              position="relative"
              flexDirection="column"
              margin="0 0 16px 0"
            >
              <LabelInput
                onChange={handleChange}
                labelText="Repeat Password"
                value={values.repeatPassword || ''}
                id={Fields.REPEAT_PASSWORD}
                name={Fields.REPEAT_PASSWORD}
                autoComplete="new-password"
                type="password"
                hasError={!!(touched.repeatPassword && errors.repeatPassword)}
                errorText={errors.repeatPassword}
              ></LabelInput>
            </FlexContainer>
            <FlexContainer margin="0 0 15px 0">
              <Checkbox
                id="user-agreements"
                checked={values.userAgreement}
                onChange={handleChangeUserAgreements(setFieldValue)}
                hasError={!!(validateAssigments && errors.userAgreement)}
                errorText={errors.userAgreement}
              >
                <PrimaryTextSpan color="rgba(255,255,255,0.6)" fontSize="12px">
                  I’m 18 years old, and agree to&nbsp;
                  <CustomCheckboxLinkExternal
                    href={mainAppStore.initModel.termsUrl}
                    target="_blank"
                  >
                    Terms &amp; Conditions
                  </CustomCheckboxLinkExternal>
                  &nbsp; and&nbsp;
                  <CustomCheckboxLinkExternal
                    href={mainAppStore.initModel.policyUrl}
                    target="_blank"
                  >
                    Privacy Policy
                  </CustomCheckboxLinkExternal>
                </PrimaryTextSpan>
              </Checkbox>
            </FlexContainer>
            <PrimaryButton
              padding="12px"
              type="submit"
              disabled={isSubmitting}
              onClick={handlerClickSubmit}
            >
              <PrimaryTextSpan
                color="#1c2026"
                fontWeight="bold"
                fontSize="14px"
                textTransform="uppercase"
              >
                Sign up
              </PrimaryTextSpan>
            </PrimaryButton>
          </FlexContainer>
        </CustomForm>
      </FlexContainer>
    </SignFlowLayout>
  );
}

export default SignUp;

const CustomForm = styled.form`
  margin: 0;
`;

const CustomCheckboxLinkExternal = styled.a`
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.4s ease;
  text-decoration: underline;
  font-size: 12px;
  :hover {
    text-decoration: none;
    color: rgba(255, 255, 255, 1);
  }
`;
