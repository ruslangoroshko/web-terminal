import React, { FC } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import styled from '@emotion/styled';

interface Props {
  isActive: boolean;
  currencySymbol: string;
  value: number;
}

const AmountPlaceholder: FC<Props> = ({ isActive, currencySymbol, value }) => (
  <AmountPlaceholderWrapper
    backgroundColor={isActive ? '#1A1B25' : 'rgba(255, 255, 255, 0.06)'}
    borderRadius="4px"
    border={isActive ? '1px solid #00FFDD' : 'none'}
    padding="12px"
  >
    <PrimaryTextSpan color="#fffccc" fontSize="12px" fontWeight="bold">
      {currencySymbol} {value}
    </PrimaryTextSpan>
  </AmountPlaceholderWrapper>
);

export default AmountPlaceholder;

const AmountPlaceholderWrapper = styled(FlexContainer)`
  transition: all 0.2s ease;
  &:hover {
    background-color: #1a1b25;
    border: 1px solid #00ffdd;
  }
`;