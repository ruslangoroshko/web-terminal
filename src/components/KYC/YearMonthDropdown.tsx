import React, { useState, useRef, useEffect } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import { PrimaryTextParagraph } from '../../styles/TextsElements';
import IconShevronDown from '../../assets/svg/icon-shevron-down.svg';
import IconShevronUp from '../../assets/svg/icon-shevron-up.svg';
import SvgIcon from '../SvgIcon';
import moment from 'moment';

interface Props {
  list: string[];
  selected?: string;
  handleSelectValue: (value: string) => void;
  isYear?: boolean;
}

function YearMonthDropdown(props: Props) {
  const { list, selected, handleSelectValue, isYear } = props;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [on, toggle] = useState(false);

  const handleToggle = (e: any) => {
    if (!dropdownRef.current || !dropdownRef.current.contains(e.target)) {
      toggle(!on);
    }
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

  const IconShevron = on ? IconShevronUp : IconShevronDown;
  const selectItem = (value: string) => () => {
    handleSelectValue(value);
  };
  return (
    <FlexContainer
      ref={wrapperRef}
      border="1px solid rgba(255, 255, 255, 0.19)"
      borderRadius="4px"
      alignItems="center"
      onClick={handleToggle}
      height="100%"
      width="100%"
      backgroundColor="rgba(255, 255, 255, 0.06)"
      position="relative"
    >
      <FlexContainer position="absolute" right="14px" top="14px">
        <SvgIcon {...IconShevron} fillColor="rgba(255, 255, 255, 0.6)" />
      </FlexContainer>
      <PrimaryTextParagraph color="#fffccc">{selected}</PrimaryTextParagraph>
      {on && (
        <DropdownWrapper
          ref={dropdownRef}
          flexDirection="column"
          backgroundColor="#292D33"
          padding="8px"
          position="absolute"
          top="100%"
          left="0"
          right="0"
          alignItems="flex-start"
          zIndex="1001"
        >
          {list.map(item => (
            <DroppdownItem
              key={item.valueOf()}
              onClick={selectItem(item)}
              color="#fffccc"
              fontSize="12px"
            >
              {isYear ? item : item}
            </DroppdownItem>
          ))}
        </DropdownWrapper>
      )}
    </FlexContainer>
  );
}

export default YearMonthDropdown;

const DroppdownItem = styled(PrimaryTextParagraph)`
  transition: all 0.2s ease;
  margin-bottom: 8px;

  &:last-of-type {
    margin-bottom: 0;
  }

  &:hover {
    cursor: pointer;
    color: #21b3a4;
  }
`;

const DropdownWrapper = styled(FlexContainer)`
  overflow-y: auto;
  max-height: 300px;

  ::-webkit-scrollbar {
    width: 4px;
    border-radius: 2px;
  }

  ::-webkit-scrollbar-track-piece {
    background-color: transparent;
  }
  ::-webkit-scrollbar-thumb:vertical {
    background-color: rgba(0, 0, 0, 0.6);
  }
`;
