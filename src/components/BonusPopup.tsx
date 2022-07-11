import React, { FC, useEffect } from 'react';
import styled from '@emotion/styled';

import Modal from './Modal';
import { FlexContainer } from '../styles/FlexContainer';
import { useHistory } from 'react-router-dom';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import SvgIcon from './SvgIcon';
import IconClose from '../assets/svg/icon-close.svg';
import { useStores } from '../hooks/useStores';
import Pages from '../constants/Pages';
import BonusGift from '../assets/images/bonus-gift.png';
import * as animationData from '../assets/lotties/confettie-animation.json';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { observer } from 'mobx-react-lite';
import Lottie from 'react-lottie';
import { useTranslation } from 'react-i18next';
import EventBonusTimer from './EventBonusTimer';
import Page from '../constants/Pages';
import { PrimaryButton } from '../styles/Buttons';
import Colors from '../constants/Colors';

interface Params {
  hash: string;
  status: string;
  amount?: number;
}

const BonusPopup: FC = observer(() => {
  const { mainAppStore, bonusStore } = useStores();
  const { t } = useTranslation();

  const { push } = useHistory();

  const handleSkipPopup = () => {
    push(Pages.DEPOSIT_POPUP);
    bonusStore.setShowBonusDeposit(false);
    bonusStore.setShowBonusPopup(false);
  };

  const handleClosePopup = () => {
    bonusStore.setShowBonusPopup(false);
  };

  const getLottieOptions = () => {
    return {
      loop: true,
      autoplay: true,
      pause: false,
      animationData: animationData.default,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
        clearCanvas: false,
      },
    };
  };

  const readFAQ = () => {
    bonusStore.setShowBonusPopup(false);
    push(Page.BONUS_FAQ);
  };

  const acceptBonus = () => {
    push(Pages.DEPOSIT_POPUP);
    bonusStore.setShowBonusDeposit(true);
    bonusStore.setShowBonusPopup(false);
  };

  if (bonusStore.showBonusPopup) {
    return (
      <Modal>
        <ModalBackground
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          alignItems="center"
          justifyContent="center"
          zIndex="1001"
        >
          <PopupWrap flexDirection="column" position="relative">
            <FlexContainer
              position="absolute"
              right="24px"
              top="24px"
              zIndex="300"
            >
              <ButtonWithoutStyles onClick={handleClosePopup}>
                <SvgIcon
                  {...IconClose}
                  fillColor={Colors.WHITE_DARK}
                  hoverFillColor={Colors.PRIMARY}
                  width="16px"
                  height="16px"
                />
              </ButtonWithoutStyles>
            </FlexContainer>

            <FlexContainer
              flexDirection="column"
              alignItems="center"
            >
              <FlexContainer
                position="relative"
                flexDirection="column"
                width="300px"
                height="300px"
                alignItems="center"
                margin="auto"
              >
                <PrimaryTextSpan
                  color={Colors.PRIMARY}
                  fontWeight="bold"
                  fontSize="22px"
                  lineHeight="140%"
                  marginBottom="10px"
                >
                  {t('Get')} {bonusStore.bonusPercent}% {t('bonus')}
                </PrimaryTextSpan>
                <FlexContainer
                  left="0"
                  top="0"
                  position="absolute"
                  width="300px"
                  height="300px"
                >
                  <Lottie
                    options={getLottieOptions()}
                    height="300px"
                    width="300px"
                    isClickToPauseDisabled={true}
                  />
                </FlexContainer>
                <FlexContainer position="relative">
                  <img width="184px" height="184px" src={BonusGift} alt="bonus gift" />
                </FlexContainer>
              </FlexContainer>
              <FlexContainer alignItems="center" flexDirection="column">
                <PrimaryTextSpan
                  fontWeight={400}
                  fontSize="16px"
                  color={Colors.ACCENT}
                  lineHeight="140%"
                  marginBottom="16px"
                >
                  <EventBonusTimer />
                </PrimaryTextSpan>
                <PrimaryTextSpan
                  color={Colors.WHITE_DARK}
                  fontWeight={400}
                  fontSize="16px"
                  lineHeight="140%"
                  marginBottom="24px"
                  textAlign="center"
                >
                  {t('The deposit added to your account as a gift.')}
                  <br />
                  {t('All profits made are yours to keep.')}
                  <br />
                  {t('All details about')} <CustomLink onClick={readFAQ}>{t('Bonus Rules')}</CustomLink>.
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer flexDirection="column">
                <PrimaryButton
                  padding="18px 12px"
                  type="button"
                  width="344px"
                  onClick={acceptBonus}
                >
                  <PrimaryTextSpan
                    color="#1C1F26"
                    fontWeight="bold"
                    fontSize="16px"
                  >
                    {t('Get Bonus')}
                  </PrimaryTextSpan>
                </PrimaryButton>
                <SkipButton
                  padding="18px 12px"
                  type="button"
                  width="344px"
                  backgroundColor="transparent"
                  onClick={handleSkipPopup}
                >
                  <PrimaryTextSpan
                    color={Colors.WHITE}
                    fontWeight="bold"
                    fontSize="16px"
                  >
                    {t('Skip bonus')}
                  </PrimaryTextSpan>
                </SkipButton>
              </FlexContainer>
            </FlexContainer>
          </PopupWrap>
        </ModalBackground>
      </Modal>
    );
  }
   return null;
});

export default BonusPopup;

const PopupWrap = styled(FlexContainer)`
  width: 471px;
  border-radius: 8px;
  background-color: #1c1f26;
  padding: 48px 0 40px;
`;

const ModalBackground = styled(FlexContainer)`
  background-color: rgba(37, 38, 54, 0.8);
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(37, 38, 54, 0.6);
    backdrop-filter: blur(12px);
  }
`;

const CustomLink = styled(PrimaryTextSpan)`
  color: ${Colors.ACCENT};
  text-decoration: underline;
  cursor: pointer;
`;

const SkipButton = styled(PrimaryButton)`
  &:hover {
    background-color: transparent;
  }
`;