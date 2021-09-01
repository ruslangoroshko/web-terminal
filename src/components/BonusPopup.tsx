import React, { FC, useEffect } from 'react';
import styled from '@emotion/styled';

import Modal from './Modal';
import { FlexContainer } from '../styles/FlexContainer';
import { useLocation, useHistory } from 'react-router-dom';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import SvgIcon from './SvgIcon';
import IconClose from '../../../assets/svg/icon-close.svg';
import { useStores } from '../hooks/useStores';
import Pages from '../constants/Pages';
import { WithT } from 'i18next';
//
// ?status=success&amount=500#payment
// ?status=fail#payment

interface Params {
  hash: string;
  status: string;
  amount?: number;
}

const BonusPopup: FC = () => {
  const { mainAppStore } = useStores();

  const { push } = useHistory();

  const handleClosePopup = () => {
    push(Pages.DASHBOARD);
  };

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
            right="12px"
            top="12px"
            zIndex="300"
          >
            <ButtonWithoutStyles onClick={handleClosePopup}>
              <SvgIcon
                {...IconClose}
                fillColor="rgba(255, 255, 255, 0.6)"
                hoverFillColor="#00FFF2"
              />
            </ButtonWithoutStyles>
          </FlexContainer>

        {/*  */}
        </PopupWrap>
      </ModalBackground>
    </Modal>
  );
};

export default BonusPopup;

const PopupWrap = styled(FlexContainer)`
  width: 408px;
  border-radius: 8px;
  background-color: #1c1f26;
  padding: 72px 32px 44px;
`;

const ModalBackground = styled(FlexContainer)`
  background-color: rgba(37, 38, 54, 0.8);
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(37, 38, 54, 0.6);
    backdrop-filter: blur(12px);
  }
`;
