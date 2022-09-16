import React, { useState, useRef, useEffect } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { useStores } from '../../hooks/useStores';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { Observer } from 'mobx-react-lite';
import ListOfCountries from '../SideBarTabs/ListOfCountries';
import styled from '@emotion/styled';
import { ListForEN } from '../../constants/listOfLanguages';
import { CountriesEnum } from '../../enums/CountriesEnum';
import Colors from '../../constants/Colors';

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
      backgroundColor={Colors.ACCENT}
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
      {on && (mainAppStore.isAuthorized
        ? (
            <FlexContainer position="absolute" bottom={'0'} left="calc(100% + 18px)">
              <ListOfCountries></ListOfCountries>
            </FlexContainer>
          )
        : (
          <FlexContainer position="absolute" right="0" top="100%">
            <ListOfCountries></ListOfCountries>
          </FlexContainer>
        ))
      }
    </LagnButton>
  );
}

export default LanguageButton;

const LagnButton = styled(FlexContainer)`
  &:hover {
    cursor: pointer;
  }
`;
