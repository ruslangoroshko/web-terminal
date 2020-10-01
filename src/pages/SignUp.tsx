import React, { useCallback, useEffect, useState } from 'react';
import { FormikHelpers, useFormik } from 'formik';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { UserRegistration } from '../types/UserInfo';
import * as yup from 'yup';
import Fields from '../constants/fields';
import { useStores } from '../hooks/useStores';
import SignFlowLayout from '../components/SignFlowLayout';
import LabelInput from '../components/LabelInput';
import { PrimaryButton } from '../styles/Buttons';
import { PrimaryTextSpan } from '../styles/TextsElements';
import SignTypeTabs from '../components/SignTypeTabs';
import Page from '../constants/Pages';
import { useHistory } from 'react-router-dom';
import Checkbox from '../components/Checkbox';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../constants/mixpanelEvents';
import validationInputTexts from '../constants/validationInputTexts';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import apiResponseCodeMessages from '../constants/apiResponseCodeMessages';
import NotificationPopup from '../components/NotificationPopup';
import { Observer } from 'mobx-react-lite';
import BadRequestPopup from '../components/BadRequestPopup';
import { useTranslation } from 'react-i18next';
import mixapanelProps from '../constants/mixpanelProps';
import Helmet from 'react-helmet';
import API from '../helpers/API';
import { CountriesEnum } from '../enums/CountriesEnum';
import { Country } from '../types/CountriesTypes';
import AutoCompleteDropdown from '../components/KYC/AutoCompleteDropdown';
import LabelInputMasked from '../components/LabelInputMasked';
import { parsePhoneNumber, getExampleNumber } from 'libphonenumber-js/min';
import examples from 'libphonenumber-js/examples.mobile.json';
import { fromAlpha3ToAlpha2Code } from '../helpers/fromAlpha3ToAlpha2Code';

function SignUp() {
  const { t } = useTranslation();
  const [hasAdditionalField, setHasAdditionalField] = useState(false);

  const [countries, setCountries] = useState<Country[]>([]);
  const [dialMask, setDialMask] = useState('');

  const validationSchema = useCallback(
    () =>
      yup.object().shape<UserRegistration>({
        email: yup
          .string()
          .required(t(validationInputTexts.EMAIL))
          .email(t(validationInputTexts.EMAIL)),
        password: yup
          .string()
          .required(t(validationInputTexts.REQUIRED_FIELD))
          .min(8, t(validationInputTexts.PASSWORD_MIN_CHARACTERS))
          .max(31, t(validationInputTexts.PASSWORD_MAX_CHARACTERS))
          .matches(
            /^(?=.*\d)(?=.*[a-zA-Z])/,
            t(validationInputTexts.PASSWORD_MATCH)
          ),
        repeatPassword: yup
          .string()
          .required(t(validationInputTexts.REPEAT_PASSWORD))
          .oneOf(
            [yup.ref(Fields.PASSWORD), null],
            t(validationInputTexts.REPEAT_PASSWORD_MATCH)
          ),
        userAgreement: yup
          .bool()
          .oneOf([true], t(validationInputTexts.USER_AGREEMENT)),
        captcha: yup.string(),
        phone: yup
          .string()
          .test(Fields.PHONE, `${t('Phone number is invalid')}`, function (
            value
          ) {
            if (hasAdditionalField) {
              if (!value) {
                return false;
              }
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
      }),
    [hasAdditionalField]
  );

  const initialValues: UserRegistration = {
    email: '',
    password: '',
    repeatPassword: '',
    userAgreement: false,
    captcha: '',
    phone: '',
    country: '',
  };

  const { push } = useHistory();
  const { mainAppStore, notificationStore, badRequestPopupStore } = useStores();

  const [validateAssigments, setValitdateAssigments] = useState(false);

  const handleSubmitForm = useCallback(
    async (
      { email, password, phone }: UserRegistration,
      { setStatus, setSubmitting }: FormikHelpers<UserRegistration>
    ) => {
      setSubmitting(true);
      mainAppStore.isInitLoading = true;

      grecaptcha.ready(function () {
        grecaptcha
          .execute(mainAppStore.initModel.recaptchaToken, {
            action: 'submit',
          })
          .then(
            async function (captcha: any) {
              try {
                const result = await mainAppStore.signUp({
                  email,
                  password,
                  captcha,
                  phone: phone?.trim(),
                });
                if (result !== OperationApiResponseCodes.Ok) {
                  notificationStore.notificationMessage = t(
                    apiResponseCodeMessages[result]
                  );
                  notificationStore.isSuccessfull = false;
                  notificationStore.openNotification();
                  mainAppStore.isInitLoading = false;
                  mixpanel.track(mixpanelEvents.SIGN_UP_FAILED, {
                    [mixapanelProps.BRAND_NAME]: mainAppStore.initModel.brandName.toLowerCase(),
                    [mixapanelProps.ERROR_TEXT]: t(
                      apiResponseCodeMessages[result]
                    ),
                    [mixapanelProps.EMAIL]: values.email,
                  });
                } else {
                  mainAppStore.setSignUpFlag(true);
                  mixpanel.track(mixpanelEvents.SIGN_UP, {
                    [mixapanelProps.BRAND_NAME]: mainAppStore.initModel.brandName.toLowerCase(),
                  });
                  push(Page.DASHBOARD);
                }
              } catch (error) {
                badRequestPopupStore.openModal();
                badRequestPopupStore.setMessage(error);
                setStatus(error);
                setSubmitting(false);
                mainAppStore.isInitLoading = false;
              }
            },
            () => {
              badRequestPopupStore.openModal();
              badRequestPopupStore.setMessage(
                t(
                  apiResponseCodeMessages[
                    OperationApiResponseCodes.TechnicalError
                  ]
                )
              );
              setStatus(
                t(
                  apiResponseCodeMessages[
                    OperationApiResponseCodes.TechnicalError
                  ]
                )
              );
              setSubmitting(false);
              mainAppStore.isInitLoading = false;
            }
          );
      });
    },
    [hasAdditionalField]
  );

  const {
    values,
    setFieldError,
    setFieldValue,
    validateForm,
    handleSubmit,
    handleChange,
    getFieldProps,
    errors,
    touched,
    isSubmitting,
  } = useFormik({
    initialValues,
    onSubmit: handleSubmitForm,
    validationSchema: validationSchema(),
    validateOnBlur: false,
    enableReinitialize: true,
    validateOnChange: true,
  });

  const handleChangeCountry = (setFieldValue: any) => (country: Country) => {
    setFieldValue(Fields.PHONE, country.dial);
    const phoneNumber = getExampleNumber(
      fromAlpha3ToAlpha2Code(country.id),
      examples
    );
    const mask = phoneNumber?.nationalNumber.replace(/\d/g, '9');
    if (mask) {
      setDialMask(`+\\${country.dial.split('').join('\\')}${mask}`);
    } else {
      setDialMask(`+\\${country.dial.split('').join('\\')}99999999999999`);
    }
  };

  const handleChangeUserAgreements = (setFieldValue: any) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFieldValue(Fields.USER_AGREEMENT, e.target.checked);
    e.target.checked
      ? setFieldError(Fields.USER_AGREEMENT, '')
      : setFieldError(
          Fields.USER_AGREEMENT,
          t(validationInputTexts.USER_AGREEMENT)
        );
  };

  const handlerClickSubmit = async () => {
    const curErrors = await validateForm();
    const curErrorsKeys = Object.keys(curErrors);
    if (curErrorsKeys.length) {
      const el = document.getElementById(curErrorsKeys[0]);
      if (el) el.focus();
    }
    if (
      curErrorsKeys.length === 1 &&
      curErrorsKeys.includes(Fields.USER_AGREEMENT)
    ) {
      setValitdateAssigments(true);
      setFieldError(Fields.USER_AGREEMENT, '');
    }
  };

  useEffect(() => {
    mixpanel.track(mixpanelEvents.SIGN_UP_VIEW, {
      [mixapanelProps.BRAND_NAME]: mainAppStore.initModel.brandName.toLowerCase(),
    });
  }, []);

  useEffect(() => {
    const fetchAdditionalFields = async () => {
      mainAppStore.isLoading = true;
      try {
        const response = await API.getAdditionalSignUpFields(
          mainAppStore.initModel.authUrl
        );
        setHasAdditionalField(true);

        if (response.length && response.find((item) => item === Fields.PHONE)) {
          setHasAdditionalField(true);
        }
        mainAppStore.isLoading = false;
      } catch (error) {
        mainAppStore.isLoading = false;
      }
    };
    fetchAdditionalFields();
  }, []);

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

    if (hasAdditionalField) {
      fetchCountries();
    }
  }, [hasAdditionalField]);

  useEffect(() => {
    const fetchGeoLocationInfo = async () => {
      try {
        const response = await API.getGeolocationInfo(
          mainAppStore.initModel.authUrl
        );
        const country = countries.find((item) => item.id === response.country);
        if (country) {
          setFieldValue(Fields.COUNTRY, country.name);
        }
        if (response.dial) {
          const phoneNumber = getExampleNumber(
            fromAlpha3ToAlpha2Code(response.country),
            examples
          );
          const mask = phoneNumber?.nationalNumber.replace(/\d/g, '9');
          if (mask) {
            setDialMask(`+\\${response.dial.split('').join('\\')}${mask}`);
          } else {
            setDialMask(
              `+\\${response.dial.split('').join('\\')}99999999999999`
            );
          }
        }
      } catch (error) {}
    };

    if (countries.length) {
      fetchGeoLocationInfo();
    }
  }, [countries]);

  return (
    <SignFlowLayout>
      <Helmet>
        <title>{t('Sign up')}</title>
      </Helmet>
      <Observer>
        {() => <>{badRequestPopupStore.isActive && <BadRequestPopup />}</>}
      </Observer>
      <FlexContainer
        position="absolute"
        bottom="100px"
        left="100px"
        zIndex="100"
      >
        <Observer>
          {() => (
            <NotificationPopup
              show={notificationStore.isActiveNotification}
            ></NotificationPopup>
          )}
        </Observer>
      </FlexContainer>
      <FlexContainer width="320px" flexDirection="column">
        <SignTypeTabs></SignTypeTabs>
        <CustomForm noValidate onSubmit={handleSubmit}>
          <FlexContainer flexDirection="column">
            <FlexContainer
              position="relative"
              flexDirection="column"
              margin="0 0 16px 0"
            >
              <LabelInput
                onChange={handleChange}
                name={Fields.EMAIL}
                labelText={t('Email')}
                value={values.email || ''}
                id={Fields.EMAIL}
                hasError={!!(touched.email && errors.email)}
                errorText={errors.email}
              ></LabelInput>
            </FlexContainer>
            {hasAdditionalField && (
              <>
                <FlexContainer flexDirection="column" margin="0 0 16px 0">
                  <AutoCompleteDropdown
                    labelText={t('Country')}
                    {...getFieldProps(Fields.COUNTRY)}
                    id={Fields.COUNTRY}
                    hasError={!!(touched.country && errors.country)}
                    dropdownItemsList={countries}
                    setFieldValue={setFieldValue}
                    handleChange={handleChangeCountry(setFieldValue)}
                  ></AutoCompleteDropdown>
                </FlexContainer>
                <FlexContainer margin="0 0 16px 0" flexDirection="column">
                  <LabelInputMasked
                    mask={dialMask}
                    labelText={t('Phone')}
                    {...getFieldProps(Fields.PHONE)}
                    id={Fields.PHONE}
                    hasError={!!(touched.phone && errors.phone)}
                    errorText={errors.phone}
                  />
                </FlexContainer>
              </>
            )}
            <FlexContainer
              position="relative"
              flexDirection="column"
              margin="0 0 16px 0"
            >
              <LabelInput
                onChange={handleChange}
                name={Fields.PASSWORD}
                labelText={t('Password')}
                value={values.password || ''}
                id={Fields.PASSWORD}
                autoComplete="new-password"
                type="password"
                hasError={!!(touched.password && errors.password)}
                errorText={errors.password}
              ></LabelInput>
            </FlexContainer>
            <FlexContainer
              position="relative"
              flexDirection="column"
              margin="0 0 16px 0"
            >
              <LabelInput
                onChange={handleChange}
                labelText={t('Repeat Password')}
                value={values.repeatPassword || ''}
                id={Fields.REPEAT_PASSWORD}
                name={Fields.REPEAT_PASSWORD}
                autoComplete="new-password"
                type="password"
                hasError={!!(touched.repeatPassword && errors.repeatPassword)}
                errorText={errors.repeatPassword}
              ></LabelInput>
            </FlexContainer>
            <FlexContainer margin="0 0 15px 0">
              <Checkbox
                id="user-agreements"
                checked={values.userAgreement}
                onChange={handleChangeUserAgreements(setFieldValue)}
                hasError={!!(validateAssigments && errors.userAgreement)}
                errorText={errors.userAgreement}
              >
                <PrimaryTextSpan color="rgba(255,255,255,0.6)" fontSize="12px">
                  {t('I’m 18 years old, and agree to')}&nbsp;
                  <CustomCheckboxLinkExternal
                    href={mainAppStore.initModel.termsUrl}
                    target="_blank"
                  >
                    {t('Terms & Conditions')}
                  </CustomCheckboxLinkExternal>
                  &nbsp; {t('and')}&nbsp;
                  <CustomCheckboxLinkExternal
                    href={mainAppStore.initModel.policyUrl}
                    target="_blank"
                  >
                    {t('Privacy Policy')}
                  </CustomCheckboxLinkExternal>
                </PrimaryTextSpan>
              </Checkbox>
            </FlexContainer>
            <PrimaryButton
              padding="12px"
              type="submit"
              disabled={isSubmitting}
              onClick={handlerClickSubmit}
            >
              <PrimaryTextSpan
                color="#1c2026"
                fontWeight="bold"
                fontSize="14px"
                textTransform="uppercase"
              >
                {t('Sign up')}
              </PrimaryTextSpan>
            </PrimaryButton>
          </FlexContainer>
        </CustomForm>
      </FlexContainer>
    </SignFlowLayout>
  );
}

export default SignUp;

const CustomForm = styled.form`
  margin: 0;
`;

const CustomCheckboxLinkExternal = styled.a`
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.4s ease;
  text-decoration: underline;
  font-size: 12px;
  :hover {
    text-decoration: none;
    color: rgba(255, 255, 255, 1);
  }
`;
