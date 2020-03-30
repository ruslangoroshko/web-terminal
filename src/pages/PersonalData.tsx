import React, { useEffect, useState } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextParagraph, PrimaryTextSpan } from '../styles/TextsElements';
import LabelInput from '../components/LabelInput';
import styled from '@emotion/styled';
import { Formik, Field, FieldProps, Form } from 'formik';
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

interface Props {}

function PersonalData(props: Props) {
  const validationSchema = yup.object().shape<PersonalDataParams>({
    city: yup.string().required(),
    countryOfCitizenship: yup.string().required(),
    countryOfResidence: yup.string().required(),
    dateOfBirth: yup.number().required(),
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    postalCode: yup.string().required(),
    processId: yup.string().required(),
    sex: yup.number().required(),
    address: yup.string().required(),
    uSCitizen: yup.boolean().required(),
  });

  const [birthday, setBirthday] = useState<moment.Moment>(moment());

  const [focused, setFocused] = useState(false);

  const { push } = useHistory();

  const [countries, setCountries] = useState<Country[]>([]);

  const [initialValues, setInitialValuesForm] = useState<PersonalDataParams>({
    city: '',
    countryOfCitizenship: '',
    countryOfResidence: '',
    dateOfBirth: birthday.valueOf(),
    firstName: '',
    lastName: '',
    postalCode: '',
    processId: getProcessId(),
    sex: SexEnum.Unknown,
    address: '',
    uSCitizen: false,
  })

  const { kycStore } = useStores();

  const handleSubmit = async (values: PersonalDataParams) => {
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

  const handleChangeUsCitizien = (setFieldValue: any) => (e:React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(Fields.US_CITIZEN, e.target.checked);
  }

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
          const parsed = JSON.parse(response);
          if (parsed instanceof Object) {
            setInitialValuesForm(parsed);
            kycStore.filledStep = KYCstepsEnum.PersonalData;
          }
        }
      } catch (error) {}
    }
    kycStore.currentStep = KYCstepsEnum.PersonalData;

    fetchCountries();
    fetchCurrentStep();
  }, []);

  return (
    <FlexContainer
      width="100%"
      height="100%"
      flexDirection="column"
      alignItems="center"
      backgroundColor="#252636"
      padding="40px"
    >
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
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
            enableReinitialize
          >
            {({ submitForm, setFieldValue }) => (
              <CustomForm translate="en">
                <FlexContainer width="100%" margin="0 0 28px 0">
                  <Field type="text" name={Fields.FIRST_NAME}>
                    {({ field, meta }: FieldProps) => (
                      <FlexContainer
                        margin="0 32px 0 0"
                        flexDirection="column"
                        width="50%"
                      >
                        <LabelInput
                          labelText="First name"
                          id={field.name}
                          {...field}
                          hasError={!!(meta.touched && meta.error)}
                          errorText={meta.error}
                        />
                      </FlexContainer>
                    )}
                  </Field>
                  <Field
                    type="text"
                    name={Fields.LAST_NAME}
                    flexDirection="column"
                  >
                    {({ field, meta }: FieldProps) => (
                      <FlexContainer width="50%" flexDirection="column">
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
                <FlexContainer width="100%" margin="0 0 28px 0">
                  <Field type="text" name={Fields.DATE_OF_BIRTH}>
                    {({ field, meta }: FieldProps) => (
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
                          id={field.name}
                          birthday={birthday}
                          focused={focused}
                          setBirthday={setBirthday}
                          setFocused={setFocused}
                        ></BirthDayPicker>
                      </FlexContainer>
                    )}
                  </Field>
                  <Field type="text" name={Fields.SEX} flexDirection="column">
                    {({ field, meta }: FieldProps) => (
                      <FlexContainer width="50%" flexDirection="column">
                        <GenderDropdown
                          selectHandler={handleChangeGender(setFieldValue)}
                          selected={field.value}
                        ></GenderDropdown>
                      </FlexContainer>
                    )}
                  </Field>
                </FlexContainer>
                <FlexContainer width="100%" margin="0 0 28px 0">
                  <Field type="text" name={Fields.COUNTRY_OF_RESIDENCE}>
                    {({ field, meta }: FieldProps) => (
                      <FlexContainer
                        margin="0 32px 0 0"
                        flexDirection="column"
                        width="50%"
                      >
                        <AutoCompleteDropdown
                          labelText="Country of residence"
                          id={field.name}
                          {...field}
                          hasError={!!(meta.touched && meta.error)}
                          dropdownItemsList={countries}
                          setFieldValue={setFieldValue}
                        ></AutoCompleteDropdown>
                      </FlexContainer>
                    )}
                  </Field>
                  <Field type="text" name={Fields.CITY} flexDirection="column">
                    {({ field, meta }: FieldProps) => (
                      <FlexContainer width="50%" flexDirection="column">
                        <LabelInput
                          labelText="City"
                          id={field.name}
                          {...field}
                          hasError={!!(meta.touched && meta.error)}
                          errorText={meta.error}
                        />
                      </FlexContainer>
                    )}
                  </Field>
                </FlexContainer>
                <FlexContainer width="100%" margin="0 0 28px 0">
                  <Field type="text" name={Fields.COUNTRY_OF_CITIENZENSHIP}>
                    {({ field, meta }: FieldProps) => (
                      <FlexContainer
                        margin="0 32px 0 0"
                        flexDirection="column"
                        width="50%"
                      >
                        <AutoCompleteDropdown
                          labelText="Сitizenship"
                          id={field.name}
                          {...field}
                          hasError={!!(meta.touched && meta.error)}
                          dropdownItemsList={countries}
                          setFieldValue={setFieldValue}
                        ></AutoCompleteDropdown>
                      </FlexContainer>
                    )}
                  </Field>
                  <Field
                    type="text"
                    name={Fields.POSTAL_CODE}
                    flexDirection="column"
                  >
                    {({ field, meta }: FieldProps) => (
                      <FlexContainer width="50%" flexDirection="column">
                        <LabelInput
                          labelText="Postal code"
                          id={field.name}
                          {...field}
                          hasError={!!(meta.touched && meta.error)}
                          errorText={meta.error}
                        />
                      </FlexContainer>
                    )}
                  </Field>
                </FlexContainer>
                <FlexContainer width="100%" margin="0 0 28px 0">
                  <Field type="text" name={Fields.ADDRESS}>
                    {({ field, meta }: FieldProps) => (
                      <FlexContainer flexDirection="column" width="100%">
                        <LabelInput
                          labelText="Address of residence"
                          id={field.name}
                          {...field}
                          hasError={!!(meta.touched && meta.error)}
                          errorText={meta.error}
                        />
                      </FlexContainer>
                    )}
                  </Field>
                </FlexContainer>
                <FlexContainer margin="0 0 40px 0">
                  <Field type="checkbox" name={Fields.US_CITIZEN}>
                    {({ field, meta }: FieldProps) => (
                      <Checkbox
                        checkboxText="I’am a US reportable person"
                        id="reportable"
                        checked={field.value}
                        onChange={handleChangeUsCitizien(setFieldValue)}
                      >
                        <FlexContainer margin="0 0 0 8px">
                          <InformationPopup
                            bgColor="rgba(0, 0, 0, 0.6)"
                            classNameTooltip="reportable-tooltip"
                            direction="right"
                            width="334px"
                          >
                            <PrimaryTextSpan fontSize="12px" color="#fffccc">
                              erson is classified as anyone who g: US
                              citizenship, ber or r r, as yone who funds to an
                              account maintained in the US.
                            </PrimaryTextSpan>
                          </InformationPopup>
                        </FlexContainer>
                      </Checkbox>
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
}

export default PersonalData;

const CustomForm = styled(Form)`
  margin: 0;
`;
