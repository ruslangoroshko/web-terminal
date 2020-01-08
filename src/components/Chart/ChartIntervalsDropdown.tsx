import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import { PrimaryTextParagraph } from '../../styles/TextsElements';

interface Props {}

function ChartIntervalsDropdown(props: Props) {
  const {} = props;

  return (
    <ChartIntervalsDropdownWrapper>
      {/* <PrimaryTextParagraph
        textTransform="uppercase"
        fontSize="10px"
        color="rgba(255, 255, 255, 0.3)"
        marginBottom="12px"
      >
        seconds
      </PrimaryTextParagraph>
      <PrimaryTextParagraph></PrimaryTextParagraph> */}
       <PrimaryTextParagraph
        textTransform="uppercase"
        fontSize="10px"
        color="rgba(255, 255, 255, 0.3)"
        marginBottom="12px"
      >
        Minutes
      </PrimaryTextParagraph>
      <PrimaryTextParagraph></PrimaryTextParagraph>
    </ChartIntervalsDropdownWrapper>
  );
}

export default ChartIntervalsDropdown;

const ChartIntervalsDropdownWrapper = styled(FlexContainer)`
  flex-direction: column;
  padding: 12px;
  position: relative;
  box-shadow: 0px 4px 8px rgba(41, 42, 57, 0.09),
    0px 8px 16px rgba(37, 38, 54, 0.24);
  backdrop-filter: blur(40px);

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.34);
  }
`;
