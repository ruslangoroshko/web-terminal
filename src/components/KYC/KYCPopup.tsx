import React, { FC, useEffect } from 'react';
import styled from '@emotion/styled';

import Modal from '../Modal';
import { FlexContainer } from '../../styles/FlexContainer';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import SvgIcon from '../SvgIcon';
import IconClose from '../../assets/svg/icon-close.svg';
import IconSend from '../../assets/svg/icon-mail.svg';
import { useStores } from '../../hooks/useStores';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '../../styles/Buttons';
import { brandingLinksTranslate } from '../../constants/brandingLinksTranslate';
import Colors from '../../constants/Colors';

const KYCPopup: FC = observer(() => {
  const { mainAppStore, kycStore } = useStores();
  const { t } = useTranslation();

  const handleClosePopup = () => {
    kycStore.setShowPopup(false);
  };

  if (kycStore.showPopup) {
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
            <FlexContainer flexDirection="column" alignItems="center">
              <FlexContainer
                position="relative"
                width="138px"
                height="138px"
                borderRadius="50%"
                backgroundColor={Colors.ACCENT}
                alignItems="center"
                justifyContent="center"
                marginBottom="32px"
              >
                <SvgIcon {...IconSend} fillColor="none" />
              </FlexContainer>
              <PrimaryTextSpan
                color={Colors.WHITE}
                fontWeight={500}
                fontSize="18px"
                lineHeight="150%"
                marginBottom="16px"
              >
                {t('Your documents were successfully send')}
              </PrimaryTextSpan>
              <FlexContainer marginBottom="134px" width="343px">
                <PrimaryTextSpan
                  color={Colors.WHITE_DARK}
                  fontWeight={400}
                  fontSize="16px"
                  lineHeight="150%"
                  textAlign="center"
                >
                  {t(
                    'Our Compliance Department will review your data in a timely manner. This process usually takes no more than 48 business hours.'
                  )}
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer flexDirection="column" marginBottom="16px">
                <PrimaryButton
                  padding="18px 12px"
                  type="button"
                  width="344px"
                  onClick={handleClosePopup}
                >
                  <PrimaryTextSpan
                    color="#1C1F26"
                    fontWeight="bold"
                    fontSize="16px"
                  >
                    {t('Close')}
                  </PrimaryTextSpan>
                </PrimaryButton>
              </FlexContainer>
              <PrimaryTextSpan
                color={Colors.WHITE_LIGHT}
                fontWeight={400}
                fontSize="14px"
                lineHeight="150%"
                textAlign="center"
              >
                {t('For questions regarding verification please contact')}
              </PrimaryTextSpan>
              <LinkItem
                href={`mailto: ${
                  brandingLinksTranslate[mainAppStore.initModel.brandProperty]
                    .supportEmail
                }`}
              >
                {
                  brandingLinksTranslate[mainAppStore.initModel.brandProperty]
                    .supportEmail
                }
              </LinkItem>
            </FlexContainer>
          </PopupWrap>
        </ModalBackground>
      </Modal>
    );
  }
  return null;
});

export default KYCPopup;

const PopupWrap = styled(FlexContainer)`
  width: 471px;
  border-radius: 5px;
  background-color: #1c1f26;
  padding: 60px 0 40px;
  box-shadow: 0px 34px 44px rgba(0, 0, 0, 0.25);
`;

const ModalBackground = styled(FlexContainer)`
  background-color: rgba(37, 38, 54, 0.8);
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(37, 38, 54, 0.6);
    backdrop-filter: blur(12px);
  }
`;

const LinkItem = styled.a`
  transition: 0.4s;
  text-decoration: none;
  font-size: 14px;
  line-height: 150%;
  color: #fff ${Colors.WHITE};
  :hover {
    color: ${Colors.WHITE_DARK};
  }
`;
