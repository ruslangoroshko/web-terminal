import React, { useRef, useEffect, useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { SexEnum } from '../../enums/Sex';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import SvgIcon from '../SvgIcon';
import IconShevron from '../../assets/svg/icon-shevron-down.svg';

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
    <FlexContainer position="relative" ref={wrapperRef} width="100%">
      <FlexContainer flexDirection="column" onClick={handleToggle}>
        <PrimaryTextSpan marginBottom="8px" color="rgba(255, 255, 255, 0.4)">
          Gender
        </PrimaryTextSpan>
        <FlexContainer justifyContent="space-between">
          <PrimaryTextSpan>{SexEnum[selected]}</PrimaryTextSpan>
          <SvgIcon {...IconShevron} fillColor="rgba(255, 255, 255, 0.6)" />
        </FlexContainer>
      </FlexContainer>
      {on && (
        <FlexContainer
          position="absolute"
          top="100%"
          left="0"
          right="0"
          backgroundColor="#1C2026"
        >
          <ButtonWithoutStyles onClick={handleChooseSex(SexEnum.Male)}>
            {SexEnum[SexEnum.Male]}
          </ButtonWithoutStyles>
          <ButtonWithoutStyles onClick={handleChooseSex(SexEnum.Female)}>
            {SexEnum[SexEnum.Female]}
          </ButtonWithoutStyles>
          <ButtonWithoutStyles onClick={handleChooseSex(SexEnum.Unknown)}>
            {SexEnum[SexEnum.Unknown]}
          </ButtonWithoutStyles>
        </FlexContainer>
      )}
    </FlexContainer>
  );
}

export default GenderDropdown;
