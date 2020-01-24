import React, { useRef, useState, useEffect } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { sortByDropdownValues } from '../constants/sortByDropdownValues';
import { SortByDropdownEnum } from '../enums/SortByDropdown';
import { useStores } from '../hooks/useStores';
import { Observer } from 'mobx-react-lite';
import SvgIcon from './SvgIcon';
import IconShevronDown from '../assets/svg/icon-shevron-down-sort-by.svg';

interface Props {}

function SortByDropdown(props: Props) {
  const {} = props;
  const { quotesStore } = useStores();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [on, toggle] = useState(false);

  const handleChangeSorting = (sortType: SortByDropdownEnum) => () => {
    quotesStore.sortBy = sortType;
    toggle(false);
  };

  const handleToggle = () => {
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
  });

  return (
    <FlexContainer position="relative">
      <Observer>
        {() => (
          <ButtonDropdown onClick={handleToggle}>
            <PrimaryTextSpan
              fontSize="10px"
              color={on ? '#00FFDD' : '#fffccc'}
              textTransform="uppercase"
              marginRight="4px"
            >
              {sortByDropdownValues[quotesStore.sortBy]}
            </PrimaryTextSpan>
            <SvgIcon
              {...IconShevronDown}
              fillColor={on ? '#00FFDD' : '#fffccc'}
              transformProp={on ? 'rotate(0)' : 'rotate(180deg)'}
            />
          </ButtonDropdown>
        )}
      </Observer>
      {on && (
        <DropdownWrapper
          ref={wrapperRef}
          flexDirection="column"
          alignItems="flex-start"
          padding="16px"
          position="absolute"
          top="100%"
          left="-14px"
          width="172px"
        >
          {((Object.keys(sortByDropdownValues) as unknown) as Array<
            keyof typeof sortByDropdownValues
          >).map(key => (
            <DropdownItemText
              color="#fffccc"
              fontSize="12px"
              key={key}
              onClick={handleChangeSorting(key)}
              marginBottom="16px"
              whiteSpace="nowrap"
            >
              {sortByDropdownValues[key]}
            </DropdownItemText>
          ))}
        </DropdownWrapper>
      )}
    </FlexContainer>
  );
}

export default SortByDropdown;

const DropdownWrapper = styled(FlexContainer)`
  background-color: #1c2026;
  box-shadow: 0px 4px 8px rgba(41, 42, 57, 0.24),
    0px 8px 16px rgba(37, 38, 54, 0.6);
  border-radius: 4px;
`;

const DropdownItemText = styled(PrimaryTextSpan)`
  transition: color 0.2s ease;
  &:hover {
    cursor: pointer;
    color: #00ffdd;
  }
`;

const ButtonDropdown = styled(ButtonWithoutStyles)`
  display: flex;
  align-items: center;
`;
