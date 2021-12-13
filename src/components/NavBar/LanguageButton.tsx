import React, { useState, useRef, useEffect } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { useStores } from '../../hooks/useStores';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { Observer } from 'mobx-react-lite';
import ListOfCountries from '../SideBarTabs/ListOfCountries';
import styled from '@emotion/styled';
import { ListForEN } from '../../constants/listOfLanguages';
import { CountriesEnum } from '../../enums/CountriesEnum';

function LanguageButton() {
  const { mainAppStore } = useStores();
  const [on, toggle] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

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
  }, []);

  return (
    <LagnButton
      width="32px"
      height="32px"
      borderRadius="50%"
      backgroundColor="#FFFCCC"
      justifyContent="center"
      alignItems="center"
      position="relative"
      onClick={handleToggle}
      ref={wrapperRef}
    >
      <Observer>
        {() => (
          <PrimaryTextSpan
            fontSize="10px"
            fontWeight="bold"
            color="#1C1F26"
            textTransform="uppercase"
          >
            {ListForEN[mainAppStore.lang]?.shortName ||
              ListForEN[CountriesEnum.EN]?.shortName}
          </PrimaryTextSpan>
        )}
      </Observer>
      {on && (
        <FlexContainer position="absolute" bottom="0" left="calc(100% + 18px)">
          <ListOfCountries></ListOfCountries>
        </FlexContainer>
      )}
    </LagnButton>
  );
}

export default LanguageButton;

const LagnButton = styled(FlexContainer)`
  &:hover {
    cursor: pointer;
  }
`;
