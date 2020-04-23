import React, { FC } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import styled from '@emotion/styled';

interface Props {
  isActive: boolean;
  currencySymbol: string;
  value: number;
  handleClick: (value: number) => void;
}

const AmountPlaceholder: FC<Props> = ({ isActive, currencySymbol, value , handleClick}) => {
  const selectValue = () => {
    handleClick(value);
  }
  return (
    <AmountPlaceholderWrapper
      backgroundColor={isActive ? '#1A1B25' : 'rgba(255, 255, 255, 0.06)'}
      borderRadius="4px"
      padding="12px"
      onClick={selectValue}
      border={isActive ? '1px solid #00ffdd' : '1px solid transparent'}
    >
      <PrimaryTextSpan color="#fffccc" fontSize="12px" fontWeight="bold">
        {currencySymbol} {value}
      </PrimaryTextSpan>
    </AmountPlaceholderWrapper>
  );
};

export default AmountPlaceholder;

const AmountPlaceholderWrapper = styled(FlexContainer)`
  transition: all 0.2s ease;
 
  &:hover {
    cursor: pointer;
    background-color: #1a1b25;
    border-color: #00ffdd;
  }
`;
