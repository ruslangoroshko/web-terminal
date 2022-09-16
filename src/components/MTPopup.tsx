import React, { FC, useRef } from 'react';
import styled from '@emotion/styled';

import Modal from './Modal';
import { FlexContainer } from '../styles/FlexContainer';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import SvgIcon from './SvgIcon';

import IconClose from '../assets/svg/icon-close.svg';
import IconCopy from '../assets/svg/icon-copy-mt.svg';
import IconCopyButton from '../assets/svg/icon-copy-button.svg';

import { useStores } from '../hooks/useStores';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '../styles/Buttons';
import Colors from '../constants/Colors';

const MTPopup: FC = observer(() => {
  const { accountTypeStore, notificationStore } = useStores();
  const { t } = useTranslation();
  const copyServer = useRef<HTMLInputElement>(null);
  const copyLogin = useRef<HTMLInputElement>(null);
  const copyPassword = useRef<HTMLInputElement>(null);
  const copyInvestor = useRef<HTMLInputElement>(null);

  const handleClosePopup = () => {
    accountTypeStore.setShowMTPopup(false);
    accountTypeStore.setNewMTAccountInfo(null);
  };

  const handleCopyText = (ref: any) => () => {
    if (ref && ref.current) {
      const input = document.createElement('textarea');
      input.innerHTML = `${ref.current.name}: ${ref.current.value}`;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      notificationStore.setNotification(t('Copied successfully!'));
      notificationStore.setIsSuccessfull(true);
      notificationStore.openNotificationGlobal();
    }
  };

  const handleCopyAll = () => {
    const input = document.createElement('textarea');
    input.innerHTML = `server: ${accountTypeStore.newMTAccountInfo?.serverName}
login: ${accountTypeStore.newMTAccountInfo?.login}
password: ${accountTypeStore.newMTAccountInfo?.password}
investor: ${accountTypeStore.newMTAccountInfo?.investorPassword}`;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    notificationStore.setNotification(t('Copied successfully!'));
    notificationStore.setIsSuccessfull(true);
    notificationStore.openNotificationGlobal();
  };

  if (accountTypeStore.showMTPopup) {
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
            <PopupHeader>
              <PrimaryTextSpan
                color={Colors.ACCENT}
                fontWeight={700}
                fontSize="20px"
                lineHeight="150%"
              >
                {t('MT5 Credentials')}
              </PrimaryTextSpan>
              <ButtonWithoutStyles onClick={handleClosePopup}>
                <SvgIcon
                  {...IconClose}
                  fillColor={Colors.WHITE_DARK}
                  hoverFillColor={Colors.PRIMARY}
                  width="16px"
                  height="16px"
                />
              </ButtonWithoutStyles>
            </PopupHeader>
            <FlexContainer
              flexDirection="column"
              alignItems="center"
            >
              {/* Server field */}
              <FlexContainer
                marginBottom="20px"
                flexDirection="column"
              >
                <FlexContainer marginBottom="4px">
                  <PrimaryTextSpan
                    color={Colors.WHITE_DARK}
                    fontWeight={500}
                    fontSize="11px"
                    lineHeight="150%"
                    textTransform="uppercase"
                  >
                    {t('Server')}
                  </PrimaryTextSpan>
                </FlexContainer>
                <TextBlockWrapper
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <TextBlockForDev
                    ref={copyServer}
                    value={accountTypeStore.newMTAccountInfo?.serverName}
                    name="server"
                    readOnly
                  />
                  <CustomIcon onClick={handleCopyText(copyServer)}>
                    <SvgIcon {...IconCopy} fillColor="none" />
                  </CustomIcon>
                </TextBlockWrapper>
              </FlexContainer>
              {/* End Server field */}
              {/* Login field */}
              <FlexContainer
                marginBottom="20px"
                flexDirection="column"
              >
                <FlexContainer marginBottom="4px">
                  <PrimaryTextSpan
                    color={Colors.WHITE_DARK}
                    fontWeight={500}
                    fontSize="11px"
                    lineHeight="150%"
                    textTransform="uppercase"
                  >
                    {t('Login')}
                  </PrimaryTextSpan>
                </FlexContainer>
                <TextBlockWrapper
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <TextBlockForDev
                    ref={copyLogin}
                    value={accountTypeStore.newMTAccountInfo?.login}
                    name="login"
                    readOnly
                  />
                  <CustomIcon onClick={handleCopyText(copyLogin)}>
                    <SvgIcon {...IconCopy} fillColor="none" />
                  </CustomIcon>
                </TextBlockWrapper>
              </FlexContainer>
              {/* End Login field */}
              {/* Password field */}
              <FlexContainer
                marginBottom="20px"
                flexDirection="column"
              >
                <FlexContainer marginBottom="4px">
                  <PrimaryTextSpan
                    color={Colors.WHITE_DARK}
                    fontWeight={500}
                    fontSize="11px"
                    lineHeight="150%"
                    textTransform="uppercase"
                  >
                    {t('Password')}
                  </PrimaryTextSpan>
                </FlexContainer>
                <TextBlockWrapper
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <TextBlockForDev
                    ref={copyPassword}
                    value={accountTypeStore.newMTAccountInfo?.password}
                    name="password"
                    readOnly
                  />
                  <CustomIcon onClick={handleCopyText(copyPassword)}>
                    <SvgIcon {...IconCopy} fillColor="none" />
                  </CustomIcon>
                </TextBlockWrapper>
              </FlexContainer>
              {/* End Password field */}
              {/* Investor field */}
              <FlexContainer
                marginBottom="32px"
                flexDirection="column"
              >
                <FlexContainer marginBottom="4px">
                  <PrimaryTextSpan
                    color={Colors.WHITE_DARK}
                    fontWeight={500}
                    fontSize="11px"
                    lineHeight="150%"
                    textTransform="uppercase"
                  >
                    {t('Investor')}
                  </PrimaryTextSpan>
                </FlexContainer>
                <TextBlockWrapper
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <TextBlockForDev
                    ref={copyInvestor}
                    value={accountTypeStore.newMTAccountInfo?.investorPassword}
                    name="investor"
                    readOnly
                  />
                  <CustomIcon onClick={handleCopyText(copyInvestor)}>
                    <SvgIcon {...IconCopy} fillColor="none" />
                  </CustomIcon>
                </TextBlockWrapper>
              </FlexContainer>
              {/* End Investor field */}
              {/* Button field */}
              <FlexContainer
                flexDirection="column"
                marginBottom="16px"
              >
                <PrimaryButton
                  padding="18px 12px"
                  type="button"
                  width="344px"
                  onClick={handleCopyAll}
                >
                  <FlexContainer alignItems="center" justifyContent="center">
                    <FlexContainer marginRight="5px">
                      <PrimaryTextSpan
                        color="#1C1F26"
                        fontWeight="bold"
                        fontSize="16px"
                      >
                        {t('Copy All')}
                      </PrimaryTextSpan>
                    </FlexContainer>
                    <SvgIcon {...IconCopyButton} fillColor="none" />
                  </FlexContainer>
                </PrimaryButton>
              </FlexContainer>
              {/* End Button field */}
            </FlexContainer>
          </PopupWrap>
        </ModalBackground>
      </Modal>
    );
  }
   return null;
});

export default MTPopup;

const PopupWrap = styled(FlexContainer)`
  width: 392px;
  border-radius: 5px;
  background-color: #1c1f26;
  padding: 102px 0 40px;
  box-shadow: 0px 34px 44px rgba(0, 0, 0, 0.25);
`;

const PopupHeader = styled(FlexContainer)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  zIndex: 300;
  padding: 20px 24px;
  height: 70px;
  width: 100%;
  border-bottom: 1px solid #77797D;
  align-items: center;
  justify-content: space-between;
`;

const ModalBackground = styled(FlexContainer)`
  background-color: rgba(37, 38, 54, 0.8);
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(37, 38, 54, 0.6);
    backdrop-filter: blur(12px);
  }
`;

const TextBlockForDev = styled.input`
  background: transparent;
  border: none;
  color: ${Colors.ACCENT};
  outline: none;
  &::selection {
    background-color: transparent;
    color: ${Colors.ACCENT};
  }
`;

const TextBlockWrapper = styled(FlexContainer)`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid ${Colors.WHITE_TINE};
  box-sizing: border-box;
  border-radius: 4px;
  width: 344px;
  padding: 16px;
`;

const CustomIcon = styled.span`
  cursor: pointer;
`;