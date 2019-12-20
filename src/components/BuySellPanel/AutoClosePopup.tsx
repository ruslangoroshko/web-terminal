import React from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import IconClose from '../../assets/svg/icon-popup-close.svg';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import SvgIcon from '../SvgIcon';
import PnLTypeDropdown from './PnLTypeDropdown';

interface Props {
  toggle: () => void;
}

function AutoClosePopup(props: Props) {
  const { toggle } = props;
  return (
    <Wrapper
      position="relative"
      padding="16px"
      flexDirection="column"
      width="200px"
    >
      <ButtonClose onClick={toggle}>
        <SvgIcon {...IconClose} fill="rgba(255, 255, 255, 0.6)"></SvgIcon>
      </ButtonClose>
      <Title>Set Autoclose</Title>
      <FlexContainer
        margin="0 0 6px 0"
        alignItems="center"
        justifyContent="space-between"
      >
        <Label>When Profit is</Label>
        <InfoIcon width="14px" justifyContent="center" alignItems="center">
          i
        </InfoIcon>
      </FlexContainer>
      <InputWrapper
        padding="8px 32px 8px 22px"
        margin="0 0 16px 0"
        height="32px"
        width="100%"
        position="relative"
      >
        <PlusSign>+</PlusSign>
        <InputPnL placeholder="Non Set"></InputPnL>
        <PnLTypeDropdown></PnLTypeDropdown>
      </InputWrapper>
      <FlexContainer
        margin="0 0 6px 0"
        alignItems="center"
        justifyContent="space-between"
      >
        <Label>When Loss is</Label>
        <InfoIcon width="14px" justifyContent="center" alignItems="center">
          i
        </InfoIcon>
      </FlexContainer>
      <InputWrapper
        padding="8px 32px 8px 22px"
        margin="0 0 16px 0"
        height="32px"
        width="100%"
        position="relative"
      >
        <PlusSign>-</PlusSign>
        <InputPnL placeholder="Non Set"></InputPnL>
      </InputWrapper>
      <ButtonApply>Apply</ButtonApply>
    </Wrapper>
  );
}

export default AutoClosePopup;

const Wrapper = styled(FlexContainer)`
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.25),
    0px 6px 12px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(12px);
  border-radius: 4px;

  &:before {
    content: '';
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.4);
  }
`;

const Title = styled.p`
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
  margin-bottom: 16px;
`;

const Label = styled.span`
  font-size: 11px;
  line-height: 12px;
  text-transform: uppercase;
  color: #ffffff;
  opacity: 0.3;
`;

const InfoIcon = styled(FlexContainer)`
  font-size: 11px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  font-style: italic;
`;

const ButtonClose = styled(ButtonWithoutStyles)`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InputPnL = styled.input`
  background-color: transparent;
  border: none;
  outline: none;
  width: 100%;
  height: 100%;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  color: #ffffff;

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
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;

  &:before {
    content: '';
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.06);
  }
`;

const PlusSign = styled.span`
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  color: #ffffff;
  position: absolute;
  top: 50%;
  left: 8px;
  transform: translateY(-50%);
`;

const ButtonApply = styled(ButtonWithoutStyles)`
  background: linear-gradient(0deg, #00fff2, #00fff2);
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  color: #003a38;
  height: 32px;
`;
