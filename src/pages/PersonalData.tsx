import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextParagraph, PrimaryTextSpan } from '../styles/TextsElements';
import LabelInput from '../components/LabelInput';
import styled from '@emotion/styled';
import { Formik, Field, FieldProps, Form } from 'formik';
import * as yup from 'yup';
import { PersonalDataParams } from '../types/PersonalData';
import moment from 'moment';
import { getProcessId } from '../helpers/getProcessId';
import { SexEnum } from '../enums/Sex';
import Fields from '../constants/fields';
import Checkbox from '../components/Checkbox';
import InformationPopup from '../components/InformationPopup';
import { PrimaryButton } from '../styles/Buttons';
import GenderDropdown from '../components/KYC/GenderDropdown';

interface Props {}

function PersonalData(props: Props) {
  const validationSchema = yup.object().shape<PersonalDataParams>({
    city: yup.string().required(),
    countryOfCitizenship: yup.string().required(),
    countryOfResidence: yup.string().required(),
    dateOfBirth: yup.number().required(),
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    phone: yup.string().required(),
    postalCode: yup.string().required(),
    processId: yup.string().required(),
    sex: yup.number().required(),
  });

  const initialValues: PersonalDataParams = {
    city: '',
    countryOfCitizenship: '',
    countryOfResidence: '',
    dateOfBirth: moment().valueOf(),
    firstName: '',
    lastName: '',
    phone: '',
    postalCode: '',
    processId: getProcessId(),
    sex: SexEnum.Unknown,
  };

  const handleSubmit = () => {
    debugger;
  };

  const handleChangeGender = (setFieldValue: any) => (sex: SexEnum) => {
    setFieldValue(Fields.SEX, sex);
  };

  return (
    <FlexContainer
      width="100%"
      height="100%"
      flexDirection="column"
      alignItems="center"
    >
      <FlexContainer width="568px" flexDirection="column" padding="20px 0 0 0">
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
              <CustomForm>
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
                          id={Fields.FIRST_NAME}
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
                          id={Fields.LAST_NAME}
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
                      >
                        <LabelInput
                          labelText="Date of birth"
                          id={Fields.DATE_OF_BIRTH}
                          {...field}
                          hasError={!!(meta.touched && meta.error)}
                          errorText={meta.error}
                        />
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
                        <LabelInput
                          labelText="Country of residence"
                          id={Fields.COUNTRY_OF_RESIDENCE}
                          {...field}
                          hasError={!!(meta.touched && meta.error)}
                          errorText={meta.error}
                        />
                      </FlexContainer>
                    )}
                  </Field>
                  <Field type="text" name={Fields.CITY} flexDirection="column">
                    {({ field, meta }: FieldProps) => (
                      <FlexContainer width="50%" flexDirection="column">
                        <LabelInput
                          labelText="City"
                          id={Fields.CITY}
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
                        <LabelInput
                          labelText="Сitizenship"
                          id={Fields.COUNTRY_OF_CITIENZENSHIP}
                          {...field}
                          hasError={!!(meta.touched && meta.error)}
                          errorText={meta.error}
                        />
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
                          id={Fields.POSTAL_CODE}
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
                          id={Fields.ADDRESS}
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
                        onChange={field.onChange}
                      >
                        <FlexContainer margin="0 0 0 8px">
                          <InformationPopup
                            bgColor="rgba(0, 0, 0, 0.6)"
                            classNameTooltip="reportable-tooltip"
                            direction="right"
                            width="334px"
                          >
                            <PrimaryTextSpan fontSize="12px" color="#fffccc">
                              A US reportable person is classified as anyone who
                              holds one of the following: US citizenship,
                              residency, tax identification number or
                              mailing/residential adress, telephone number, as
                              well as anyone who has instructions to transfer
                              funds to an account maintained in the US.
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
