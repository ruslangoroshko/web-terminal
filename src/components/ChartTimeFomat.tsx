import React from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../styles/FlexContainer';
import { TimeScaleItem } from './ChartTimeScale';

interface Props {}

function ChartTimeFomat(props: Props) {
  const {} = props;

  return (
    <ChartTimeScaleWrapper padding="2px">
      <TimeScaleItem>%</TimeScaleItem>
      <TimeScaleItem>log</TimeScaleItem>
      <TimeScaleItem isActive={true}>Auto</TimeScaleItem>
    </ChartTimeScaleWrapper>
  );
}

export default ChartTimeFomat;

const ChartTimeScaleWrapper = styled(FlexContainer)`
  border-left: 1px solid #383c3f;
`;
