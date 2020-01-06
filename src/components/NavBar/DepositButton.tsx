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
  background: linear-gradient(0deg, #00FFF2, #00FFF2);
  padding: 4px 16px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 12px;
  line-height: 14px;
  color: ${ColorsPallete.DEEP_TEAL};
`;
