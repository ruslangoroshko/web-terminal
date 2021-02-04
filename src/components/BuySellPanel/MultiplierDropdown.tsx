import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';

interface Props {
  multipliers: number[];
  selectedMultiplier: number;
  setMultiplier: (value: number) => void;
  onToggle: (arg0: boolean) => void;
}

function MultiplierDropdown(props: Props) {
  const {
    multipliers,
    selectedMultiplier,
    setMultiplier: setFieldValue,
    onToggle,
  } = props;
  const [on, toggle] = useState(false);
  const handleChangeMultiplier = (multiplier: number) => () => {
    setFieldValue(multiplier);
    toggle(false);
  };

  const wrapperRef = useRef<HTMLDivElement>(null);
  const handleToggle = () => {
    onToggle(!on);
    toggle(!on);
  };
  const handleClickOutside = (e: any) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      toggle(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <FlexContainer position="relative" margin="0 0 14px 0" ref={wrapperRef}>
      <MultiplierButton isActive={on} onClick={handleToggle} type="button">
        <PrimaryTextSpan fontWeight="bold" color="#fffccc">
          &times;{selectedMultiplier}
        </PrimaryTextSpan>
      </MultiplierButton>
      {on && (
        <MultiplierDropdownWrapper
          backgroundColor="rgba(0, 0, 0, 0.4)"
          flexDirection="column"
          position="absolute"
          top="0"
          right="calc(100% + 8px)"
          width="140px"
        >
          {multipliers
            .slice()
            .sort((a, b) => b - a)
            .map((multiplier) => (
              <DropDownItem
                key={multiplier}
                alignItems="center"
                flexDirection="column"
                onClick={handleChangeMultiplier(multiplier)}
                padding="12px 16px"
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
  );
}

export default MultiplierDropdown;

const MultiplierDropdownWrapper = styled(FlexContainer)`
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.25),
    0px 6px 12px rgba(0, 0, 0, 0.25);
  background-color: rgba(0, 0, 0, 1);
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

    & > span {
      color: #00ffdd;
    }
  }
`;

const MultiplierButton = styled(ButtonWithoutStyles)<{ isActive: boolean }>`
  border: ${(props) =>
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
  background-color: ${(props) =>
    props.isActive ? 'transparent' : 'rgba(255, 255, 255, 0.06)'};
`;
