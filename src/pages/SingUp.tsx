import React, { useContext } from 'react';
import { Formik, Field, Form, FieldProps, FormikHelpers } from 'formik';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { UserRegistration } from '../types/UserInfo';
import * as yup from 'yup';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import Fields from '../constants/fields';
import { useStores } from '../hooks/useStores';
import SignFlowLayout from '../components/SignFlowLayout';
import LabelInput from '../components/LabelInput';
import { PrimaryButton } from '../styles/Buttons';
import { PrimaryTextSpan } from '../styles/TextsElements';
import SignTypeTabs from '../components/SignTypeTabs';

interface Props {}

function SignUp(props: Props) {
  const {} = props;

  const validationSchema = yup.object().shape<UserRegistration>({
    email: yup.string().required('Required any value'),
    password: yup
      .string()
      .required('Required any value')
      .min(8, 'min 8 characters')
      .matches(/^(?=.*\d)(?=.*[a-zA-Z])/, 'min one number and one symbol'),
    repeatPassword: yup
      .string()
      .oneOf([yup.ref(Fields.PASSWORD), null], 'Passwords must match'),
  });

  const initialValues: UserRegistration = {
    email: '',
    password: '',
    repeatPassword: '',
  };

  const { mainAppStore } = useStores();

  const handleSubmit = async (
    { email, password }: UserRegistration,
    { setStatus, setSubmitting }: FormikHelpers<UserRegistration>
  ) => {
    setSubmitting(true);
    try {
      await mainAppStore.signUp({ email, password });
    } catch (error) {
      setStatus(error);
      setSubmitting(false);
    }
  };

  return (
    <SignFlowLayout>
      <FlexContainer width="320px" flexDirection="column">
        <SignTypeTabs></SignTypeTabs>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {formikBag => (
            <CustomForm>
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
                        autoComplete="new-password"
                        type="password"
                        hasError={!!(meta.touched && meta.error)}
                      ></LabelInput>
                      <ErrorMessage>{meta.touched && meta.error}</ErrorMessage>
                    </FlexContainer>
                  )}
                </Field>
                <Field type="text" name={Fields.REPEAT_PASSWORD}>
                  {({ field, meta }: FieldProps) => (
                    <FlexContainer
                      position="relative"
                      flexDirection="column"
                      margin="0 0 16px 0"
                    >
                      <LabelInput
                        {...field}
                        labelText="Repeat Password"
                        value={field.value || ''}
                        id={Fields.REPEAT_PASSWORD}
                        autoComplete="new-password"
                        type="password"
                        hasError={!!(meta.touched && meta.error)}
                      ></LabelInput>
                      <ErrorMessage>{meta.touched && meta.error}</ErrorMessage>
                    </FlexContainer>
                  )}
                </Field>
                {formikBag.status && (
                  <ErrorMessage>{formikBag.status}</ErrorMessage>
                )}

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
                    Submit
                  </PrimaryTextSpan>
                </PrimaryButton>
              </FlexContainer>
            </CustomForm>
          )}
        </Formik>
      </FlexContainer>
    </SignFlowLayout>
  );
}

export default SignUp;

const CustomForm = styled(Form)`
  margin: 0;
`;

const SubmitButton = styled(ButtonWithoutStyles)`
  padding: 10px;
  color: #fff;
  transition: background-color 0.2s ease;
  width: 100%;
  border-radius: 4px;
  border: 2px solid #2c7be5;
  background-color: #2057a0;

  &:hover {
    cursor: pointer;
    background-color: #2c7be5;
  }

  &:disabled {
    pointer-events: none;
    &:hover {
      background-color: transparent;
    }
  }
`;

const ErrorMessage = styled.span`
  color: red;
  position: absolute;
  bottom: 0;
  font-size: 10px;
`;

const Input = styled.input`
  border: 1px solid #353c4d;
  width: 100%;
  background-color: #fff;
  padding: 4px 10px;
  color: #000;
`;

const InputLabel = styled.p`
  font-size: 14px;
  margin-bottom: 4px;
  color: #fffccc;
  font-weight: bold;
`;
