import React, { useEffect, useState } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextParagraph, PrimaryTextSpan } from '../styles/TextsElements';
import * as yup from 'yup';
import styled from '@emotion/styled';
import Modal from './Modal';
import API from '../helpers/API';
import Fields from '../constants/fields';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import Page from '../constants/Pages';
import { CountriesEnum } from '../enums/CountriesEnum';
import { PrimaryButton } from '../styles/Buttons';
import { Country } from '../types/CountriesTypes';
import { PhoneVerificationFormParams } from '../types/PersonalDataTypes';
import AutoCompleteDropdown from './KYC/AutoCompleteDropdown';
import LabelInputMasked from './LabelInputMasked';
import { parsePhoneNumber } from 'libphonenumber-js';
import { getProcessId } from '../helpers/getProcessId';
import { useStores } from '../hooks/useStores';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../constants/mixpanelEvents';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import apiResponseCodeMessages from '../constants/apiResponseCodeMessages';

function ShouldValidatePhonePopup() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [dialMask, setDialMask] = useState('');
  const {
    phoneVerificationStore,
    badRequestPopupStore,
    mainAppStore,
  } = useStores();

  const { push } = useHistory();
  const { t } = useTranslation();

  const validationSchema = yup.object().shape<PhoneVerificationFormParams>({
    phone: yup
      .string()
      .required()
      .test(Fields.PHONE, `${t('Phone number is invalid')}`, function (value) {
        if (value) {
          try {
            const checkPhone = parsePhoneNumber(value);
            return !!checkPhone?.isValid();
          } catch (error) {
            return false;
          }
        }
        return true;
      }),
    country: yup.string(),
  });

  const initialValues = {
    country: '',
    phone: '',
  };

  const handleChangeCountry = (setFieldValue: any) => (country: Country) => {
    setFieldValue(Fields.PHONE, country.dial);
    setDialMask(`+${country.dial}`);
  };

  const handleSubmitForm = async ({ phone }: PhoneVerificationFormParams) => {
    try {
      const response = await API.postPersonalData(
        {
          phone: phone.trim(),
          processId: getProcessId(),
        },
        mainAppStore.initModel.authUrl
      );

      if (response.result === OperationApiResponseCodes.Ok) {
        mixpanel.track(mixpanelEvents.PHONE_FIELD_VIEW);
        phoneVerificationStore.setShouldValidatePhone(false);
        push(Page.DASHBOARD);
      } else {
        badRequestPopupStore.openModal();
        badRequestPopupStore.setMessage(
          t(apiResponseCodeMessages[response.result])
        );
      }
    } catch (error) {
      badRequestPopupStore.openModal();
      badRequestPopupStore.setMessage(error);
    }
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

    mixpanel.track(mixpanelEvents.PHONE_FIELD_VIEW);
  }, []);

  useEffect(() => {
    async function fetchGeoLocation() {
      try {
        const response = await API.getGeolocationInfo(
          mainAppStore.initModel.authUrl
        );
        const country = countries.find((item) => item.id === response.country);
        if (country) {
          setFieldValue(Fields.COUNTRY, country.name);
        }
        if (response.dial) {
          setDialMask(`+${response.dial}`);
        }
      } catch (error) {}
    }
    if (countries.length) {
      fetchGeoLocation();
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
    <Modal>
      <BackgroundWrapperLayout
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        justifyContent="center"
        alignItems="center"
        zIndex="1000"
      >
        <FlexContainer flexDirection="column" padding="40px 0">
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
                    id={Fields.COUNTRY}
                    {...getFieldProps(Fields.COUNTRY)}
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
      </BackgroundWrapperLayout>
    </Modal>
  );
}

export default ShouldValidatePhonePopup;

const BackgroundWrapperLayout = styled(FlexContainer)`
  background-color: rgba(0, 0, 0, 0.7);
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(0, 0, 0, 0.34);
    backdrop-filter: blur(12px);
  }
`;
const CustomForm = styled.form`
  margin: 0;
`;