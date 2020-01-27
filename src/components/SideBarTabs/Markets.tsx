import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';

interface Props {}

function Markets(props: Props) {
  const {} = props;

  return (
    <FlexContainer flexDirection="column">
      <MarketButtonsWrapper padding="0 16px">
          
      </MarketButtonsWrapper>
    </FlexContainer>
  );
}

export default Markets;

const MarketButtonsWrapper = styled(FlexContainer)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
`;

const MarketButton = styled(ButtonWithoutStyles)<{ isActive?: boolean }>`
  background: ${props =>
    props.isActive &&
    `radial-gradient(
      50.44% 50% at 50.67% 100%,
      rgba(0, 255, 221, 0.08) 0%,
      rgba(0, 255, 221, 0) 100%
    ),
    rgba(255, 255, 255, 0.08)`};
  box-shadow: inset 0px -1px 0px #00ffdd;
`;
