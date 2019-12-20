import React from 'react';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import Toggle from '../Toggle';
import { css } from '@emotion/core';
import { FlexContainer } from '../../styles/FlexContainer';

interface Props {}

function PnLTypeDropdown(props: Props) {
  const {} = props;

  return (
    <Toggle>
      {({ on, toggle }) => (
        <>
          <DropdownButton isActive={on} onClick={toggle}></DropdownButton>
          {on && <FlexContainer></FlexContainer>}
        </>
      )}
    </Toggle>
  );
}

export default PnLTypeDropdown;

const DropdownButton = styled(ButtonWithoutStyles)<{ isActive?: boolean }>`
  position: absolute;
  top: 50%;
  right: 2px;
  transform: translateY(-50%);
  height: 28px;
  width: 28px;
  background-color: #000000;
  border-radius: 2px 2px 2px 0;

  &:before {
    content: '';
    position: absolute;
    background-color: transparent;
    ${props => props.isActive && OuterBorderRadius}
  }
`;

const OuterBorderRadius = css`
  left: -2px;
  height: 4px;
  width: 2px;
  bottom: 1px;
  border-bottom-right-radius: 2px;
  box-shadow: 0 2px 0 0 #000;
`;
