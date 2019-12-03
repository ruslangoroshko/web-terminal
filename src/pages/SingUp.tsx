import React, { useContext } from 'react';
import {
  Formik,
  Field,
  Form,
  FieldProps,
  FormikValues,
  FieldMetaProps,
  FormikHelpers,
} from 'formik';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { MainAppContext } from '../store/MainAppProvider';
import { UserAuthenticate, UserRegistration } from '../types/UserInfo';
import * as yup from 'yup';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import Fields from '../constants/fields';

interface Props {}

function SingUp(props: Props) {
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

  const { signUp } = useContext(MainAppContext);

  const handleSubmit = async (
    { email, password }: UserRegistration,
    { setStatus, setSubmitting }: FormikHelpers<UserRegistration>
  ) => {
    setSubmitting(true);
    try {
      await signUp({ email, password });
    } catch (error) {
      setStatus(error);
      setSubmitting(false);
    }
  };

  return (
    <FlexContainer justifyContent="center" alignItems="center" height="100vh">
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
                    padding="0 0 20px 0"
                    flexDirection="column"
                  >
                    <InputLabel>Email</InputLabel>
                    <Input
                      type="text"
                      {...field}
                      value={field.value || ''}
                      placeholder="Enter value"
                    />
                    <ErrorMessage>{meta.touched && meta.error}</ErrorMessage>
                  </FlexContainer>
                )}
              </Field>
              <Field type="text" name={Fields.PASSWORD}>
                {({ field, meta }: FieldProps) => (
                  <FlexContainer
                    position="relative"
                    padding="0 0 20px 0"
                    flexDirection="column"
                  >
                    <InputLabel>Password</InputLabel>
                    <Input
                      type="password"
                      {...field}
                      value={field.value || ''}
                      placeholder="Enter password"
                    />
                    <ErrorMessage>{meta.touched && meta.error}</ErrorMessage>
                  </FlexContainer>
                )}
              </Field>
              <Field type="text" name={Fields.REPEAT_PASSWORD}>
                {({ field, meta }: FieldProps) => (
                  <FlexContainer
                    position="relative"
                    padding="0 0 20px 0"
                    flexDirection="column"
                  >
                    <InputLabel>Repeat password</InputLabel>
                    <Input
                      type="password"
                      {...field}
                      value={field.value || ''}
                      placeholder="Repeat password"
                    />
                    <ErrorMessage>{meta.touched && meta.error}</ErrorMessage>
                  </FlexContainer>
                )}
              </Field>
              {formikBag.status && (
                <ErrorMessage>{formikBag.status}</ErrorMessage>
              )}
              <SubmitButton
                type="submit"
                disabled={!formikBag.isValid || formikBag.isSubmitting}
              >
                Sign up
              </SubmitButton>
            </FlexContainer>
          </CustomForm>
        )}
      </Formik>
    </FlexContainer>
  );
}

export default SingUp;

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
  background-color: transparent;
  padding: 4px 10px;
  color: #000;
`;

const InputLabel = styled.p`
  font-size: 14px;
  margin-bottom: 4px;
  color: #000;
  font-weight: bold;
`;
