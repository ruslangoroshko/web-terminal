import React from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import Toggle from '../Toggle';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import Fields from '../../constants/fields';

interface Props {
  multipliers: number[];
  selectedMultiplier: number;
  setFieldValue: (arg0: any, arg1: any) => void;
}

function MultiplierDropdown(props: Props) {
  const { multipliers, selectedMultiplier, setFieldValue } = props;
  const handleChangeMultiplier = (
    multiplier: number,
    toggle: () => void
  ) => () => {
    setFieldValue(Fields.MULTIPLIER, multiplier);
    toggle();
  };
  return (
    <Toggle>
      {({ on, toggle }) => (
        <FlexContainer position="relative" margin="0 0 14px 0">
          <MultiplierButton isActive={on} onClick={toggle} type="button">
            <PrimaryTextSpan fontWeight="bold" color="#fffccc">
              &times;{selectedMultiplier}
            </PrimaryTextSpan>
          </MultiplierButton>
          {on && (
            <MultiplierDropdownWrapper
              backgroundColor="rgba(0, 0, 0, 0.4)"
              flexDirection="column"
              padding="12px 0"
              position="absolute"
              top="0"
              right="calc(100% + 8px)"
              width="140px"
            >
              {multipliers.map(multiplier => (
                <DropDownItem
                  key={multiplier}
                  justifyContent="center"
                  alignItems="center"
                  onClick={handleChangeMultiplier(multiplier, toggle)}
                >
                  <PrimaryTextSpan
                    fontSize="16px"
                    fontWeight="bold"
                    color="#fffccc"
                  >
                    &times;{multiplier}
                  </PrimaryTextSpan>
                </DropDownItem>
              ))}
            </MultiplierDropdownWrapper>
          )}
        </FlexContainer>
      )}
    </Toggle>
  );
}

export default MultiplierDropdown;

const MultiplierDropdownWrapper = styled(FlexContainer)`
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.25),
    0px 6px 12px rgba(0, 0, 0, 0.25);
  background-color: rgba(0, 0, 0, 0.8);
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(0, 0, 0, 0.34);
    backdrop-filter: blur(12px);
  }

  border-radius: 4px;
`;

const DropDownItem = styled(FlexContainer)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  &:last-of-type {
    border-bottom: none;
  }
  &:hover {
    cursor: pointer;
  }
`;

const MultiplierButton = styled(ButtonWithoutStyles)<{ isActive: boolean }>`
  border: ${props =>
    props.isActive
      ? '1px solid #21B3A4'
      : '1px solid rgba(255, 255, 255, 0.1)'};
  box-sizing: border-box;
  border-radius: 4px;
  position: relative;
  width: 100%;
  height: 40px;
  text-align: left;
  padding: 8px 4px;
  background-color: ${props =>
    props.isActive ? 'transparent' : 'rgba(255, 255, 255, 0.06)'};
`;
