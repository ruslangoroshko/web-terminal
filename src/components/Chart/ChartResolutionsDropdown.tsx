import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import { PrimaryTextParagraph } from '../../styles/TextsElements';
import { supportedResolutions } from '../../constants/supportedTimeScales';

interface Props {}

function ChartResolutionsDropdown(props: Props) {
  const resolutionsShown = [
    supportedResolutions['1 minute'],
    supportedResolutions['1 hour'],
    supportedResolutions['1 day'],
    supportedResolutions['1 month'],
  ];
  return (
    <ChartResolutionsDropdownWrapper>
      {resolutionsShown.map(item => (
        <PrimaryTextParagraph
          textTransform="uppercase"
          fontSize="10px"
          color="rgba(255, 255, 255, 0.3)"
          marginBottom="12px"
        >
          {item}
        </PrimaryTextParagraph>
      ))}
    </ChartResolutionsDropdownWrapper>
  );
}

export default ChartResolutionsDropdown;

const ChartResolutionsDropdownWrapper = styled(FlexContainer)`
  flex-direction: column;
  padding: 12px;
  position: relative;
  box-shadow: 0px 4px 8px rgba(41, 42, 57, 0.09),
    0px 8px 16px rgba(37, 38, 54, 0.24);
  backdrop-filter: blur(40px);
  background-color: rgba(0, 0, 0, 0.34);
`;
