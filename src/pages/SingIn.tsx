import React from 'react';
import { Formik, Field, Form, FieldProps } from 'formik';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { UserAuthenticate } from '../types/UserInfo';
import * as yup from 'yup';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import Fields from '../constants/fields';
import { useStores } from '../hooks/useStores';
import { observer, Observer } from 'mobx-react-lite';
import SignFlowLayout from '../components/SignFlowLayout';
import LabelInput from '../components/LabelInput';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { PrimaryButton } from '../styles/Buttons';
import SignTypeTabs from '../components/SignTypeTabs';
import LoaderFullscreen from '../components/LoaderFullscreen';
import NotificationPopup from '../components/NotificationPopup';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import apiResponseCodeMessages from '../constants/apiResponseCodeMessages';

const SingIn = observer(() => {
  const validationSchema = yup.object().shape<UserAuthenticate>({
    email: yup.string().required('Required any value'),
    password: yup.string().required('Required any value'),
  });

  const initialValues: UserAuthenticate = {
    email: '',
    password: '',
  };

  const { mainAppStore, notificationStore } = useStores();

  const handleSubmit = async (credentials: UserAuthenticate) => {
    const result = await mainAppStore.signIn(credentials);
    if (result !== OperationApiResponseCodes.Ok) {
      notificationStore.notificationMessage = apiResponseCodeMessages[result];
      notificationStore.isSuccessfull = false;
      notificationStore.openNotification();
    }
  };

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
      <LoaderFullscreen isLoading={mainAppStore.isLoading}></LoaderFullscreen>
      <FlexContainer width="320px" flexDirection="column">
        <SignTypeTabs></SignTypeTabs>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {formikBag => (
            <CustomForm translate="en">
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
                      ></LabelInput>
                      <ErrorMessage>{meta.touched && meta.error}</ErrorMessage>
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
                      ></LabelInput>
                      <ErrorMessage>{meta.touched && meta.error}</ErrorMessage>
                    </FlexContainer>
                  )}
                </Field>

                <PrimaryButton
                  padding="12px"
                  type="submit"
                  disabled={!formikBag.isValid || formikBag.isSubmitting}
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
