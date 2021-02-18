import React, { useEffect } from 'react';
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
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

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
      .max(31, t(validationInputTexts.PASSWORD_MAX_CHARACTERS)),
  });

  const initialValues: UserAuthenticate = {
    email: '',
    password: '',
  };

  const { mainAppStore, notificationStore, badRequestPopupStore } = useStores();

  const handleSubmitForm = async (credentials: UserAuthenticate) => {
    mainAppStore.setInitLoading(true);
    try {
      const result = await mainAppStore.signIn(credentials);
      if (result !== OperationApiResponseCodes.Ok) {
        notificationStore.setNotification(t(
          apiResponseCodeMessages[result]
        ));
        notificationStore.setIsSuccessfull(false);
        notificationStore.openNotification();
        mainAppStore.setInitLoading(false);

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
      badRequestPopupStore.openModal();
      badRequestPopupStore.setMessage(error);
      mainAppStore.setInitLoading(false);
    }
  };

  const { handleSubmit, control, errors, formState } = useForm<
    UserAuthenticate
  >({
    resolver: yupResolver(validationSchema),
    shouldFocusError: true,
    mode: 'onSubmit',
    defaultValues: initialValues,
  });

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
        <CustomForm noValidate onSubmit={handleSubmit(handleSubmitForm)}>
          <FlexContainer flexDirection="column">
            <FlexContainer
              position="relative"
              flexDirection="column"
              margin="0 0 16px 0"
            >
              <Controller
                control={control}
                name={Fields.EMAIL}
                render={(
                  { onChange, value, name, ref, onBlur },
                  { invalid, isTouched, isDirty }
                ) => (
                  <LabelInput
                    ref={ref}
                    onChange={onChange}
                    onBlur={onBlur}
                    name={name}
                    labelText={t('Email')}
                    value={value}
                    id={Fields.EMAIL}
                    hasError={!!(invalid && errors.email)}
                    errorText={errors.email?.message}
                    datae2eId={e2eTests.SING_IN_USERNAME}
                  ></LabelInput>
                )}
              />
            </FlexContainer>
            <FlexContainer
              position="relative"
              flexDirection="column"
              margin="0 0 16px 0"
            >
              <Controller
                control={control}
                name={Fields.PASSWORD}
                render={(
                  { onChange, value, name, ref },
                  { invalid, isTouched, isDirty }
                ) => (
                  <LabelInput
                    ref={ref}
                    name={name}
                    onChange={onChange}
                    labelText={t('Password')}
                    value={value}
                    id={Fields.PASSWORD}
                    type="password"
                    hasError={!!(invalid && errors.password)}
                    errorText={errors.password?.message}
                    datae2eId={e2eTests.SING_IN_PASSWORD}
                  ></LabelInput>
                )}
              />
            </FlexContainer>

            <PrimaryButton
              padding="12px"
              type="submit"
              data-e2e-id={e2eTests.SING_IN_FORM}
              disabled={formState.isSubmitting}
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
