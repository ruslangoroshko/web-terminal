import React from 'react';
import { Formik, Field, Form, FieldProps, FormikHelpers } from 'formik';
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
import { useHistory, Link } from 'react-router-dom';
import Checkbox from '../components/Checkbox';

function SignUp() {
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
    
    userAgreement: yup
      .boolean()
      .required(),          
  });

  const initialValues: UserRegistration = {
    email: '',
    password: '',
    repeatPassword: '',
    userAgreement: false
  };

  const { push } = useHistory();
  const { mainAppStore } = useStores();

  const handleSubmit = async (
    { email, password }: UserRegistration,
    { setStatus, setSubmitting }: FormikHelpers<UserRegistration>
  ) => {
    setSubmitting(true);
    try {
      await mainAppStore.signUp({ email, password });
      push(Page.DASHBOARD);
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
                        id={field.name}
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
                        id={field.name}
                        autoComplete="new-password"
                        type="password"
                        hasError={!!(meta.touched && meta.error)}
                        errorText={meta.error}
                      ></LabelInput>
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
                        id={field.name}
                        autoComplete="new-password"
                        type="password"
                        hasError={!!(meta.touched && meta.error)}
                        errorText={meta.error}
                      ></LabelInput>
                    </FlexContainer>
                  )}
                </Field>

                <FlexContainer margin="0 0 15px 0">
                  <Checkbox
                    id="service-agreements"
                    onChange={e => console.log(e)}
                  >
                    <PrimaryTextSpan color="rgba(255,255,255,0.6)" fontSize="12px">
                      I’m 18 years old, and agree to {' '}
                      <CustomCheckboxLink to="//monfex.com/terms-of-service" target={'_blank'}>
                         Terms & Conditions 
                      </CustomCheckboxLink>
                      {' '} and {' '}
                      <CustomCheckboxLink to="//monfex.com/privacy-notice" target={'_blank'}>
                         Privacy Policy 
                      </CustomCheckboxLink>
                    </PrimaryTextSpan>
                  </Checkbox>
                </FlexContainer>
                {formikBag.status && (
                  <ErrorMessage>{formikBag.status}</ErrorMessage>
                )}
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
                    Sign up
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

const ErrorMessage = styled.span`
  color: red;
  position: absolute;
  bottom: -14px;
  font-size: 10px;
`;


const CustomCheckboxLink = styled(Link)`
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.4s ease;
  text-decoration: underline;
  font-size: 12px;
  :hover {
    text-decoration: none;
    color: rgba(255, 255, 255, 1);
  }
`;
