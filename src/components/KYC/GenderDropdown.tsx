import React, { useRef, useEffect, useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { SexEnum } from '../../enums/Sex';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import SvgIcon from '../SvgIcon';
import IconShevron from '../../assets/svg/icon-shevron-down.svg';
import styled from '@emotion/styled';

interface Props {
  selected: SexEnum;
  selectHandler: (sex: SexEnum) => void;
}

function GenderDropdown(props: Props) {
  const { selected, selectHandler } = props;
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [on, toggle] = useState(false);

  const handleClickOutside = (e: any) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      toggle(false);
    }
  };

  const handleToggle = () => {
    toggle(!on);
  };

  const handleChooseSex = (sex: SexEnum) => () => {
    selectHandler(sex);
    toggle(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <FlexContainer
      flexDirection="column"
      position="relative"
      ref={wrapperRef}
      width="100%"
    >
      <GenderContainer
        isActive={on}
        flexDirection="column"
        onClick={handleToggle}
      >
        <PrimaryTextSpan marginBottom="8px" color="rgba(255, 255, 255, 0.4)">
          Gender
        </PrimaryTextSpan>
        <FlexContainer justifyContent="space-between" alignItems="center">
          <PrimaryTextSpan marginBottom="4px">
            {SexEnum[selected]}
          </PrimaryTextSpan>
          <SvgIcon
            {...IconShevron}
            fillColor="rgba(255, 255, 255, 0.6)"
            width="6px"
            height="4px"
          />
        </FlexContainer>
      </GenderContainer>
      {on && (
        <FlexContainer
          position="absolute"
          top="100%"
          left="0"
          right="0"
          backgroundColor="#1C2026"
          flexDirection="column"
          padding="16px"
          zIndex="101"
        >
          <GenderItem onClick={handleChooseSex(SexEnum.Male)}>
            <PrimaryTextSpan color="#fffccc" fontSize="12px">
              {SexEnum[SexEnum.Male]}
            </PrimaryTextSpan>
          </GenderItem>
          <GenderItem onClick={handleChooseSex(SexEnum.Female)}>
            <PrimaryTextSpan color="#fffccc" fontSize="12px">
              {SexEnum[SexEnum.Female]}
            </PrimaryTextSpan>
          </GenderItem>
          <GenderItem onClick={handleChooseSex(SexEnum.Unknown)}>
            <PrimaryTextSpan color="#fffccc" fontSize="12px">
              {SexEnum[SexEnum.Unknown]}
            </PrimaryTextSpan>
          </GenderItem>
        </FlexContainer>
      )}
    </FlexContainer>
  );
}

export default GenderDropdown;

const GenderContainer = styled(FlexContainer)<{ isActive: boolean }>`
  border-bottom: 1px solid
    ${props => (props.isActive ? 'rgba(255, 255, 255, 0.2)' : '#21B3A4')};
`;

const GenderItem = styled(ButtonWithoutStyles)`
  margin-bottom: 16px;
  text-align: left;

  &:last-of-type {
    margin-bottom: 0;
  }

  &:hover {
    > span {
      transition: all 0.2s ease;
      color: #21b3a4;
    }
  }
`;
