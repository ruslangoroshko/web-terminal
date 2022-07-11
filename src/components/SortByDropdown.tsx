import React, { useRef, useEffect, FC } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { Observer } from 'mobx-react-lite';
import SvgIcon from './SvgIcon';
import IconShevronDown from '../assets/svg/icon-shevron-down-sort-by.svg';
import Colors from '../constants/Colors';

interface Props {
  selectedLabel: string;
  toggle: (flag: boolean) => void;
  opened: boolean;
}

const SortByDropdown: FC<Props> = ({
  selectedLabel,
  children,
  toggle,
  opened,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: any) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      toggle(false);
    }
  };

  const handleToggle = () => {
    toggle(!opened);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <FlexContainer position="relative" ref={wrapperRef}>
      <Observer>
        {() => (
          <ButtonDropdown onClick={handleToggle}>
            <PrimaryTextSpan
              fontSize="10px"
              color={opened ? Colors.PRIMARY : Colors.ACCENT}
              textTransform="uppercase"
              marginRight="4px"
            >
              {selectedLabel || 'Select one'}
            </PrimaryTextSpan>
            <SvgIcon
              {...IconShevronDown}
              fillColor={opened ? Colors.PRIMARY : Colors.ACCENT}
              transformProp={opened ? 'rotate(0)' : 'rotate(180deg)'}
            />
          </ButtonDropdown>
        )}
      </Observer>
      {opened && (
        <DropdownWrapper
          flexDirection="column"
          alignItems="flex-start"
          padding="16px"
          position="absolute"
          top="calc(100% + 6px)"
          left="-14px"
          zIndex="201"
        >
          {children}
        </DropdownWrapper>
      )}
    </FlexContainer>
  );
};

export default SortByDropdown;

const DropdownWrapper = styled(FlexContainer)`
  background-color: #1c2026;
  box-shadow: 0px 4px 8px rgba(41, 42, 57, 0.24),
    0px 8px 16px rgba(37, 38, 54, 0.6);
  border-radius: 4px;
  min-width: 170px;
`;

const ButtonDropdown = styled(ButtonWithoutStyles)`
  display: flex;
  align-items: center;
`;
