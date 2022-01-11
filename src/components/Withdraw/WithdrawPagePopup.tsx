import React, { FC } from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { PrimaryButton } from '../../styles/Buttons';
import { useHistory } from 'react-router-dom';
import Page from '../../constants/Pages';
import { useTranslation } from 'react-i18next';
import { PersonalDataKYCEnum } from '../../enums/PersonalDataKYCEnum';

interface Props {
  type: PersonalDataKYCEnum;
}

const WithdrawPagePopup: FC<Props> = ({ type }) => {
  const { push } = useHistory();
  const { t } = useTranslation();
  return (
    <WithdrawPagePopupWrap alignItems="flex-start">
      <WithdrawPopup
        width="100%"
        padding="16px 20px"
        justifyContent="space-between"
        alignItems="center"
      >
        {(
          type === PersonalDataKYCEnum.NotVerified ||
          type === PersonalDataKYCEnum.Restricted
        )
          ? <>
            <FlexContainer padding="0 50px 0 0">
              <PrimaryTextSpan fontSize="14px" color="#ffffff" lineHeight="20px">
                {t('Withdrawals are available once your account is fully verified')}
              </PrimaryTextSpan>
            </FlexContainer>
            <FlexContainer>
              <PrimaryButton
                width="186px"
                padding="12px"
                type="submit"
                onClick={() => push(Page.PROOF_OF_IDENTITY)}
                //disabled={!formikBag.isValid || formikBag.isSubmitting}
              >
                <PrimaryTextSpan color="#1c2026" fontWeight="bold" fontSize="14px">
                  {t('Proceed to Verification')}
                </PrimaryTextSpan>
              </PrimaryButton>
            </FlexContainer>
          </>
          : <FlexContainer width="100%" justifyContent="center">
            <PrimaryTextSpan textAlign="center" fontSize="14px" color="#ffffff" lineHeight="20px">
              {t('Withdrawal is temporarily unavailable. Your  documents is verified by our Compliance  department.')} <br />
              {t('This process usually takes no longer than 48 working hours.')}
            </PrimaryTextSpan>
          </FlexContainer>
        }
      </WithdrawPopup>
    </WithdrawPagePopupWrap>
  );
};

export default WithdrawPagePopup;

const WithdrawPagePopupWrap = styled(FlexContainer)`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    backdrop-filter: blur(3px);
  }
`;

const WithdrawPopup = styled(FlexContainer)`
  background: #23252c;
  border: 1px solid rgba(112, 113, 117, 0.5);
  border-radius: 4px;
`;
