import React, { useState, useEffect, FC } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextParagraph, PrimaryTextSpan } from '../styles/TextsElements';
import { Formik, Field, FieldProps, Form, useFormik } from 'formik';
import Fields from '../constants/fields';
import LabelInput from '../components/LabelInput';
import AutoCompleteDropdown from '../components/KYC/AutoCompleteDropdown';
import { PrimaryButton } from '../styles/Buttons';
import styled from '@emotion/styled';
import {
  PhoneVerificationFormParams,
  PersonalDataParams,
} from '../types/PersonalDataTypes';
import { Country } from '../types/CountriesTypes';
import API from '../helpers/API';
import { CountriesEnum } from '../enums/CountriesEnum';
import * as yup from 'yup';
import KeysInApi from '../constants/keysInApi';
import { useStores } from '../hooks/useStores';
import { KYCstepsEnum } from '../enums/KYCsteps';
import Page from '../constants/Pages';
import { useHistory } from 'react-router-dom';
import { getProcessId } from '../helpers/getProcessId';
import { SexEnum } from '../enums/Sex';

interface Props {}

const PhoneVerification: FC<Props> = props => {
  const {} = props;
  const [countries, setCountries] = useState<Country[]>([]);
  const countriesNames = countries.map(item => item.name);

  const validationSchema = yup.object().shape<PhoneVerificationFormParams>({
    phone: yup
      .string()
      .min(11, 'Min 11 symbols')
      .max(20, 'Max 20 symbols')
      .required(),
    customCountryCode: yup.mixed().oneOf(countriesNames, 'No matches'),
  });
  const { push } = useHistory();

  const { kycStore } = useStores();

  const [initialValues, setInitialValuesForm] = useState<
    PhoneVerificationFormParams
  >({
    customCountryCode: '',
    phone: '',
  });

  const [initialValuesPeronalData, setValuesPeronalData] = useState<
    PersonalDataParams
  >({
    city: '',
    countryOfCitizenship: '',
    countryOfResidence: '',
    dateOfBirth: 0,
    firstName: '',
    lastName: '',
    postalCode: '',
    processId: getProcessId(),
    sex: SexEnum.Unknown,
    address: '',
    uSCitizen: false,
    phone: '',
  });

  const handleChangeCountry = (setFieldValue: any) => (country: Country) => {
    setFieldValue(Fields.PHONE, country.dial);
  };

  const handleSubmitForm = ({ phone }: PhoneVerificationFormParams) => {
    try {
      API.setKeyValue({
        key: KeysInApi.PERSONAL_DATA,
        value: JSON.stringify({ ...initialValuesPeronalData, phone }),
      });
      kycStore.filledStep = KYCstepsEnum.PersonalData;
      push(Page.PROOF_OF_IDENTITY);
    } catch (error) {}
  };

  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await API.getCountries(CountriesEnum.EN);
        setCountries(response);
      } catch (error) {}
    }

    async function fetchCurrentStep() {
      try {
        const response = await API.getKeyValue(KeysInApi.PERSONAL_DATA);

        if (response) {
          const parsed: PersonalDataParams = JSON.parse(response);
          if (parsed instanceof Object) {
            setValuesPeronalData(parsed);
            const { phone, countryOfCitizenship } = parsed;
            setInitialValuesForm({
              phone,
              customCountryCode: countryOfCitizenship,
            });
            kycStore.filledStep = KYCstepsEnum.PhoneVerification;
          }
        }
      } catch (error) {}
    }
    fetchCurrentStep();
    fetchCountries();
    kycStore.currentStep = KYCstepsEnum.PhoneVerification;
  }, []);

  const {
    values,
    setFieldValue,
    validateForm,
    handleSubmit,
    handleChange,
    errors,
    touched,
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
    <FlexContainer
      width="100%"
      height="100%"
      flexDirection="column"
      alignItems="center"
      backgroundColor="#252636"
    >
      <FlexContainer width="568px" flexDirection="column" padding="40px 0">
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
          <CustomForm onSubmit={handleSubmit} noValidate>
            <FlexContainer width="320px" margin="0 0 28px 0">
              <FlexContainer flexDirection="column" width="100%">
                <AutoCompleteDropdown
                  labelText="Country"
                  id={Fields.CUSTOM_COUNTRY}
                  onChange={handleChange}
                  name={Fields.CUSTOM_COUNTRY}
                  value={values.customCountryCode || ''}
                  hasError={
                    !!(touched.customCountryCode && errors.customCountryCode)
                  }
                  dropdownItemsList={countries}
                  setFieldValue={setFieldValue}
                  handleChange={handleChangeCountry(setFieldValue)}
                ></AutoCompleteDropdown>
              </FlexContainer>
            </FlexContainer>
            <FlexContainer width="320px" margin="0 0 28px 0">
            <FlexContainer width="100%" flexDirection="column">
                    <LabelInput
                      labelText="Phone"
                      name={Fields.PHONE}
                      id={Fields.PHONE}
                      onChange={handleChange}
                      value={values.phone || ''}
                      hasError={!!(touched.phone && errors.phone)}
                      errorText={errors.phone}
                    />
                  </FlexContainer>
            </FlexContainer>
            <FlexContainer>
              <PrimaryButton
                type="submit"
                onClick={handlerClickSubmit}
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
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default PhoneVerification;

const CustomForm = styled.form`
  margin: 0;
`;
