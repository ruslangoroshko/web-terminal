import React, { FC } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import Modal from '../Modal';
import styled from '@emotion/styled';
import {
  PrimaryTextParagraph,
  PrimaryTextSpan,
} from '../../styles/TextsElements';
import paymentStatuses from '../../constants/paymentStatuses';
import SuccessImage from '../../assets/images/success.png';
import FailedImage from '../../assets/images/fail.png';
import PendingImage from '../../assets/svg/icon-attention.svg';
import { PrimaryButton } from '../../styles/Buttons';
import { useHistory } from 'react-router-dom';
import { useStores } from '../../hooks/useStores';
import Page from '../../constants/Pages';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import SvgIcon from '../SvgIcon';
import CloseIcon from '../../assets/svg/icon-close.svg';
import { useTranslation } from 'react-i18next';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../../constants/mixpanelEvents';
import { logger } from '../../helpers/ConsoleLoggerTool';

interface Props {
  status: string;
}

const StatusPaymentPopup: FC<Props> = ({ status }) => {
  const { push } = useHistory();
  const { depositFundsStore } = useStores();

  const backToDeposit = () => {
    push(Page.DASHBOARD);
    depositFundsStore.togglePopup();
  };

  const backToDashboard = () => {
    push(Page.DASHBOARD);
  };

  const { t } = useTranslation();

  const renderSuccessFail = () => {
    switch (status) {
      case paymentStatuses.SUCCESS:
        mixpanel.track(mixpanelEvents.DEPOSIT_PAGE_SUCCESS);

        return (
          <FlexContainer
            flexDirection="column"
            justifyContent="space-between"
            width="100%"
            height="100%"
          >
            <FlexContainer flexDirection="column" alignItems="center">
              <FlexContainer
                width="138px"
                marginBottom="40px"
                alignItems="center"
                justifyContent="center"
              >
                <Image src={SuccessImage}></Image>
              </FlexContainer>
              <PrimaryTextParagraph
                fontSize="20px"
                color="#fff"
                marginBottom="8px"
              >
                {t('Success')}
              </PrimaryTextParagraph>
              <PrimaryTextSpan fontSize="13px" color="rgba(255, 255, 255, 0.4)">
                {t('The operation was succesful.')}
              </PrimaryTextSpan>
            </FlexContainer>
            <PrimaryButton
              onClick={backToDashboard}
              width="100%"
              padding="20px"
            >
              <PrimaryTextSpan
                fontWeight="bold"
                fontSize="16px"
                color="#252636"
              >
                {t('Trade now')}
              </PrimaryTextSpan>
            </PrimaryButton>
          </FlexContainer>
        );

      case paymentStatuses.FAILED:
        mixpanel.track(mixpanelEvents.DEPOSIT_PAGE_FAILED);
        return (
          <FlexContainer
            flexDirection="column"
            justifyContent="space-between"
            height="100%"
            width="100%"
          >
            <FlexContainer flexDirection="column" alignItems="center">
              <FlexContainer
                width="138px"
                marginBottom="40px"
                alignItems="center"
                justifyContent="center"
              >
                <Image src={FailedImage}></Image>
              </FlexContainer>
              <PrimaryTextParagraph
                fontSize="20px"
                color="#fff"
                marginBottom="8px"
              >
                {t('Failed')}
              </PrimaryTextParagraph>
              <PrimaryTextSpan
                fontSize="13px"
                color="rgba(255, 255, 255, 0.4)"
                textAlign="center"
              >
                {t('Something went wrong.')}
                <br />
                {t('Try again or use another payment method.')}
              </PrimaryTextSpan>
            </FlexContainer>
            <PrimaryButton onClick={backToDeposit} width="100%" padding="20px">
              <PrimaryTextSpan
                fontWeight="bold"
                fontSize="16px"
                color="#252636"
              >
                {t('Back to Deposit')}
              </PrimaryTextSpan>
            </PrimaryButton>
          </FlexContainer>
        );

      case paymentStatuses.PENDING:
        mixpanel.track(mixpanelEvents.DEPOSIT_PAGE_PENDING);
        return (
          <FlexContainer
            flexDirection="column"
            justifyContent="space-between"
            height="100%"
            width="100%"
          >
            <FlexContainer flexDirection="column" alignItems="center">
              <FlexContainer
                width="138px"
                marginBottom="40px"
                alignItems="center"
                justifyContent="center"
              >
                <SvgIcon {...PendingImage} fillColor="#FDFD57"/>
              </FlexContainer>
              <PrimaryTextParagraph
                fontSize="20px"
                color="#fff"
                marginBottom="8px"
              >
                {t('Pending')}
              </PrimaryTextParagraph>
              <FlexContainer flexDirection="column" padding="16px">
                <PrimaryTextSpan
                  fontSize="13px"
                  color="rgba(255, 255, 255, 0.4)"
                  textAlign="center"
                  marginBottom="12px"
                >
                  {t('Thank you for your transaction')}
                </PrimaryTextSpan>
                <PrimaryTextSpan
                  fontSize="13px"
                  color="rgba(255, 255, 255, 0.4)"
                  textAlign="center"
                  marginBottom="12px"
                >
                  {t(
                    'Please note, that it is now being processed and it might take up to 2 business days'
                  )}
                </PrimaryTextSpan>
                <PrimaryTextSpan
                  fontSize="13px"
                  color="rgba(255, 255, 255, 0.4)"
                  textAlign="center"
                >
                  {t('You will receive an update to your e-mail')}
                </PrimaryTextSpan>
              </FlexContainer>
            </FlexContainer>
            <PrimaryButton onClick={backToDeposit} width="100%" padding="20px">
              <PrimaryTextSpan
                fontWeight="bold"
                fontSize="16px"
                color="#252636"
              >
                {t('Back to Deposit')}
              </PrimaryTextSpan>
            </PrimaryButton>
          </FlexContainer>
        );

      default:
        return null;
    }
  };
  return (
    <>
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
          <FlexContainer
            boxShadow="0px 12px 24px rgba(0, 0, 0, 0.25), 0px 6px 12px rgba(0, 0, 0, 0.25)"
            borderRadius="4px"
            backgroundColor="rgba(0,0,0,0.4)"
            position="relative"
            width="408px"
            height="538px"
            flexDirection="column"
            padding="70px 30px 44px"
            alignItems="center"
          >
            <FlexContainer position="absolute" top="18px" right="18px">
              <ButtonWithoutStyles onClick={backToDashboard}>
                <SvgIcon
                  {...CloseIcon}
                  fillColor="rgba(255, 255, 255, 0.6)"
                  hoverFillColor="#01ffdd"
                />
              </ButtonWithoutStyles>
            </FlexContainer>
            {renderSuccessFail()}
          </FlexContainer>
        </BackgroundWrapperLayout>
      </Modal>
    </>
  );
};

export default StatusPaymentPopup;

const BackgroundWrapperLayout = styled(FlexContainer)`
  background-color: rgba(0, 0, 0, 0.7);
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(0, 0, 0, 0.34);
    backdrop-filter: blur(12px);
  }
`;

const Image = styled.img`
  display: block;
  width: 100%;
`;
