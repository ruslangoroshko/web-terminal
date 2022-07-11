import React, { useState, useRef, useEffect } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import { PrimaryTextParagraph } from '../../styles/TextsElements';
import IconShevronDown from '../../assets/svg/icon-shevron-down.svg';
import IconShevronUp from '../../assets/svg/icon-shevron-up.svg';
import SvgIcon from '../SvgIcon';
import Colors from '../../constants/Colors';

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
    toggle(false);
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
      padding="0 12px"
    >
      <FlexContainer position="absolute" right="14px" top="14px">
        <SvgIcon
          {...IconShevron}
          fillColor={Colors.WHITE_DARK}
          width="6px"
          height="4px"
        />
      </FlexContainer>
      <PrimaryTextParagraph fontSize="12px" color={Colors.ACCENT}>
        {selected}
      </PrimaryTextParagraph>
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
              color={Colors.ACCENT}
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
  will-change: color;

  &:last-of-type {
    margin-bottom: 0;
  }

  &:hover {
    cursor: pointer;
    color: ${Colors.PRIMARY_LIGHT};
  }
`;

const DropdownWrapper = styled(FlexContainer)`
  overflow-y: auto;
  max-height: 200px;

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
