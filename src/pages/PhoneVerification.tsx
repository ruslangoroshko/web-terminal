import React, { useState, useEffect, FC } from 'react'
import { FlexContainer } from '../styles/FlexContainer'
import { PrimaryTextParagraph, PrimaryTextSpan } from '../styles/TextsElements';
import { Formik, Field, FieldProps, Form } from 'formik';
import Fields from '../constants/fields';
import LabelInput from '../components/LabelInput';
import AutoCompleteDropdown from '../components/KYC/AutoCompleteDropdown';
import { PrimaryButton } from '../styles/Buttons';
import styled from '@emotion/styled';
import { PhoneVerificationFormParams } from '../types/PersonalDataTypes';
import { Country } from '../types/CountriesTypes';
import API from '../helpers/API';
import { CountriesEnum } from '../enums/CountriesEnum';
import * as yup from 'yup'

interface Props {}

const PhoneVerification: FC<Props> = props => {
  const {} = props;

  const validationSchema = yup.object().shape<PhoneVerificationFormParams>({
    phone: yup.string().required(),
    customCountryCode: yup.string(),
  });

  const [countries, setCountries] = useState<Country[]>([]);

  const initialValues: PhoneVerificationFormParams = {
    customCountryCode: '',
    phone: '',
  };

  const handleSubmit = () => {
    debugger;
  };

  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await API.getCountries(CountriesEnum.EN);
        setCountries(response);
      } catch (error) {}
    }

    fetchCountries();
  }, []);

  return (
    <FlexContainer
      width="100%"
      height="100%"
      flexDirection="column"
      alignItems="center"
      backgroundColor="#252636"
    >
      <FlexContainer width="568px" flexDirection="column" padding="20px 0 0 0">
        <PrimaryTextParagraph
          fontSize="30px"
          fontWeight="bold"
          color="#fffccc"
          marginBottom="8px"
        >
          Phone verification
        </PrimaryTextParagraph>
        <PrimaryTextSpan
          marginBottom="40px"
          fontSize="14px"
          lineHeight="20px"
          color="rgba(255, 255, 255, 0.4)"
        >
          Improve your account protection by linking your phone number.
        </PrimaryTextSpan>
        <FlexContainer flexDirection="column">
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
            enableReinitialize
          >
            {({ submitForm, setFieldValue }) => (
              <CustomForm translate="en">
                <FlexContainer width="320px" margin="0 0 28px 0">
                  <Field type="text" name={Fields.CUSTOM_COUNTRY}>
                    {({ field, meta }: FieldProps) => (
                      <FlexContainer
                        margin="0 32px 0 0"
                        flexDirection="column"
                        width="100%"
                      >
                        <AutoCompleteDropdown
                          labelText="Country"
                          id={field.name}
                          {...field}
                          hasError={!!(meta.touched && meta.error)}
                          dropdownItemsList={countries}
                          setFieldValue={setFieldValue}
                        ></AutoCompleteDropdown>
                      </FlexContainer>
                    )}
                  </Field>
                </FlexContainer>
                <FlexContainer width="320px" margin="0 0 28px 0">
                  <Field
                    type="text"
                    name={Fields.PHONE}
                    flexDirection="column"
                  >
                    {({ field, meta }: FieldProps) => (
                      <FlexContainer width="100%" flexDirection="column">
                        <LabelInput
                          labelText="Last name"
                          id={field.name}
                          {...field}
                          hasError={!!(meta.touched && meta.error)}
                          errorText={meta.error}
                        />
                      </FlexContainer>
                    )}
                  </Field>
                </FlexContainer>
                <FlexContainer>
                  <PrimaryButton
                    type="button"
                    onClick={submitForm}
                    padding="8px 32px"
                  >
                    <PrimaryTextSpan
                      color="#003A38"
                      fontWeight="bold"
                      fontSize="14px"
                    >
                      Save and continue
                    </PrimaryTextSpan>
                  </PrimaryButton>
                </FlexContainer>
              </CustomForm>
            )}
          </Formik>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default PhoneVerification;


const CustomForm = styled(Form)`
  margin: 0;
`;