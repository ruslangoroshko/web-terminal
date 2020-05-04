import React, { useState } from 'react';
import SignFlowLayout from '../components/SignFlowLayout';
import {
  Formik,
  Field,
  Form,
  FieldProps,
  FormikHelpers,
  useFormik,
} from 'formik';
import LabelInput from '../components/LabelInput';
import { ResetPassword } from '../types/UserInfo';
import * as yup from 'yup';
import { PrimaryTextParagraph, PrimaryTextSpan } from '../styles/TextsElements';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryButton } from '../styles/Buttons';
import { Link, useParams } from 'react-router-dom';
import API from '../helpers/API';
import styled from '@emotion/styled';
import Pages from '../constants/Pages';
import LoaderFullscreen from '../components/LoaderFullscreen';
import Fields from '../constants/fields';
import CheckDone from '../assets/svg/icon-check-done.svg';
import SvgIcon from '../components/SvgIcon';
import validationInputTexts from '../constants/validationInputTexts';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../constants/mixpanelEvents';
import { useStores } from '../hooks/useStores';
import { Observer } from 'mobx-react-lite';
import BadRequestPopup from '../components/BadRequestPopup';

interface Props {}

function ResetPassword(props: Props) {
  const { token } = useParams();

  const validationSchema = yup.object().shape<ResetPassword>({
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
  });

  const initialValues: ResetPassword = {
    password: '',
    repeatPassword: '',
  };

  const {} = props;

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessfull] = useState(false);
  const [isNotSuccessful, setNotIsSuccessfull] = useState(false);

  const { notificationStore, badRequestPopupStore } = useStores();

  const handleSubmitForm = async ({ password }: ResetPassword) => {
    setIsLoading(true);
    try {
      const result = await API.recoveryPassword({
        token: token || '',
        password,
      });
      if (result !== OperationApiResponseCodes.Ok) {
        setIsSuccessfull(true);
      } else {
        setNotIsSuccessfull(true);
      }
      setIsLoading(false);
    } catch (error) {
      badRequestPopupStore.openModal();
      badRequestPopupStore.setMessage(error);
      setIsLoading(false);
      setIsSuccessfull(false);
      setNotIsSuccessfull(false);
    }
  };

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
    <SignFlowLayout>
      {isLoading && <LoaderFullscreen isLoading={isLoading} />}
      <Observer>
        {() => <>{badRequestPopupStore.isActive && <BadRequestPopup />}</>}
      </Observer>
      

      <FlexContainer width="320px" maxWidth="100%" flexDirection="column">
        {isSuccessful && (
          <>
            <PrimaryTextParagraph
              color="#fffccc"
              fontSize="24px"
              fontWeight="bold"
              marginBottom="20px"
            >
              Congratulation
            </PrimaryTextParagraph>

            <FlexContainer alignItems="center" padding="20px 0">
              <FlexContainer margin="0 20px 0 0">
                <SvgIcon {...CheckDone} fillColor="#005E5E" />
              </FlexContainer>
              <PrimaryTextParagraph color="#7b7b85" fontSize="12px">
                Your password has been successfully changed
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
        )}
        {isNotSuccessful && (
          <>
            <PrimaryTextParagraph
              color="#fffccc"
              fontSize="24px"
              fontWeight="bold"
              marginBottom="20px"
            >
              The link has expired
            </PrimaryTextParagraph>

            <FlexContainer alignItems="center" padding="20px 0">
              <FlexContainer margin="0 20px 0 0">
                <FallDownIco />
              </FlexContainer>
              <PrimaryTextParagraph color="#7b7b85" fontSize="12px">
                The link you followed has expired. Please try again.
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
        )}
        {!isSuccessful && !isNotSuccessful && (
          <>
            <PrimaryTextParagraph
              color="#fffccc"
              fontSize="24px"
              fontWeight="bold"
              marginBottom="20px"
            >
              Set a new password
            </PrimaryTextParagraph>

            <CustomForm onSubmit={handleSubmit} noValidate>
              <FlexContainer flexDirection="column">
                <FlexContainer
                  position="relative"
                  flexDirection="column"
                  margin="0 0 16px 0"
                >
                  <LabelInput
                    name={Fields.PASSWORD}
                    id={Fields.PASSWORD}
                    labelText="Password"
                    value={values.password || ''}
                    onChange={handleChange}
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
                    name={Fields.REPEAT_PASSWORD}
                    id={Fields.REPEAT_PASSWORD}
                    onChange={handleChange}
                    labelText="Repeat Password"
                    value={values.repeatPassword || ''}
                    autoComplete="new-password"
                    type="password"
                    hasError={
                      !!(touched.repeatPassword && errors.repeatPassword)
                    }
                    errorText={errors.repeatPassword}
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
                    Confirm
                  </PrimaryTextSpan>
                </PrimaryButton>
              </FlexContainer>
            </CustomForm>

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

export default ResetPassword;

const FallDownIco = () => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24Z"
        fill="#444444"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M24 47C36.7025 47 47 36.7025 47 24C47 11.2975 36.7025 1 24 1C11.2975 1 1 11.2975 1 24C1 36.7025 11.2975 47 24 47ZM24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z"
        fill="white"
        fill-opacity="0.1"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M23.6465 24.3535L17.0002 17.7071L17.7073 17L24.3536 23.6464L31 17L31.7071 17.7071L25.0608 24.3535L31.7073 31L31.0002 31.7071L24.3536 25.0606L17.7071 31.7071L17 31L23.6465 24.3535Z"
        fill="#FF557E"
      />
    </svg>
  );
};

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
