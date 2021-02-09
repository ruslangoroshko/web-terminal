import React, { useState, useEffect, FC } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextParagraph, PrimaryTextSpan } from '../styles/TextsElements';
import { useFormik } from 'formik';
import Fields from '../constants/fields';
import LabelInputMasked from '../components/LabelInputMasked';
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
import validationInputTexts from '../constants/validationInputTexts';
import { useTranslation } from 'react-i18next';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../constants/mixpanelEvents';

const PhoneVerification: FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [dialMask, setDialMask] = useState('');
  const countriesNames = countries.map((item) => item.name);
  const { t } = useTranslation();

  const validationSchema = yup.object().shape<PhoneVerificationFormParams>({
    phone: yup
      .string()
      .min(11, t('Min 11 symbols'))
      .max(20, t('Max 20 symbols'))
      .required(),
    country: yup
      .mixed()
      .oneOf(countriesNames, t('No matches'))
      .required(t(validationInputTexts.REQUIRED_FIELD)),
  });

  const { push } = useHistory();
  const { kycStore, mainAppStore } = useStores();

  const [initialValues, setInitialValuesForm] = useState<
    PhoneVerificationFormParams
  >({
    country: '',
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
    setDialMask(country.dial);
  };

  const handleSubmitForm = ({ phone }: PhoneVerificationFormParams) => {
    try {
      API.setKeyValue({
        key: KeysInApi.PERSONAL_DATA,
        value: JSON.stringify({ ...initialValuesPeronalData, phone }),
      });
      kycStore.setFilledStep(KYCstepsEnum.PersonalData);
      push(Page.PROOF_OF_IDENTITY);
    } catch (error) {}
  };

  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await API.getCountries(
          CountriesEnum.EN,
          mainAppStore.initModel.authUrl
        );
        setCountries(response);
      } catch (error) {}
    }
    fetchCountries();

    kycStore.setCurrentStep(KYCstepsEnum.PhoneVerification);
  }, []);

  useEffect(() => {
    async function fetchCurrentStep() {
      try {
        const response = await API.getKeyValue(KeysInApi.PERSONAL_DATA);
        if (response) {
          const parsed: PersonalDataParams = JSON.parse(response);
          if (parsed instanceof Object) {
            setValuesPeronalData(parsed);
            const { phone, countryOfCitizenship } = parsed;
            setInitialValuesForm({
              phone:
                mainAppStore.profilePhone ||
                phone ||
                countries.find((item) => item.name === countryOfCitizenship)
                  ?.dial ||
                '',
              country: countryOfCitizenship,
            });
            setDialMask(
              countries.find((item) => item.name === countryOfCitizenship)
                ?.dial || ''
            );
            kycStore.setFilledStep(KYCstepsEnum.PhoneVerification);
          }
        }
      } catch (error) {}
    }
    if (countries.length) {
      fetchCurrentStep();
    }
  }, [countries]);

  const {
    setFieldValue,
    validateForm,
    handleSubmit,
    errors,
    touched,
    getFieldProps,
  } = useFormik({
    initialValues,
    onSubmit: handleSubmitForm,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: true,
    enableReinitialize: true,
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
          {t('Phone verification')}
        </PrimaryTextParagraph>
        <PrimaryTextSpan
          marginBottom="40px"
          fontSize="14px"
          lineHeight="20px"
          color="rgba(255, 255, 255, 0.4)"
        >
          {t('Improve your account protection by linking your phone number.')}
        </PrimaryTextSpan>
        <FlexContainer flexDirection="column">
          <CustomForm onSubmit={handleSubmit} noValidate>
            <FlexContainer width="320px" margin="0 0 28px 0">
              <FlexContainer flexDirection="column" width="100%">
                <AutoCompleteDropdown
                  labelText={t('Country')}
                  {...getFieldProps(Fields.CUSTOM_COUNTRY)}
                  id={Fields.CUSTOM_COUNTRY}
                  hasError={!!(touched.country && errors.country)}
                  dropdownItemsList={countries}
                  setFieldValue={setFieldValue}
                  handleChange={handleChangeCountry(setFieldValue)}
                ></AutoCompleteDropdown>
              </FlexContainer>
            </FlexContainer>
            <FlexContainer width="320px" margin="0 0 28px 0">
              <FlexContainer width="100%" flexDirection="column">
                <LabelInputMasked
                  mask={`${dialMask}99999999999999999999`}
                  labelText={t('Phone')}
                  {...getFieldProps(Fields.PHONE)}
                  id={Fields.PHONE}
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
                  {t('Save and continue')}
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
