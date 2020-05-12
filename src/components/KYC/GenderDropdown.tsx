import React, { useRef, useEffect, useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { SexEnum } from '../../enums/Sex';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import SvgIcon from '../SvgIcon';
import IconShevron from '../../assets/svg/icon-shevron-down.svg';
import styled from '@emotion/styled';

interface Props {
  hasError?: boolean;
  errorText?: string;
  selected?: SexEnum;
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
        hasError={props.hasError || false}
      >
        <Label
          isSelect={!isNaN(Number(selected))}

        >Gender</Label>
        <FlexContainer
          justifyContent="space-between"
          alignItems="center"
          minHeight="21px"
        >
          <PrimaryTextSpan marginBottom="4px">
            {/* TODO change this kostyl */}
            {!isNaN(Number(selected)) && SexEnum[Number(selected)]}
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

const GenderContainer = styled(FlexContainer)<{ isActive: boolean, hasError: boolean }>`
  padding-top: 23px;
  border-bottom: 1px solid
    ${props => (props.isActive ? '#21B3A4' : 'rgba(255, 255, 255, 0.2)')};
  border-bottom: ${props => props.hasError && '1px solid #ED145B !important'};
  transition: border 0.2s ease;
  cursor: pointer;

  &:hover {
    border-bottom: 1px solid rgba(255, 255, 255, 0.4);
    & > span {
      color: rgba(255, 255, 255, 0.6);
    }
  }
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

const Label = styled(PrimaryTextSpan)<{ isSelect: boolean }>`
  position: absolute;
  bottom: 0px;
  transform: ${({isSelect}) => isSelect ? 'translateY(-30px)' : 'translateY(-4px)' };
  transition: transform 0.2s ease, font-size 0.2s ease, color 0.2s ease;
  font-size: ${({isSelect}) => isSelect ? '11px' : '14px' };
  color: rgba(255, 255, 255, 0.4);
  text-transform: ${({isSelect}) => isSelect ? 'uppercase' : 'none' };

  
`;
