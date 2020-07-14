import React, { useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { useStores } from '../../hooks/useStores';
import { CountriesEnum } from '../../enums/CountriesEnum';
import {
  ListForEN,
  ListForPL,
  ListForES,
} from '../../constants/listOfLanguages';
import { ObjectKeys } from '../../helpers/objectKeys';
import styled from '@emotion/styled';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';

const ListOfCountries = () => {
  const { mainAppStore } = useStores();
  const [list, setList] = useState(ListForEN);
  switch (mainAppStore.lang) {
    case CountriesEnum.EN:
      setList(ListForEN);
      break;
    case CountriesEnum.PL:
      setList(ListForPL);
      break;
    case CountriesEnum.ES:
      setList(ListForES);
      break;
    default:
      break;
  }

  const changeCountry = (newLang: CountriesEnum) => () => {
    mainAppStore.setLanguage(newLang);
  };

  return (
    <FlexContainer
      backgroundColor="#1C1F26"
      borderRadius="4px"
      padding="20px"
      flexDirection="column"
      width="200px"
    >
      {ObjectKeys(list).map(key => (
        <CountryListItemWrapper key={key}>
          <ButtonWithoutStyles onClick={changeCountry(key)}>
            <CountryListItem>
              {list[key].name} {list[key].originName}
            </CountryListItem>
          </ButtonWithoutStyles>
        </CountryListItemWrapper>
      ))}
    </FlexContainer>
  );
};

export default ListOfCountries;

const CountryListItemWrapper = styled(FlexContainer)`
  margin-bottom: 16px;
  &:last-of-type {
    margin-bottom: 0;
  }
`;

const CountryListItem = styled(PrimaryTextSpan)`
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.5);
  &:hover > span {
    color: #fffccc;
  }
`;