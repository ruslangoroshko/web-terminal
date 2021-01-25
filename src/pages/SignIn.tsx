import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { UserAuthenticate } from '../types/UserInfo';
import * as yup from 'yup';
import Fields from '../constants/fields';
import { useStores } from '../hooks/useStores';
import { observer, Observer } from 'mobx-react-lite';
import SignFlowLayout from '../components/SignFlowLayout';
import LabelInput from '../components/LabelInput';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { PrimaryButton } from '../styles/Buttons';
import SignTypeTabs from '../components/SignTypeTabs';
import NotificationPopup from '../components/NotificationPopup';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import apiResponseCodeMessages from '../constants/apiResponseCodeMessages';
import { Link } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../constants/mixpanelEvents';
import Pages from '../constants/Pages';
import validationInputTexts from '../constants/validationInputTexts';
import BadRequestPopup from '../components/BadRequestPopup';
import { useTranslation } from 'react-i18next';
import mixapanelProps from '../constants/mixpanelProps';
import Helmet from 'react-helmet';
import e2eTests from '../constants/e2eTests';

const SingIn = observer(() => {
  const { t } = useTranslation();
  const validationSchema = yup.object().shape<UserAuthenticate>({
    email: yup
      .string()
      .required(t(validationInputTexts.EMAIL))
      .email(t(validationInputTexts.EMAIL)),
    password: yup
      .string()
      .required(t(validationInputTexts.REQUIRED_FIELD))
      .min(8, t(validationInputTexts.PASSWORD_MIN_CHARACTERS))
      .max(40, t(validationInputTexts.PASSWORD_MAX_CHARACTERS)),
  });

  const initialValues: UserAuthenticate = {
    email: '',
    password: '',
  };

  const { mainAppStore, notificationStore, badRequestPopupStore } = useStores();

  const handleSubmitForm = async (credentials: UserAuthenticate) => {
    mainAppStore.isInitLoading = true;
    try {
      const result = await mainAppStore.signIn(credentials);
      if (result !== OperationApiResponseCodes.Ok) {
        notificationStore.notificationMessage = t(
          apiResponseCodeMessages[result]
        );
        notificationStore.isSuccessfull = false;
        notificationStore.openNotification();
        mainAppStore.isInitLoading = false;

        mixpanel.track(mixpanelEvents.LOGIN_FAILED, {
          [mixapanelProps.BRAND_NAME]: mainAppStore.initModel.brandProperty,
          [mixapanelProps.ERROR_TEXT]: t(apiResponseCodeMessages[result]),
          [mixapanelProps.EMAIL_FAILED]: credentials.email,
        });
      }
      if (result === OperationApiResponseCodes.Ok) {
        mixpanel.people.union({
          [mixapanelProps.BRAND_NAME]: mainAppStore.initModel.brandProperty,
          [mixapanelProps.PLATFORMS_USED]: 'web',
        });
        mixpanel.track(mixpanelEvents.LOGIN_VIEW, {
          [mixapanelProps.BRAND_NAME]: mainAppStore.initModel.brandProperty,
        });
      }
    } catch (error) {
      mainAppStore.isInitLoading = false;
      badRequestPopupStore.openModal();
      badRequestPopupStore.setMessage(error);
      mainAppStore.isInitLoading = false;
    }
  };

  const {
    values,
    validateForm,
    handleChange,
    handleSubmit,
    errors,
    touched,
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

  useEffect(() => {
    mixpanel.track(mixpanelEvents.LOGIN_VIEW, {
      [mixapanelProps.BRAND_NAME]: mainAppStore.initModel.brandProperty,
    });
  }, []);

  return (
    <SignFlowLayout>
      <Helmet>{t('Login')}</Helmet>
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
        <CustomForm
          noValidate
          onSubmit={handleSubmit}
          data-e2e-id={e2eTests.SING_IN_FORM}
        >
          <FlexContainer flexDirection="column">
            <FlexContainer
              position="relative"
              flexDirection="column"
              margin="0 0 16px 0"
            >
              <LabelInput
                name={Fields.EMAIL}
                onChange={handleChange}
                labelText={t('Email')}
                value={values.email || ''}
                id={Fields.EMAIL}
                hasError={!!(touched.email && errors.email)}
                errorText={errors.email}
                datae2eId={e2eTests.SING_IN_USERNAME}
              ></LabelInput>
            </FlexContainer>
            <FlexContainer
              position="relative"
              flexDirection="column"
              margin="0 0 16px 0"
            >
              <LabelInput
                name={Fields.PASSWORD}
                onChange={handleChange}
                labelText={t('Password')}
                value={values.password || ''}
                id={Fields.PASSWORD}
                type="password"
                hasError={!!(touched.password && errors.password)}
                errorText={errors.password}
                datae2eId={e2eTests.SING_IN_PASSWORD}
              ></LabelInput>
            </FlexContainer>

            <PrimaryButton
              padding="12px"
              type="submit"
              onClick={handlerClickSubmit}
              //disabled={!formikBag.isValid || formikBag.isSubmitting}
            >
              <PrimaryTextSpan
                color="#1c2026"
                fontWeight="bold"
                fontSize="14px"
                textTransform="uppercase"
              >
                {t('Log in')}
              </PrimaryTextSpan>
            </PrimaryButton>

            <FlexContainer
              alignItems="center"
              justifyContent="center"
              padding="12px 0"
            >
              <LinkForgot to={Pages.FORGOT_PASSWORD}>
                {t('Forgot password?')}
              </LinkForgot>
            </FlexContainer>
          </FlexContainer>
        </CustomForm>
      </FlexContainer>
    </SignFlowLayout>
  );
});

export default SingIn;

const CustomForm = styled.form`
  margin: 0;
`;

const LinkForgot = styled(Link)`
  font-size: 14px;
  color: #fff;
  text-decoration: none;
  transition: all 0.4s ease;

  &:hover {
    text-decoration: none;
    color: #00fff2;
  }
`;
