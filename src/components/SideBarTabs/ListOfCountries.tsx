import React, { useEffect, useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { useStores } from '../../hooks/useStores';
import { CountriesEnum } from '../../enums/CountriesEnum';
import {
  ListForEN,
  ListForPL,
  ListForES,
  ListForDE,
  ListForRU,
} from '../../constants/listOfLanguages';
import { ObjectKeys } from '../../helpers/objectKeys';
import styled from '@emotion/styled';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { observer } from 'mobx-react-lite';
import { SideBarTabType } from '../../enums/SideBarTabType';

const ListOfCountries = observer(() => {
  const { mainAppStore, educationStore, tabsStore } = useStores();
  const [list, setList] = useState(ListForEN);

  const changeCountry = (newLang: CountriesEnum) => () => {
    educationStore.setQuestionsList(null);
    educationStore.setShowPopup(false);
    educationStore.setActiveCourse(null);
    educationStore.setActiveQuestion(null);
    educationStore.setCoursesList(null);
    educationStore.setEducationIsLoaded(false);
    mainAppStore.setLanguage(newLang);
    if (tabsStore.sideBarTabType === SideBarTabType.Education) {
      tabsStore.setSideBarType(null);
      tabsStore.setTabExpanded(false);
    }
  };

  useEffect(() => {
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
      // case CountriesEnum.DE:
      //   setList(ListForDE);
      //   break;
      // case CountriesEnum.RU:
      //   setList(ListForRU);
      //   break;
      default:
        break;
    }
  }, []);


  return (
    <FlexContainer
      backgroundColor="#1C1F26"
      borderRadius="4px"
      padding="20px"
      flexDirection="column"
      width="200px"
    >
      {ObjectKeys(list).sort().map((key) => (
        <CountryListItemWrapper key={key}>
          <ButtonItem
            onClick={changeCountry(key)}
            disabled={key === mainAppStore.lang}
            isActive={key === mainAppStore.lang}
          >
            <CountryListItem>
              {list[key].originName} ({list[key].name})
            </CountryListItem>
          </ButtonItem>
        </CountryListItemWrapper>
      ))}
    </FlexContainer>
  );
});

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
  font-size: 13px;

  &:hover {
    color: #fffccc;
  }
`;

const ButtonItem = styled(ButtonWithoutStyles)<{ isActive: boolean }>`
  > span {
    color: ${(props) => props.isActive && '#fffccc'};
  }
`;
