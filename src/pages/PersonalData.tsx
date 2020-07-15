import React, { useEffect, useState } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextParagraph, PrimaryTextSpan } from '../styles/TextsElements';
import LabelInput from '../components/LabelInput';
import styled from '@emotion/styled';
import { Formik, Field, FieldProps, Form, useFormik } from 'formik';
import * as yup from 'yup';
import { PersonalDataParams } from '../types/PersonalDataTypes';
import moment from 'moment';
import { getProcessId } from '../helpers/getProcessId';
import { SexEnum } from '../enums/Sex';
import Fields from '../constants/fields';
import Checkbox from '../components/Checkbox';
import InformationPopup from '../components/InformationPopup';
import { PrimaryButton } from '../styles/Buttons';
import GenderDropdown from '../components/KYC/GenderDropdown';
import AutoCompleteDropdown from '../components/KYC/AutoCompleteDropdown';
import API from '../helpers/API';
import { CountriesEnum } from '../enums/CountriesEnum';
import { Country } from '../types/CountriesTypes';
import BirthDayPicker from '../components/KYC/BirthDayPicker';
import KeysInApi from '../constants/keysInApi';
import { useStores } from '../hooks/useStores';
import { KYCstepsEnum } from '../enums/KYCsteps';
import Page from '../constants/Pages';
import { useHistory } from 'react-router-dom';
import { Observer } from 'mobx-react-lite';
import BadRequestPopup from '../components/BadRequestPopup';

function PersonalData() {
  const [countries, setCountries] = useState<Country[]>([]);
  const countriesNames = countries.map(item => item.name);

  const validationSchema = yup.object().shape<PersonalDataParams>({
    firstName: yup
      .string()
      .min(2, 'Min 2 symbols')
      .max(100, 'Max 100 symbols')
      .required('Required field'),

    lastName: yup
      .string()
      .min(2, 'Min 2 symbols')
      .max(100, 'Max 100 symbols'),
    dateOfBirth: yup.number().required(),
    sex: yup.number().required(),
    countryOfResidence: yup
      .mixed()
      .oneOf(countriesNames, 'No matches')
      .required('Required field'),
    city: yup
      .string()
      .min(2, 'Min 2 symbols')
      .max(20, 'Max 20 symbols')
      .required('Required field'),
    countryOfCitizenship: yup
      .mixed()
      .oneOf(countriesNames, 'No matches')
      .required(),

    postalCode: yup
      .string()
      .min(2, 'Min 2 symbols')
      .max(15, 'Max 15 symbols')
      .required('Required field'),
    processId: yup.string(),

    address: yup
      .string()
      .min(2, 'Min 2 symbols')
      .max(100, 'Max 100 symbols')
      .required('Required field'),
    uSCitizen: yup.boolean().required(),
    phone: yup.string(),
  });

  const [birthday, setBirthday] = useState<moment.Moment>(moment().subtract(18, 'years'));

  const [focused, setFocused] = useState(false);
  const [submitForm, setSubitedForm] = useState(false);

  const { push } = useHistory();

  const [initialValues, setInitialValuesForm] = useState<PersonalDataParams>({
    city: '',
    countryOfCitizenship: '',
    countryOfResidence: '',
    dateOfBirth: birthday.valueOf(),
    firstName: '',
    lastName: '',
    postalCode: '',
    processId: getProcessId(),
    // sex: -1,
    address: '',
    uSCitizen: false,
    phone: '',
  });

  const { kycStore, badRequestPopupStore } = useStores();

  const handleSubmitForm = async (values: PersonalDataParams) => {
    try {
      await API.setKeyValue({
        key: KeysInApi.PERSONAL_DATA,
        value: JSON.stringify(values),
      });
      kycStore.filledStep = KYCstepsEnum.PersonalData;
      push(Page.PHONE_VERIFICATION);
    } catch (error) {}
  };

  const handleChangeGender = (setFieldValue: any) => (sex: SexEnum) => {
    setFieldValue(Fields.SEX, sex);
  };

  const handleChangeUsCitizien = (setFieldValue: any) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFieldValue(Fields.US_CITIZEN, e.target.checked);
  };

  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await API.getCountries(CountriesEnum.EN);
        setCountries(response);
      } catch (error) {
        badRequestPopupStore.openModal();
      badRequestPopupStore.setMessage(error);
      }
    }

    async function fetchCurrentStep() {
      kycStore.filledStep = KYCstepsEnum.NoData;

      try {
        const response = await API.getKeyValue(KeysInApi.PERSONAL_DATA);
        if (response) {
          const parsed = JSON.parse(response);
          if (parsed instanceof Object) {
            setInitialValuesForm(parsed);
            kycStore.filledStep = KYCstepsEnum.PersonalData;
          }
        }
      } catch (error) {
        badRequestPopupStore.setMessage(error);
        badRequestPopupStore.openModal();
      }
    }
    kycStore.currentStep = KYCstepsEnum.PersonalData;

    fetchCountries();
    fetchCurrentStep();
  }, []);

  const {
    values,
    setFieldValue,
    validateForm,
    handleSubmit,
    handleChange,
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
    setSubitedForm(true);
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
      padding="40px"
    >
      <Observer>
        {() => (
          <>
            {badRequestPopupStore.isActive && <BadRequestPopup />}
          </>
        )}
      </Observer>
      
      <FlexContainer width="568px" flexDirection="column">
        <PrimaryTextParagraph
          fontSize="30px"
          fontWeight="bold"
          color="#fffccc"
          marginBottom="8px"
        >
          Personal data
        </PrimaryTextParagraph>
        <PrimaryTextSpan
          marginBottom="40px"
          fontSize="14px"
          lineHeight="20px"
          color="rgba(255, 255, 255, 0.4)"
        >
          Your pesonal data will be kept in strict confidence. We will not
          disclose your data to third parties.
        </PrimaryTextSpan>
        <FlexContainer flexDirection="column">
          <CustomForm noValidate onSubmit={handleSubmit}>
            <FlexContainer width="100%" margin="0 0 28px 0">
              <FlexContainer
                margin="0 32px 0 0"
                flexDirection="column"
                width="50%"
              >
                <LabelInput
                  {...getFieldProps(Fields.FIRST_NAME)}
                  id={Fields.FIRST_NAME}
                  labelText="First name"
                  hasError={!!(touched.firstName && errors.firstName)}
                  errorText={errors.firstName}
                />
              </FlexContainer>

              <FlexContainer width="50%" flexDirection="column">
                <LabelInput
                  labelText="Last name"
                  id={Fields.LAST_NAME}
                  {...getFieldProps(Fields.LAST_NAME)}
                  hasError={!!(touched.lastName && errors.lastName)}
                  errorText={errors.lastName}
                />
              </FlexContainer>
            </FlexContainer>
            <FlexContainer width="100%" margin="0 0 28px 0">
              <FlexContainer
                margin="0 32px 0 0"
                flexDirection="column"
                width="50%"
                position="relative"
              >
                <PrimaryTextParagraph
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="11px"
                  textTransform="uppercase"
                  marginBottom="8px"
                >
                  date of birth
                </PrimaryTextParagraph>
                <BirthDayPicker
                  id={Fields.DATE_OF_BIRTH}
                  birthday={birthday}
                  focused={focused}
                  setBirthday={setBirthday}
                  setFocused={setFocused}
                ></BirthDayPicker>
              </FlexContainer>
              <FlexContainer width="50%" flexDirection="column">
                <GenderDropdown
                  hasError={!!(submitForm && errors.sex)}
                  errorText={errors.sex}
                  selectHandler={handleChangeGender(setFieldValue)}
                  selected={values.sex}
                ></GenderDropdown>
              </FlexContainer>
            </FlexContainer>
            <FlexContainer width="100%" margin="0 0 28px 0">
              <FlexContainer
                margin="0 32px 0 0"
                flexDirection="column"
                width="50%"
              >
                <AutoCompleteDropdown
                  labelText="Country of residence"
                  {...getFieldProps(Fields.COUNTRY_OF_RESIDENCE)}
                  id={Fields.COUNTRY_OF_RESIDENCE}
                  hasError={
                    !!(touched.countryOfResidence && errors.countryOfResidence)
                  }
                  dropdownItemsList={countries}
                  setFieldValue={setFieldValue}
                ></AutoCompleteDropdown>
              </FlexContainer>
              <FlexContainer width="50%" flexDirection="column">
                <LabelInput
                  labelText="City"
                  {...getFieldProps(Fields.CITY)}
                  id={Fields.CITY}
                  hasError={!!(touched.city && errors.city)}
                  errorText={errors.city}
                />
              </FlexContainer>
            </FlexContainer>
            <FlexContainer width="100%" margin="0 0 28px 0">
              <FlexContainer
                margin="0 32px 0 0"
                flexDirection="column"
                width="50%"
              >
                <AutoCompleteDropdown
                  labelText="Сitizenship"
                  {...getFieldProps(Fields.COUNTRY_OF_CITIENZENSHIP)}
                  id={Fields.COUNTRY_OF_CITIENZENSHIP}
                  hasError={
                    !!(
                      touched.countryOfCitizenship &&
                      errors.countryOfCitizenship
                    )
                  }
                  dropdownItemsList={countries}
                  setFieldValue={setFieldValue}
                ></AutoCompleteDropdown>
              </FlexContainer>
              <FlexContainer width="50%" flexDirection="column">
                <LabelInput
                  labelText="Postal code"
                  {...getFieldProps(Fields.POSTAL_CODE)}
                  id={Fields.POSTAL_CODE}
                  hasError={!!(touched.postalCode && errors.postalCode)}
                  errorText={errors.postalCode}
                />
              </FlexContainer>
            </FlexContainer>
            <FlexContainer width="100%" margin="0 0 28px 0">
              <FlexContainer flexDirection="column" width="100%">
                <LabelInput
                  labelText="Address of residence"
                  {...getFieldProps(Fields.ADDRESS)}
                  id={Fields.ADDRESS}
                  hasError={!!(touched.address && errors.address)}
                  errorText={errors.address}
                />
              </FlexContainer>
            </FlexContainer>
            <FlexContainer margin="0 0 40px 0">
              <Checkbox
                id="reportable"
                checked={values.uSCitizen}
                //name={Fields.US_CITIZEN}
                onChange={handleChangeUsCitizien(setFieldValue)}
              >
                <FlexContainer margin="0 0 0 8px">
                  <PrimaryTextSpan
                    color="#fffccc"
                    fontSize="14px"
                    marginRight="16px"
                  >
                    I’am a US reportable person
                  </PrimaryTextSpan>
                  <InformationPopup
                    bgColor="rgba(0, 0, 0, 0.6)"
                    classNameTooltip="reportable-tooltip"
                    direction="right"
                    width="334px"
                  >
                    <PrimaryTextSpan fontSize="12px" color="#fffccc">
                      A US reportable person is classified as anyone who holds
                      one of the following: US citizenship, residency, tax
                      identification number or mailing/residential adress,
                      telephone number, as well as anyone who has instructions
                      to transfer funds to an account maintained in the US.
                    </PrimaryTextSpan>
                  </InformationPopup>
                </FlexContainer>
              </Checkbox>
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
}

export default PersonalData;

const CustomForm = styled.form`
  margin: 0;
`;
