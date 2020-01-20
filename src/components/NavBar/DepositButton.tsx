import React from 'react';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import ColorsPallete from '../../styles/colorPallete';

interface Props {}

function DepositButton(props: Props) {
  const {} = props;
  const handleClick = () => {};
  return <ButtonWrapper onClick={handleClick}>Deposit</ButtonWrapper>;
}

export default DepositButton;

const ButtonWrapper = styled(ButtonWithoutStyles)`
  background-color: #00fff2;
  padding: 4px 16px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 12px;
  line-height: 14px;
  color: ${ColorsPallete.DEEP_TEAL};

  &:hover {
    background-color: #9ffff2;
  }

  &:focus {
    background-color: #21b3a4;
  }

  &:disabled {
    background-color: rgba(255, 255, 255, 0.04);
    color: white;
  }
`;
