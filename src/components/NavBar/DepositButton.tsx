import React from 'react';
import { PrimaryButton } from '../../styles/Buttons';
import { PrimaryTextSpan } from '../../styles/TextsElements';

interface Props {}

function DepositButton(props: Props) {
  const {} = props;
  const handleClick = () => {};
  return (
    <PrimaryButton
      onClick={handleClick}
      padding="8px 16px"
      backgroundColor="#00FFF2"
    >
      <PrimaryTextSpan fontSize="12px" color="#003A38" fontWeight="bold">
        Deposit
      </PrimaryTextSpan>
    </PrimaryButton>
  );
}

export default DepositButton;
