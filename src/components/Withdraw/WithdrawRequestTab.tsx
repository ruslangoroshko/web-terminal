import React, { useState, useCallback } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { SecondaryButton, PrimaryButton } from '../../styles/Buttons';

import CardIcon from '../../assets/images/master-card.png';
import BankTransferIcon from '../../assets/svg/icon-bank-transfer.svg';
import BitcoinIcon from '../../assets/svg/icon-bitcoin.svg';

import IconFast from '../../assets/svg/icon-fast.svg';
import IconNoCommission from '../../assets/images/icon-no-commission.png';
import IconNoLimits from '../../assets/images/icon-no-limit.png';
import IconFaq from '../../assets/images/icon-faq.png';

import WithdrawPagePopup from '../../components/Withdraw/WithdrawPagePopup';
import SvgIcon from '../SvgIcon';
import { useStores } from '../../hooks/useStores';
import { WithdrawalTypesEnum } from '../../enums/WithdrawalTypesEnum';
import API from '../../helpers/API';
import { CreateWithdrawalParams } from '../../types/WithdrawalTypes';

interface RequestValues {
  amount: number;
  bitcoinAdress?: string;
}

const WithdrawRequestTab = () => {
  const { depositFundsStore, mainAppStore } = useStores();

  const [showPopup, setShowPopup] = useState(false);
  const [paymentMeyhod, setPaymentMethod] = useState(
    WithdrawalTypesEnum.BankTransfer
  );

  const validationSchema = useCallback(
    () =>
      yup.object().shape<RequestValues>({
        amount: yup
          .number()
          .min(10, 'min: $10')
          .max(
            mainAppStore.accounts.find(item => item.isLive === true)?.balance ||
              0,
            `max: $${mainAppStore.accounts.find(item => item.isLive === true)
              ?.balance || 0}`
          ),
        bitcoinAdress: yup.string(),
      }),
    [mainAppStore]
  );

  const initialValues: RequestValues = {
    amount: 0,
    bitcoinAdress: '',
  };

  const handleSubmitForm = async () => {
    try {
      const data: CreateWithdrawalParams = {
        authToken: mainAppStore.token,
        accountId:
          mainAppStore.accounts.find(item => item.isLive === true)?.id || '',
        currency:
          mainAppStore.accounts.find(item => item.isLive === true)?.currency ||
          '',
        amount: values.amount,
        withdrawalType: paymentMeyhod,
        data: '',
      };
      const result = await API.createWithdrawal(data);
      console.log(result);
      console.log(data);
    } catch (error) {}
  };

  const {
    values,
    setFieldError,
    setFieldValue,
    validateForm,
    handleChange,
    handleSubmit,
    errors,
    touched,
    isSubmitting,
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
      flexDirection="column"
      minHeight="calc(100vh - 234px)"
      justifyContent="space-between"
      position="relative"
    >
      {showPopup && <WithdrawPagePopup />}

      <FlexContainer flexDirection="column">
        <FlexContainer marginBottom="48px">
          <FlexContainer flexDirection="column" width="180px">
            <PrimaryTextSpan
              textTransform="uppercase"
              fontSize="12px"
              color="rgba(255,255,255,0.4)"
              marginBottom="8px"
            >
              Total
            </PrimaryTextSpan>
            <PrimaryTextSpan
              textTransform="uppercase"
              fontSize="24px"
              fontWeight="bold"
              color="#FFFCCC"
            >
              {mainAppStore.accounts.find(item => item.isLive === true)?.symbol}
              {mainAppStore.accounts
                .find(item => item.isLive === true)
                ?.balance.toFixed(2)}
            </PrimaryTextSpan>
          </FlexContainer>

          <FlexContainer flexDirection="column" width="180px">
            <PrimaryTextSpan
              textTransform="uppercase"
              fontSize="12px"
              color="rgba(255,255,255,0.4)"
              marginBottom="12px"
            >
              Available
            </PrimaryTextSpan>
            <PrimaryTextSpan
              textTransform="uppercase"
              fontSize="14px"
              fontWeight="bold"
              color="#FFFCCC"
            >
              {mainAppStore.accounts.find(item => item.isLive === true)?.symbol}
              {mainAppStore.accounts
                .find(item => item.isLive === true)
                ?.balance.toFixed(2)}
            </PrimaryTextSpan>
          </FlexContainer>
        </FlexContainer>

        <FlexContainer flexDirection="column">
          <PrimaryTextSpan
            textTransform="uppercase"
            fontSize="12px"
            color="rgba(255,255,255,0.4)"
            marginBottom="12px"
          >
            Payment methods
          </PrimaryTextSpan>
          <FlexContainer width="100%">
            <WithdrawPaymenMethodtItem
              active={paymentMeyhod === WithdrawalTypesEnum.BankTransfer}
              onClick={() => {
                setPaymentMethod(WithdrawalTypesEnum.BankTransfer);
              }}
            >
              <FlexContainer>
                <SvgIcon {...BankTransferIcon} fillColor="#FFFCCC" />
              </FlexContainer>
              <FlexContainer flexDirection="column">
                <PrimaryTextSpan
                  fontWeight="bold"
                  fontSize="12px"
                  color="#FFFCCC"
                  textAlign="left"
                >
                  Bank transfer
                </PrimaryTextSpan>
                <PrimaryTextSpan
                  fontSize="12px"
                  color="rgba(255,255,255,0.4)"
                  textAlign="left"
                >
                  Other methods will be available
                </PrimaryTextSpan>
              </FlexContainer>
            </WithdrawPaymenMethodtItem>

            <WithdrawPaymenMethodtItem
              active={paymentMeyhod === WithdrawalTypesEnum.Bitcoin}
              onClick={() => {
                setPaymentMethod(WithdrawalTypesEnum.Bitcoin);
              }}
            >
              <FlexContainer>
                <SvgIcon {...BitcoinIcon} fillColor="#FFFCCC" />
              </FlexContainer>
              <FlexContainer flexDirection="column">
                <PrimaryTextSpan
                  fontWeight="bold"
                  fontSize="12px"
                  color="#FFFCCC"
                  textAlign="left"
                >
                  Bitcoin
                </PrimaryTextSpan>
                <PrimaryTextSpan
                  fontSize="12px"
                  color="rgba(255,255,255,0.4)"
                  textAlign="left"
                >
                  Other methods will be available
                </PrimaryTextSpan>
              </FlexContainer>
            </WithdrawPaymenMethodtItem>
          </FlexContainer>

          <FlexContainer
            width="100%"
            justifyContent="space-between"
            alignItems="center"
            padding="30px 0"
          >
            <FlexContainer width="calc(100% - 220px)">
              <PrimaryTextSpan
                fontSize="14px"
                color="#FFFCCC"
                lineHeight="20px"
              >
                Withdrawals are processed by the same payment systems used to
                deposit money into the system.
              </PrimaryTextSpan>
            </FlexContainer>
            <FlexContainer width="160px">
              <DeposteButton onClick={depositFundsStore.togglePopup}>
                <PrimaryTextSpan color="#fffccc" fontSize="14px">
                  Make a deposit
                </PrimaryTextSpan>
              </DeposteButton>
            </FlexContainer>
          </FlexContainer>

          <FlexContainer>
            <CustomForm noValidate onSubmit={handleSubmit}>
              <FlexContainer flexDirection="column" width="340px">
                <FlexContainer
                  margin="0 0 6px 0"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <PrimaryTextSpan
                    fontSize="11px"
                    lineHeight="12px"
                    color="rgba(255, 255, 255, 0.3)"
                    textTransform="uppercase"
                  >
                    Amount
                  </PrimaryTextSpan>
                </FlexContainer>

                <InputWrapper
                  margin="0 0 16px 0"
                  height="32px"
                  width="100%"
                  position="relative"
                  justifyContent="space-between"
                >
                  <InputField
                    name="amount"
										id="amount"
                    onChange={handleChange}
                    value={values.amount ? values.amount : ''}
                    type="number"
                  ></InputField>

                  {touched.amount && errors.amount && (
                    <ErrorText>${errors.amount}</ErrorText>
                  )}
                </InputWrapper>

                {paymentMeyhod === WithdrawalTypesEnum.Bitcoin && (
                  <>
                    <FlexContainer
                      margin="0 0 6px 0"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <PrimaryTextSpan
                        fontSize="11px"
                        lineHeight="12px"
                        color="rgba(255, 255, 255, 0.3)"
                        textTransform="uppercase"
                      >
                        Bitcoin adress
                      </PrimaryTextSpan>
                    </FlexContainer>

                    <InputWrapper
                      margin="0 0 16px 0"
                      height="32px"
                      width="100%"
                      position="relative"
                      justifyContent="space-between"
                    >
                      <InputField
                        name="bitcoinAdress"
                        id="bitcoinAdress"
                        onChange={handleChange}
                        value={values.bitcoinAdress ? values.bitcoinAdress : ''}
                        type="number"
                      ></InputField>

                      {/* {touched.bitcoinAdress && errors.bitcoinAdress && (
                        <ErrorText>{errors.bitcoinAdress}</ErrorText>
                      )} */}
                    </InputWrapper>
                  </>
                )}

                <PrimaryButton
                  width="160px"
                  padding="12px"
                  type="submit"
                  onClick={handlerClickSubmit}
                >
                  <PrimaryTextSpan
                    color="#1c2026"
                    fontWeight="bold"
                    fontSize="14px"
                  >
                    Withdraw
                  </PrimaryTextSpan>
                </PrimaryButton>
              </FlexContainer>
            </CustomForm>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>

      <FlexContainer flexDirection="column">
        <FlexContainer justifyContent="space-between">
          <WithdrawCardItem>
            <FlexContainer>
              <SvgIcon {...IconFast} fillColor="#FFFCCC" />
            </FlexContainer>
            <FlexContainer flexDirection="column">
              <PrimaryTextSpan
                fontWeight="bold"
                fontSize="12px"
                color="#FFFCCC"
              >
                Fast
              </PrimaryTextSpan>
              <PrimaryTextSpan fontSize="12px" color="rgba(255,255,255,0.4)">
                A request is processed
                <br /> within 24 hours
              </PrimaryTextSpan>
            </FlexContainer>
          </WithdrawCardItem>

          <WithdrawCardItem>
            <FlexContainer>
              <img src={IconNoCommission} height="16px" />
            </FlexContainer>
            <FlexContainer flexDirection="column">
              <PrimaryTextSpan
                fontWeight="bold"
                fontSize="12px"
                color="#FFFCCC"
              >
                No commission
              </PrimaryTextSpan>
              <PrimaryTextSpan fontSize="12px" color="rgba(255,255,255,0.4)">
                The commission for
                <br /> withdrawing is 0%
              </PrimaryTextSpan>
            </FlexContainer>
          </WithdrawCardItem>

          <WithdrawCardItem>
            <FlexContainer>
              <img src={IconNoLimits} height="11px" />
            </FlexContainer>
            <FlexContainer flexDirection="column">
              <PrimaryTextSpan
                fontWeight="bold"
                fontSize="12px"
                color="#FFFCCC"
              >
                No limits
              </PrimaryTextSpan>
              <PrimaryTextSpan fontSize="12px" color="rgba(255,255,255,0.4)">
                Unlimited maximum
                <br /> withdrawal amount
              </PrimaryTextSpan>
            </FlexContainer>
          </WithdrawCardItem>
        </FlexContainer>

        <FaqOpenBlock>
          <FlexContainer>
            <img src={IconFaq} width="40px" height="40px" />

            <FlexContainer flexDirection="column" padding="0 16px">
              <PrimaryTextSpan
                textTransform="uppercase"
                color="#FFFCCC"
                fontSize="14px"
                lineHeight="16px"
              >
                Faq
              </PrimaryTextSpan>
              <PrimaryTextSpan
                color="#FFFFFF"
                fontSize="14px"
                lineHeight="16px"
              >
                Frequently Asked Questions
              </PrimaryTextSpan>
            </FlexContainer>
          </FlexContainer>
          <FlexContainer>
            <ButtonOpenFaq>
              <PrimaryTextSpan
                color="#fffccc"
                fontSize="14px"
                fontWeight="normal"
              >
                Open
              </PrimaryTextSpan>
            </ButtonOpenFaq>
          </FlexContainer>
        </FaqOpenBlock>
      </FlexContainer>
    </FlexContainer>
  );
};

export default WithdrawRequestTab;

const CustomForm = styled.form`
  margin-bottom: 0;
`;

const InputField = styled.input`
  background-color: transparent;
  border: none;
  outline: none;
  width: 100%;
  height: 100%;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  color: #fffccc;
  padding: 8px 0 8px 8px;
  appearance: none;
  -moz-appearance: textfield;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  &:-webkit-input-placeholder {
    color: #fff;
    opacity: 0.3;
    font-weight: normal;
  }

  &:-ms-input-placeholder {
    color: #fff;
    opacity: 0.3;
    font-weight: normal;
  }

  &::placeholder {
    color: #fff;
    opacity: 0.3;
    font-weight: normal;
  }
`;

const InputWrapper = styled(FlexContainer)`
  border-radius: 4px;
  border: 1px solid
    ${props => (props.hasError ? '#ED145B' : 'rgba(255, 255, 255, 0.1)')};
  color: #fff;
  background-color: rgba(255, 255, 255, 0.06);
`;

const WithdrawCardItem = styled(FlexContainer)`
  border-radius: 4px;
  padding: 16px 12px;
  height: 120px;
  width: 228px;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.4s ease;
  background: rgba(255, 255, 255, 0.06);
`;

const WithdrawPaymenMethodtItem = styled(ButtonWithoutStyles)<{
  active: boolean;
}>`
  display: flex;
  border: 2px solid ${props => (props.active ? '#FFFCCC' : 'transparent')};
  background: ${props =>
    props.active ? '#373737' : 'rgba(255, 255, 255, 0.06)'};
  border-radius: 4px;
  padding: 16px 12px;
  height: 120px;
  width: 228px;
  margin-right: 16px;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.4s ease;
`;

const FaqOpenBlock = styled(FlexContainer)`
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  background: rgba(41, 44, 51, 0.5);
  border: 1px solid rgba(112, 113, 117, 0.5);
  border-radius: 5px;
  padding: 16px;
`;

const ButtonOpenFaq = styled(SecondaryButton)`
  width: 132px;
  height: 40px;
`;

const ErrorText = styled.span`
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  color: #ff557e;
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
`;

const DeposteButton = styled(SecondaryButton)`
  width: 100%;
  height: 40px;
`;
