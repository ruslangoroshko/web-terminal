import React, { useState, useEffect } from 'react';
import SignFlowLayout from '../components/SignFlowLayout';
import { FormikHelpers, useFormik } from 'formik';
import LabelInput from '../components/LabelInput';
import { UserForgotPassword } from '../types/UserInfo';
import * as yup from 'yup';
import { PrimaryTextParagraph, PrimaryTextSpan } from '../styles/TextsElements';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryButton } from '../styles/Buttons';
import { Link } from 'react-router-dom';
import API from '../helpers/API';
import styled from '@emotion/styled';
import Pages from '../constants/Pages';
import LoaderFullscreen from '../components/LoaderFullscreen';
import Fields from '../constants/fields';

import CheckDone from '../assets/svg/icon-check-done.svg';
import SvgIcon from '../components/SvgIcon';
import validationInputTexts from '../constants/validationInputTexts';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../constants/mixpanelEvents';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import { useStores } from '../hooks/useStores';
import { Observer } from 'mobx-react-lite';
import BadRequestPopup from '../components/BadRequestPopup';
import { useTranslation } from 'react-i18next';
import Helmet from 'react-helmet';
import mixapanelProps from '../constants/mixpanelProps';

function ForgotPassword() {
  const { t } = useTranslation();
  const { mainAppStore } = useStores();
  const validationSchema = yup.object().shape<UserForgotPassword>({
    email: yup
      .string()
      .required(t(validationInputTexts.EMAIL))
      .email(t(validationInputTexts.EMAIL)),
  });

  const initialValues: UserForgotPassword = {
    email: '',
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessfull] = useState(false);
  const { badRequestPopupStore } = useStores();

  const handleSubmitForm = async (
    { email }: UserForgotPassword,
    { setSubmitting }: FormikHelpers<UserForgotPassword>
  ) => {
    try {
      setIsLoading(true);
      setSubmitting(true);

      const result = await API.forgotEmail(
        email,
        mainAppStore.initModel.authUrl
      );

      if (result.result === OperationApiResponseCodes.Ok) {
        setIsSuccessfull(true);
        mixpanel.track(mixpanelEvents.FORGOT_PASSWORD_SUBMIT, {
          [mixapanelProps.BRAND_NAME]: mainAppStore.initModel.brandProperty,
        });
      } else {
        setSubmitting(false);
        setIsSuccessfull(false);
      }

      setIsLoading(false);
    } catch (error) {
      badRequestPopupStore.openModal();
      badRequestPopupStore.setMessage(error);
      setSubmitting(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    mixpanel.track(mixpanelEvents.FORGOT_PASSWORD_VIEW, {
      [mixapanelProps.BRAND_NAME]: mainAppStore.initModel.brandProperty,
    });
  }, []);

  const {
    values,
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
    <SignFlowLayout>
      <Helmet>{t('Reset password')}</Helmet>
      {isLoading && <LoaderFullscreen isLoading={isLoading} />}

      <Observer>
        {() => <>{badRequestPopupStore.isActive && <BadRequestPopup />}</>}
      </Observer>

      <FlexContainer width="320px" maxWidth="100%" flexDirection="column">
        {isSuccessful ? (
          <>
            <PrimaryTextParagraph
              color="#fffccc"
              fontSize="24px"
              fontWeight="bold"
              marginBottom="20px"
            >
              {t('Check your email')}
            </PrimaryTextParagraph>

            <FlexContainer alignItems="center" padding="20px 0">
              <FlexContainer margin="0 20px 0 0">
                <SvgIcon {...CheckDone} fillColor="#005E5E" />
              </FlexContainer>
              <PrimaryTextParagraph color="#7b7b85" fontSize="12px">
                {t('We have sent you a link to create a new password.')}
              </PrimaryTextParagraph>
            </FlexContainer>

            <FlexContainer
              alignItems="center"
              justifyContent="center"
              padding="12px 0 20px"
            >
              <LinkForgotSuccess to={Pages.SIGN_IN}>
                {t('Back to Login')}
              </LinkForgotSuccess>
            </FlexContainer>
          </>
        ) : (
          <>
            <PrimaryTextParagraph
              color="#fffccc"
              fontSize="24px"
              fontWeight="bold"
              marginBottom="20px"
            >
              {t('Reset password')}
            </PrimaryTextParagraph>
            <PrimaryTextParagraph
              color="#7b7b85"
              fontSize="12px"
              marginBottom="24px"
            >
              {t('To begin changing your password, please enter your e-mail')}
            </PrimaryTextParagraph>

            <CustomForm noValidate onSubmit={handleSubmit}>
              <FlexContainer flexDirection="column">
                <FlexContainer
                  position="relative"
                  flexDirection="column"
                  margin="0 0 16px 0"
                >
                  <LabelInput
                    name={Fields.EMAIL}
                    labelText={t('Email')}
                    value={values.email || ''}
                    onChange={handleChange}
                    id={Fields.EMAIL}
                    hasError={!!(touched.email && errors.email)}
                    errorText={errors.email}
                  ></LabelInput>
                </FlexContainer>

                <PrimaryButton
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
                    {t('Confirm')}
                  </PrimaryTextSpan>
                </PrimaryButton>
              </FlexContainer>
            </CustomForm>

            <FlexContainer
              alignItems="center"
              justifyContent="center"
              padding="12px 0"
            >
              <LinkForgot to={Pages.SIGN_IN}>{t('Back to Login')}</LinkForgot>
            </FlexContainer>
          </>
        )}
      </FlexContainer>
    </SignFlowLayout>
  );
}

export default ForgotPassword;

const CustomForm = styled.form`
  margin: 0;
`;

const LinkForgot = styled(Link)`
  font-size: 14px;
  color: #fff;
  text-decoration: none;
  transition: all 0.4s ease;
  will-change: color;

  &:hover {
    text-decoration: none;
    color: #00fff2;
  }
`;

const LinkForgotSuccess = styled(Link)`
  font-size: 14px;
  color: #fff;
  text-decoration: none;
  display: flex;
  justify-content: center;
  padding: 10px;
  background-color: #51505d;
  color: #fffcd1;
  border-radius: 5px;
  transition: all 0.4s ease;
  will-change: background-color;
  width: 100%;

  &:hover {
    text-decoration: none;
    background-color: #3c3b46;
    color: #fffcd1;
  }
`;
