import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';

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
import WithdrawEmptyBalance from './WithdrawEmptyBalance';
import { PersonalDataKYCEnum } from '../../enums/PersonalDataKYCEnum';
import WithdrawFormBankTransfer from './WithdrawPaymentForm/WithdrawFormBankTransfer';
import WithdrawFormBitcoin from './WithdrawPaymentForm/WithdrawFormBitcoin';
import { observer, Observer } from 'mobx-react-lite';
import WithdrawPendingPopup from './WithdrawPendingPopup';
import { useTranslation } from 'react-i18next';
import { WithdrawalHistoryResponseStatus } from '../../enums/WithdrawalHistoryResponseStatus';
import API from '../../helpers/API';
import { WithdrawalStatusesEnum } from '../../enums/WithdrawalStatusesEnum';
import { brandingLinksTranslate } from '../../constants/brandingLinksTranslate';
import { moneyFormatPart } from '../../helpers/moneyFormat';
import useAccount from '../../hooks/useAccount';
import InformationPopup from '../InformationPopup';

const WithdrawRequestTab = observer(() => {
  const { mainAppStore, withdrawalStore, notificationStore } = useStores();
  const requestWrapper = useRef(document.createElement('div'));
  const { total } = useAccount();

  const [paymentMeyhod, setPaymentMethod] = useState(
    WithdrawalTypesEnum.BankTransfer
  );

  useEffect(() => {
    const initHistoryList = async () => {
      try {
        const result = await API.getWithdrawalHistory(
          mainAppStore.initModel.tradingUrl
        );
        if (result.status === WithdrawalHistoryResponseStatus.Successful) {
          const isPending = result.history?.some(
            (item) =>
              item.status === WithdrawalStatusesEnum.Pending ||
              item.status === WithdrawalStatusesEnum.Proccesing
          );

          if (isPending) {
            withdrawalStore.setPendingPopup();
          } else {
            withdrawalStore.closePendingPopup();
          }
        }
      } catch (error) {}
    };
    initHistoryList();
  }, []);

  useEffect(() => {
    if (withdrawalStore.pendingPopup) {
      requestWrapper.current.scrollTop = 0;
    }
  }, [withdrawalStore.pendingPopup]);

  const { t } = useTranslation();

  const getAccount = useCallback(() => {
    return mainAppStore.accounts.find((item) => item.isLive);
  }, [mainAppStore.accounts]);

  return (
    <RequestTabWrap
      flexDirection="column"
      minHeight="calc(100vh - 234px)"
      justifyContent="space-between"
      position="relative"
      isSlab={
        withdrawalStore.pendingPopup ||
        mainAppStore.profileStatus === PersonalDataKYCEnum.NotVerified
      }
      ref={requestWrapper}
    >
      {withdrawalStore.pendingPopup && <WithdrawPendingPopup />}
      <PaymentButtonsWrapper flexDirection="column" marginBottom="16px">
        <FlexContainer marginBottom="48px">
          

          <FlexContainer flexDirection="column" marginRight="36px">
            <PrimaryTextSpan
              textTransform="uppercase"
              fontSize="12px"
              color="rgba(255,255,255,0.4)"
              marginBottom="8px"
            >
              {t('Withdrawable')}
            </PrimaryTextSpan>
            <FlexContainer height="28px" alignItems="flex-end">
              <PrimaryTextSpan
                textTransform="uppercase"
                fontSize="24px"
                fontWeight="bold"
                color="#FFFCCC"
              >
                {getAccount()?.symbol}
                {moneyFormatPart((mainAppStore.realAcc?.balance || 0) - (mainAppStore.realAcc?.bonus || 0)).int}
                <PrimaryTextSpan
                  textTransform="uppercase"
                  fontSize="14px"
                  fontWeight="bold"
                  color="#FFFCCC"
                >
                  .{moneyFormatPart((mainAppStore.realAcc?.balance || 0) - (mainAppStore.realAcc?.bonus || 0)).decimal}
                </PrimaryTextSpan>
              </PrimaryTextSpan>
            </FlexContainer>
          </FlexContainer>

          {Number(getAccount()?.bonus) > 0 && (
            <>
              <FlexContainer
                height="50px"
                width="1px"
                background="rgba(255, 255, 255, 0.2)"
                marginRight="36px"
              />
              <FlexContainer flexDirection="column" justifyContent="space-between">
                <FlexContainer alignItems="center">
                  <PrimaryTextSpan
                    textTransform="uppercase"
                    fontSize="12px"
                    color="rgba(255,255,255,0.4)"
                    marginRight="4px"
                  >
                    {t('Bonus')}
                  </PrimaryTextSpan>
                  <InformationPopup
                    bgColor="#000000"
                    classNameTooltip="autoclose"
                    width="212px"
                    direction="right"
                  >
                    <PrimaryTextSpan color="#fffccc" fontSize="12px">
                      {t(
                        'There is no possibility of withdrawing bonus. But this is an extra amount on your account and when you make a profit with them, this is something you can withdraw.'
                      )}
                    </PrimaryTextSpan>
                  </InformationPopup>
                </FlexContainer>

                <FlexContainer height="28px" alignItems="flex-end">
                  <PrimaryTextSpan
                    textTransform="uppercase"
                    fontSize="14px"
                    fontWeight="bold"
                    color="#FFFCCC"
                  >
                    {getAccount()?.symbol}
                    {moneyFormatPart(getAccount()?.bonus || 0).int}
                    <PrimaryTextSpan
                      textTransform="uppercase"
                      fontSize="10px"
                      fontWeight="bold"
                      color="#FFFCCC"
                    >
                      .{moneyFormatPart(getAccount()?.bonus || 0).decimal}
                    </PrimaryTextSpan>
                  </PrimaryTextSpan>
                </FlexContainer>
              </FlexContainer>
            </>
          )}
        </FlexContainer>

        <PaymentButtonsWrapper flexDirection="column">
          <PaymentButtonsWrapper flexDirection="column">
            {mainAppStore.profileEmail &&
              (
                mainAppStore.profileStatus ===
                PersonalDataKYCEnum.NotVerified ||
                mainAppStore.profileStatus ===
                PersonalDataKYCEnum.OnVerification ||
                mainAppStore.profileStatus ===
                PersonalDataKYCEnum.Restricted
              ) && <WithdrawPagePopup type={mainAppStore.profileStatus} />}
            <PrimaryTextSpan
              textTransform="uppercase"
              fontSize="12px"
              color="rgba(255,255,255,0.4)"
              marginBottom="12px"
            >
              {t('Payment methods')}
            </PrimaryTextSpan>
            <FlexContainer width="100%" marginBottom="16px">
              <WithdrawPaymenMethodtItem
                active={paymentMeyhod === WithdrawalTypesEnum.BankTransfer}
                // TODO: reafactor
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
                    {t('Bank transfer')}
                  </PrimaryTextSpan>
                  <PrimaryTextSpan
                    fontSize="12px"
                    color="rgba(255,255,255,0.4)"
                    textAlign="left"
                  >
                    {t('Other methods will be available')}
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
                    {t('Bitcoin')}
                  </PrimaryTextSpan>
                  <PrimaryTextSpan
                    fontSize="12px"
                    color="rgba(255,255,255,0.4)"
                    textAlign="left"
                  >
                    {t('Other methods will be available')}
                  </PrimaryTextSpan>
                </FlexContainer>
              </WithdrawPaymenMethodtItem>
            </FlexContainer>

            <FlexContainer>
              {paymentMeyhod === WithdrawalTypesEnum.BankTransfer && (
                <WithdrawFormBankTransfer />
              )}
              {paymentMeyhod === WithdrawalTypesEnum.Bitcoin && (
                <WithdrawFormBitcoin />
              )}
            </FlexContainer>
          </PaymentButtonsWrapper>
          {Number(
            mainAppStore.accounts.find((item) => item.isLive)?.balance
          ) === 0 && <WithdrawEmptyBalance />}
        </PaymentButtonsWrapper>
      </PaymentButtonsWrapper>

      <PaymentButtonsWrapper flexDirection="column">
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
                {t('Fast')}
              </PrimaryTextSpan>
              <PrimaryTextSpan fontSize="12px" color="rgba(255,255,255,0.4)">
                {t('A request is processed')}
                <br /> {t('within 24 hours')}
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
                {t('No commission')}
              </PrimaryTextSpan>
              <PrimaryTextSpan fontSize="12px" color="rgba(255,255,255,0.4)">
                {t('The commission for withdrawing is 0%')}
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
                {t('No limits')}
              </PrimaryTextSpan>
              <PrimaryTextSpan fontSize="12px" color="rgba(255,255,255,0.4)">
                {t('Unlimited maximum withdrawal amount')}
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
                {t('FAQ')}
              </PrimaryTextSpan>
              <PrimaryTextSpan
                color="#FFFFFF"
                fontSize="14px"
                lineHeight="16px"
              >
                {t('Frequently Asked Questions')}
              </PrimaryTextSpan>
            </FlexContainer>
          </FlexContainer>
          <FlexContainer>
            <ButtonOpenFaq
              href={t(
                `${
                  brandingLinksTranslate[mainAppStore.initModel.brandProperty]
                    .faq
                }`
              )}
              target="blank"
            >
              <PrimaryTextSpan
                color="#fffccc"
                fontSize="14px"
                fontWeight="normal"
              >
                {t('Open')}
              </PrimaryTextSpan>
            </ButtonOpenFaq>
          </FlexContainer>
        </FaqOpenBlock>
      </PaymentButtonsWrapper>
    </RequestTabWrap>
  );
});

export default WithdrawRequestTab;

const RequestTabWrap = styled(FlexContainer)<{ isSlab?: boolean }>`
  overflow-y: ${(props) => (props.isSlab ? 'hidden' : 'auto')};
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
  border: 2px solid ${(props) => (props.active ? '#FFFCCC' : 'transparent')};
  background: ${(props) =>
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

const PaymentButtonsWrapper = styled(FlexContainer)`
  flex: 1 0 auto;
`;

const ButtonOpenFaq = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  background-color: rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.24);
  }

  &:focus {
    background-color: rgba(0, 0, 0, 0.24);
  }

  &:disabled {
    background-color: rgba(255, 255, 255, 0.04);
    & span {
      color: rgba(255, 255, 255, 0.4);
    }
  }
  width: 132px;
  height: 40px;
`;
