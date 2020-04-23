import React, { useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextParagraph } from '../../styles/TextsElements';
import styled from '@emotion/styled';
import AmountPlaceholder from './AmountPlaceholder';

const VisaMasterCardForm = () => {
  const [value, setValue] = useState(1);

  const placeholderValues = [50, 100, 250, 500, 1000];

  return (
    <FlexContainer flexDirection="column" padding="50px 0 0 0">
      <PrimaryTextParagraph
        textTransform="uppercase"
        fontSize="11px"
        color="rgba(255,255,255,0.3)"
        marginBottom="6px"
      >
        Amount
      </PrimaryTextParagraph>
      <FlexContainer >input</FlexContainer>
      <GridDiv>
        {placeholderValues.map(item => (
          <AmountPlaceholder
            key={item}
            isActive={item === value}
            value={item}
            currencySymbol="$"
            handleClick={setValue}
          />
        ))}
      </GridDiv>
    </FlexContainer>
  );
};

export default VisaMasterCardForm;

const GridDiv = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  margin-bottom: 30px;
`;

