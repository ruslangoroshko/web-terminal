import React, { useEffect } from 'react';
import { Formik, Field, Form, FieldProps } from 'formik';
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
import mixpanelEvents from '../constants/mixpanelFields';
import Pages from '../constants/Pages';
import validationInputTexts from '../constants/validationInputTexts';

const SingIn = observer(() => {
  const validationSchema = yup.object().shape<UserAuthenticate>({
    email: yup
      .string()
      .required(validationInputTexts.EMAIL)
      .email(validationInputTexts.EMAIL),
    password: yup.string().required(validationInputTexts.REQUIRED_FIELD),
  });

  const initialValues: UserAuthenticate = {
    email: '',
    password: '',
  };

  const { mainAppStore, notificationStore } = useStores();

  const handleSubmit = async (credentials: UserAuthenticate) => {
    try {
      const result = await mainAppStore.signIn(credentials);
      if (result !== OperationApiResponseCodes.Ok) {
        notificationStore.notificationMessage = apiResponseCodeMessages[result];
        notificationStore.isSuccessfull = false;
        notificationStore.openNotification();
      }
    } catch (error) {
      notificationStore.notificationMessage = error;
      notificationStore.isSuccessfull = false;
      notificationStore.openNotification();
    }
  };

  useEffect(() => {
    mixpanel.track(mixpanelEvents.LOGIN_VIEW);
  }, []);

  return (
    <SignFlowLayout>
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
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {formikBag => (
            <CustomForm translate="en" noValidate>
              <FlexContainer flexDirection="column">
                <Field type="text" name={Fields.EMAIL}>
                  {({ field, meta }: FieldProps) => (
                    <FlexContainer
                      position="relative"
                      flexDirection="column"
                      margin="0 0 16px 0"
                    >
                      <LabelInput
                        {...field}
                        labelText="Email"
                        value={field.value || ''}
                        id={Fields.EMAIL}
                        hasError={!!(meta.touched && meta.error)}
                        errorText={meta.error}
                      ></LabelInput>
                    </FlexContainer>
                  )}
                </Field>
                <Field type="text" name={Fields.PASSWORD}>
                  {({ field, meta }: FieldProps) => (
                    <FlexContainer
                      position="relative"
                      flexDirection="column"
                      margin="0 0 16px 0"
                    >
                      <LabelInput
                        {...field}
                        labelText="Password"
                        value={field.value || ''}
                        id={Fields.PASSWORD}
                        type="password"
                        hasError={!!(meta.touched && meta.error)}
                        errorText={meta.error}
                      ></LabelInput>
                    </FlexContainer>
                  )}
                </Field>

                <PrimaryButton
                  padding="12px"
                  type="submit"
                  //disabled={!formikBag.isValid || formikBag.isSubmitting}
                >
                  <PrimaryTextSpan
                    color="#1c2026"
                    fontWeight="bold"
                    fontSize="14px"
                    textTransform="uppercase"
                  >
                    Log in
                  </PrimaryTextSpan>
                </PrimaryButton>

                <FlexContainer
                  alignItems="center"
                  justifyContent="center"
                  padding="12px 0"
                >
                  <LinkForgot to={Pages.FORGOT_PASSWORD}>
                    Forgot password?
                  </LinkForgot>
                </FlexContainer>
              </FlexContainer>
            </CustomForm>
          )}
        </Formik>
      </FlexContainer>
    </SignFlowLayout>
  );
});

export default SingIn;

const CustomForm = styled(Form)`
  margin: 0;
`;

const ErrorMessage = styled.span`
  color: red;
  position: absolute;
  bottom: 0;
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
