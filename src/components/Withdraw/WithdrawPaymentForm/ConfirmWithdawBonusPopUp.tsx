import styled from '@emotion/styled';
import React from 'react';
import { FlexContainer } from '../../../styles/FlexContainer';
import ConfirmPopup from '../../ConfirmPopup';
import Modal from '../../Modal';

interface IConfirmWithdawBonusPopUpProps {
  toggle: (arg: boolean) => void;
  applyHandler: () => void;
}
const ConfirmWithdawBonusPopUp = ({toggle, applyHandler}: IConfirmWithdawBonusPopUpProps) => {
  return (
    <Modal>
      <ConfirmationWrap>
        <ConfirmPopup
          applyHandler={applyHandler}
          confirmText="When you withdraw your funds, the bonus will be deducted from your account."
          toggle={toggle}
        />
      </ConfirmationWrap>
    </Modal>
  );
};

const ConfirmationWrap = styled(FlexContainer)`
  position: fixed;
  z-index: 9999;
  background: rgba(21, 22, 25, 0.9);
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
`;

export default ConfirmWithdawBonusPopUp;
