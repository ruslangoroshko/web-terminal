import React, { useState, useEffect } from 'react';
import SignFlowLayout from '../components/SignFlowLayout';
import { Formik, Field, Form, FieldProps, FormikHelpers } from 'formik';
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

interface Props {}

function ForgotPassword(props: Props) {
  const validationSchema = yup.object().shape<UserForgotPassword>({
    email: yup
      .string()
      .required(validationInputTexts.EMAIL)
      .email(validationInputTexts.EMAIL),
  });

  const initialValues: UserForgotPassword = {
    email: '',
  };

  const {} = props;

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessfull] = useState(false);

  const handlerSubmit = (
    { email }: UserForgotPassword,
    { setSubmitting }: FormikHelpers<UserForgotPassword>
  ) => {
    setIsLoading(true);
    API.forgotEmail(email)
      .then(() => setIsSuccessfull(true))
      .catch(() => setSubmitting(true))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    mixpanel.track(mixpanelEvents.FORGOT_PASSWORD_VIEW);
  }, []);

  return (
    <SignFlowLayout>
      <LoaderFullscreen isLoading={isLoading} />

      <FlexContainer width="320px" maxWidth="100%" flexDirection="column">
        {isSuccessful ? (
          <>
            <PrimaryTextParagraph
              color="#fffccc"
              fontSize="24px"
              fontWeight="bold"
              marginBottom="20px"
            >
              Check your email
            </PrimaryTextParagraph>

            <FlexContainer alignItems="center" padding="20px 0">
              <FlexContainer margin="0 20px 0 0">
                <SvgIcon {...CheckDone} fillColor="#005E5E" />
              </FlexContainer>
              <PrimaryTextParagraph color="#7b7b85" fontSize="12px">
                We have sent you a link to create a new password.
              </PrimaryTextParagraph>
            </FlexContainer>

            <FlexContainer
              alignItems="center"
              justifyContent="center"
              padding="12px 0 20px"
            >
              <LinkForgotSuccess to={Pages.SIGN_IN}>
                Back to Log in
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
              Reset password
            </PrimaryTextParagraph>
            <PrimaryTextParagraph
              color="#7b7b85"
              fontSize="12px"
              marginBottom="24px"
            >
              To begin changing your password, please enter your e-mail
            </PrimaryTextParagraph>

            <Formik
              initialValues={initialValues}
              onSubmit={handlerSubmit}
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

                    <PrimaryButton
                      padding="12px"
                      type="submit"
                      disabled={formikBag.isSubmitting}
                    >
                      <PrimaryTextSpan
                        color="#1c2026"
                        fontWeight="bold"
                        fontSize="14px"
                        textTransform="uppercase"
                      >
                        Confirm
                      </PrimaryTextSpan>
                    </PrimaryButton>
                  </FlexContainer>
                </CustomForm>
              )}
            </Formik>

            <FlexContainer
              alignItems="center"
              justifyContent="center"
              padding="12px 0"
            >
              <LinkForgot to={Pages.SIGN_IN}>Back to Log in</LinkForgot>
            </FlexContainer>
          </>
        )}
      </FlexContainer>
    </SignFlowLayout>
  );
}

export default ForgotPassword;

const CustomForm = styled(Form)`
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
  width: 100%;

  &:hover {
    text-decoration: none;
    background-color: #3c3b46;
    color: #fffcd1;
  }
`;
