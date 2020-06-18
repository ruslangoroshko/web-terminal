import React, { useEffect, useState, useCallback } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import AccountSettingsContainer from '../containers/AccountSettingsContainer';
import { PrimaryTextSpan, PrimaryTextParagraph } from '../styles/TextsElements';
import * as yup from 'yup';
import API from '../helpers/API';
import { useStores } from '../hooks/useStores';
import styled from '@emotion/styled';
import SvgIcon from '../components/SvgIcon';
import BadRequestPopup from '../components/BadRequestPopup';
import { Observer } from 'mobx-react-lite';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import IconClose from '../assets/svg/icon-popup-close.svg';
import { useHistory } from 'react-router-dom';
import LoaderForComponents from '../components/LoaderForComponents';
import { useFormik } from 'formik';
import Fields from '../constants/fields';
import validationInputTexts from '../constants/validationInputTexts';
import { PrimaryButton, SecondaryButton } from '../styles/Buttons';
import ErropPopup from '../components/ErropPopup';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import NotificationPopup from '../components/NotificationPopup';
import Page from '../constants/Pages';

import CardIcon from '../assets/images/master-card.png';
import BankTransferIcon from '../assets/svg/icon-bank-transfer.svg';
import BitcoinIcon from '../assets/svg/icon-bitcoin.svg';

import IconFast from '../assets/svg/icon-fast.svg';
import IconNoCommission from '../assets/images/icon-no-commission.png';
import IconNoLimits from '../assets/images/icon-no-limit.png';
import IconFaq from '../assets/images/icon-faq.png';

function AccountSecurity() {
  const {
    mainAppStore,
    depositFundsStore,
    badRequestPopupStore,
    notificationStore,
  } = useStores();
  const { push } = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // TODO: use formik value
  const [paymentMeyhod, setPaymentMethod] = useState(0);

  useEffect(() => {
    document.title = 'Account withdraw';
  }, []);

  return (
    <AccountSettingsContainer>
      <FlexContainer
        position="absolute"
        bottom="100px"
        left="14px"
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

      <IconButton onClick={() => push(Page.DASHBOARD)}>
        <SvgIcon
          {...IconClose}
          fillColor="rgba(255, 255, 255, 0.6)"
          hoverFillColor="#00FFDD"
        ></SvgIcon>
      </IconButton>
      <Observer>
        {() => <>{badRequestPopupStore.isActive && <BadRequestPopup />}</>}
      </Observer>

      <Observer>
        {() => (
          <LoaderForComponents
            isLoading={isLoading}
            backgroundColor="#252637"
          />
        )}
      </Observer>
      <FlexContainer flexDirection="column" width="708px" margin="0 0 0 80px">
        <PrimaryTextSpan
          color="#FFFCCC"
          fontSize="24px"
          fontWeight="bold"
          marginBottom="40px"
        >
          Withdraw
        </PrimaryTextSpan>

        <FlexContainer marginBottom="46px">
          <TabControllsWraper alignItems="flex-start" justifyContent="center">
            <TabControllItem
              onClick={() => {
                setActiveTab(0);
              }}
              active={activeTab === 0}
            >
              Request
            </TabControllItem>
            <TabControllItem
              onClick={() => {
                setActiveTab(1);
              }}
              active={activeTab === 1}
            >
              History
            </TabControllItem>
          </TabControllsWraper>
        </FlexContainer>

        {activeTab === 0 && (
          <FlexContainer
            flexDirection="column"
            minHeight="calc(100vh - 234px)"
            justifyContent="space-between"
            position="relative"
          >
            <WithdrawPagePopup>
              123
            </WithdrawPagePopup>

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
                    $0.00
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
                    $0.00
                  </PrimaryTextSpan>
                </FlexContainer>

                <FlexContainer flexDirection="column" width="180px">
                  <PrimaryTextSpan
                    textTransform="uppercase"
                    fontSize="12px"
                    color="rgba(255,255,255,0.4)"
                    marginBottom="12px"
                  >
                    Bonuses
                  </PrimaryTextSpan>
                  <PrimaryTextSpan
                    textTransform="uppercase"
                    fontSize="14px"
                    fontWeight="bold"
                    color="#FFFCCC"
                  >
                    $0.00
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
                <FlexContainer width="100%" justifyContent="space-between">
                  <WithdrawPaymenMethodtItem
                    active={paymentMeyhod === 0}
                    onClick={() => {
                      setPaymentMethod(0);
                    }}
                  >
                    <FlexContainer>
                      <img src={CardIcon} height="20px" />
                    </FlexContainer>
                    <FlexContainer flexDirection="column">
                      <PrimaryTextSpan
                        fontWeight="bold"
                        fontSize="12px"
                        color="#FFFCCC"
                      >
                        Card ** 7556
                      </PrimaryTextSpan>
                      <PrimaryTextSpan
                        fontSize="12px"
                        color="rgba(255,255,255,0.4)"
                      >
                        Up to $10.00
                      </PrimaryTextSpan>
                    </FlexContainer>
                  </WithdrawPaymenMethodtItem>

                  <WithdrawPaymenMethodtItem
                    active={paymentMeyhod === 1}
                    onClick={() => {
                      setPaymentMethod(1);
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
                    active={paymentMeyhod === 2}
                    onClick={() => {
                      setPaymentMethod(2);
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
                      Withdrawals are processed by the same payment systems used
                      to deposit money into the system.
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
                        //onChange={}
                        //value={values.oldPassword}
                        type="text"
                      ></InputField>

                      <ErrorText>max: $9.00</ErrorText>
                    </InputWrapper>

                    <PrimaryButton
                      width="160px"
                      padding="12px"
                      type="submit"
                      //onClick={handlerClickSubmit}
                      //disabled={!formikBag.isValid || formikBag.isSubmitting}
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
                    <PrimaryTextSpan
                      fontSize="12px"
                      color="rgba(255,255,255,0.4)"
                    >
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
                    <PrimaryTextSpan
                      fontSize="12px"
                      color="rgba(255,255,255,0.4)"
                    >
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
                    <PrimaryTextSpan
                      fontSize="12px"
                      color="rgba(255,255,255,0.4)"
                    >
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
        )}

        {activeTab === 1 && (
          <FlexContainer flexDirection="column">history</FlexContainer>
        )}
      </FlexContainer>
    </AccountSettingsContainer>
  );
}

export default AccountSecurity;

const WithdrawPagePopup = styled(FlexContainer)`
  position: absolute;
  background: #fff;
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

const IconButton = styled(ButtonWithoutStyles)`
  margin-right: 8px;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  &:last-of-type {
    margin-right: 0;
  }
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
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.4s ease;
`;

const TabControllsWraper = styled(FlexContainer)`
  width: 100%;
`;
const TabControllItem = styled(ButtonWithoutStyles)<{ active: boolean }>`
  width: 50%;
  color: ${props => (props.active ? '#fffccc' : '#979797')};
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  padding: 16px;
  position: relative;

  &:after {
    content: '';
    display: block;
    width: 100%;
    height: ${props => (props.active ? '2px' : '1px')};
    background: ${props => (props.active ? '#FFFCCC' : '#46484d')};
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    transition: all 0.2s ease;
  }

  &:hover {
    &:after {
      background: rgba(255, 252, 204, 0.48);
    }
  }
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
