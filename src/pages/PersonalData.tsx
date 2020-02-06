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
import API from '../helpers/API';
import Fields from '../constants/fields';
import ErropPopup from '../components/ErropPopup';
import ColorsPallete from '../styles/colorPallete';
import Checkbox from '../components/Checkbox';
import InformationPopup from '../components/InformationPopup';

interface Props {}

function PersonalData(props: Props) {
  const {} = props;
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

  const handleSubmit = () => {};

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
            {({ setFieldValue, values, errors, submitForm, resetForm }) => (
              <CustomForm>
                <FlexContainer width="100%" margin="0 0 28px 0">
                  <Field type="text" name={Fields.FIRST_NAME}>
                    {({ field, meta }: FieldProps) => (
                      <FlexContainer
                        margin="0 32px 0 0"
                        flexDirection="column"
                        width="50%"
                      >
                        {meta.touched && meta.error && (
                          <ErropPopup
                            textColor="#fffccc"
                            bgColor={ColorsPallete.RAZZMATAZZ}
                            classNameTooltip={Fields.FIRST_NAME}
                          >
                            {meta.error}
                          </ErropPopup>
                        )}
                        <LabelInput
                          labelText="First name"
                          id={Fields.FIRST_NAME}
                          {...field}
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
                        {meta.touched && meta.error && (
                          <ErropPopup
                            textColor="#fffccc"
                            bgColor={ColorsPallete.RAZZMATAZZ}
                            classNameTooltip={Fields.LAST_NAME}
                          >
                            {meta.error}
                          </ErropPopup>
                        )}
                        <LabelInput
                          labelText="Last name"
                          id={Fields.LAST_NAME}
                          {...field}
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
                        {meta.touched && meta.error && (
                          <ErropPopup
                            textColor="#fffccc"
                            bgColor={ColorsPallete.RAZZMATAZZ}
                            classNameTooltip={Fields.DATE_OF_BIRTH}
                          >
                            {meta.error}
                          </ErropPopup>
                        )}
                        <LabelInput
                          labelText="Date of birth"
                          id={Fields.DATE_OF_BIRTH}
                          {...field}
                        />
                      </FlexContainer>
                    )}
                  </Field>
                  <Field type="text" name={Fields.SEX} flexDirection="column">
                    {({ field, meta }: FieldProps) => (
                      <FlexContainer width="50%" flexDirection="column">
                        {meta.touched && meta.error && (
                          <ErropPopup
                            textColor="#fffccc"
                            bgColor={ColorsPallete.RAZZMATAZZ}
                            classNameTooltip={Fields.SEX}
                          >
                            {meta.error}
                          </ErropPopup>
                        )}
                        <LabelInput
                          labelText="Gender"
                          id={Fields.SEX}
                          {...field}
                        />
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
                        {meta.touched && meta.error && (
                          <ErropPopup
                            textColor="#fffccc"
                            bgColor={ColorsPallete.RAZZMATAZZ}
                            classNameTooltip={Fields.COUNTRY_OF_RESIDENCE}
                          >
                            {meta.error}
                          </ErropPopup>
                        )}
                        <LabelInput
                          labelText="Country of residence"
                          id={Fields.COUNTRY_OF_RESIDENCE}
                          {...field}
                        />
                      </FlexContainer>
                    )}
                  </Field>
                  <Field type="text" name={Fields.CITY} flexDirection="column">
                    {({ field, meta }: FieldProps) => (
                      <FlexContainer width="50%" flexDirection="column">
                        {meta.touched && meta.error && (
                          <ErropPopup
                            textColor="#fffccc"
                            bgColor={ColorsPallete.RAZZMATAZZ}
                            classNameTooltip={Fields.CITY}
                          >
                            {meta.error}
                          </ErropPopup>
                        )}
                        <LabelInput
                          labelText="City"
                          id={Fields.CITY}
                          {...field}
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
                        {meta.touched && meta.error && (
                          <ErropPopup
                            textColor="#fffccc"
                            bgColor={ColorsPallete.RAZZMATAZZ}
                            classNameTooltip={Fields.COUNTRY_OF_CITIENZENSHIP}
                          >
                            {meta.error}
                          </ErropPopup>
                        )}
                        <LabelInput
                          labelText="Сitizenship"
                          id={Fields.COUNTRY_OF_CITIENZENSHIP}
                          {...field}
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
                        {meta.touched && meta.error && (
                          <ErropPopup
                            textColor="#fffccc"
                            bgColor={ColorsPallete.RAZZMATAZZ}
                            classNameTooltip={Fields.POSTAL_CODE}
                          >
                            {meta.error}
                          </ErropPopup>
                        )}
                        <LabelInput
                          labelText="Postal code"
                          id={Fields.POSTAL_CODE}
                          {...field}
                        />
                      </FlexContainer>
                    )}
                  </Field>
                </FlexContainer>
                <FlexContainer width="100%" margin="0 0 28px 0">
                  <Field type="text" name={Fields.COUNTRY_OF_CITIENZENSHIP}>
                    {({ field, meta }: FieldProps) => (
                      <FlexContainer flexDirection="column" width="100%">
                        {meta.touched && meta.error && (
                          <ErropPopup
                            textColor="#fffccc"
                            bgColor={ColorsPallete.RAZZMATAZZ}
                            classNameTooltip={Fields.COUNTRY_OF_CITIENZENSHIP}
                          >
                            {meta.error}
                          </ErropPopup>
                        )}
                        <LabelInput
                          labelText="Сitizenship"
                          id={Fields.COUNTRY_OF_CITIENZENSHIP}
                          {...field}
                        />
                      </FlexContainer>
                    )}
                  </Field>
                </FlexContainer>
                <FlexContainer>
                  <Checkbox
                    checkboxText="I’am a US reportable person"
                    id="reportable"
                  >
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
                  </Checkbox>
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
