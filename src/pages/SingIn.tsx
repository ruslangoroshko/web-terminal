import React from 'react';
import { Formik, Field, Form, FieldProps } from 'formik';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { UserAuthenticate } from '../types/UserInfo';
import * as yup from 'yup';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import Fields from '../constants/fields';
import { useStores } from '../hooks/useStores';
import { observer } from 'mobx-react-lite';

const SingIn = observer(() => {
  const validationSchema = yup.object().shape<UserAuthenticate>({
    email: yup.string().required('Required any value'),
    password: yup.string().required('Required any value'),
  });

  const initialValues: UserAuthenticate = {
    email: '',
    password: '',
  };

  const { mainAppStore } = useStores();

  const handleSubmit = async (credentials: UserAuthenticate) => {
    mainAppStore.signIn(credentials);
  };

  return (
    <FlexContainer
      justifyContent="center"
      alignItems="center"
      height="100%"
      width="100%"
    >
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
                      placeholder="Enter value"
                    />
                    <ErrorMessage>{meta.touched && meta.error}</ErrorMessage>
                  </FlexContainer>
                )}
              </Field>

              <SubmitButton
                type="submit"
                disabled={!formikBag.isValid || formikBag.isSubmitting}
              >
                Sign in
              </SubmitButton>
            </FlexContainer>
          </CustomForm>
        )}
      </Formik>
    </FlexContainer>
  );
});

export default SingIn;

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
