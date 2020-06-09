import React, { FC, ChangeEvent, useState, useEffect, useRef } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import IconSearch from '../assets/svg/icon-instrument-search.svg';
import IconClose from '../assets/svg/icon-close.svg';
import SvgIcon from './SvgIcon';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { useStores } from '../hooks/useStores';
import { Observer } from 'mobx-react-lite';
import InstrumentMarkets from './SideBarTabs/InstrumentMarkets';

interface Props {
  toggle: () => void;
}

const AddInstrumentsPopup: FC<Props> = props => {
  const { toggle } = props;
  const { instrumentsStore } = useStores();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isLeft, setIsLeft] = useState(true);

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.trim().toLowerCase();
    instrumentsStore.filteredInstrumentsSearch = instrumentsStore.instruments
      .filter(
        item =>
          !searchValue ||
          item.instrumentItem.id.toLowerCase().includes(searchValue) ||
          item.instrumentItem.base.toLowerCase().includes(searchValue) || 
          item.instrumentItem.name.toLowerCase().includes(searchValue) ||
          item.instrumentItem.quote.toLowerCase().includes(searchValue)
      )
      .map(item => item.instrumentItem);
  };

  useEffect(() => {
    instrumentsStore.filteredInstrumentsSearch = instrumentsStore.instruments.map(
      item => item.instrumentItem
    );

    const rect = wrapperRef.current?.getBoundingClientRect();
    // TODO: improve calclulation logic, make more universal method
    // detect if menu goes beneath the edge of screen
    if (rect && window.innerWidth - rect.right - 320 <= 0) {
      setIsLeft(false);
    }
  }, []);

  const handleClickOutside = (e: any) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      toggle();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <AddInstrumentsPopupWrapper
      width="320px"
      position="absolute"
      alignItems="center"
      flexDirection="column"
      top="0"
      left={isLeft ? '0' : 'auto'}
      right={isLeft ? 'auto' : '0'}
      zIndex="105"
      ref={wrapperRef}
    >
      <FlexContainer
        padding="12px 12px 0 20px"
        margin="0 0 12px 0"
        width="100%"
      >
        <FlexContainer margin="0 6px 0 0">
          <SvgIcon
            {...IconSearch}
            fillColor="rgba(255, 255, 255, 0.5)"
          ></SvgIcon>
        </FlexContainer>
        <SearchInput onChange={handleChangeSearch} placeholder="Search" />
        <FlexContainer>
          <ButtonWithoutStyles onClick={toggle}>
            <SvgIcon
              {...IconClose}
              fillColor="rgba(255, 255, 255, 0.8)"
              hoverFillColor="#00FFDD"
            ></SvgIcon>
          </ButtonWithoutStyles>
        </FlexContainer>
      </FlexContainer>
      <InstrumentsWrapper flexDirection="column" width="100%" height="320px">
        <Observer>
          {() => (
            <>
              {instrumentsStore.filteredInstrumentsSearch.map(instrument => (
                <InstrumentMarkets
                  instrument={instrument}
                  key={instrument.id}
                  toggle={toggle}
                ></InstrumentMarkets>
              ))}
            </>
          )}
        </Observer>
      </InstrumentsWrapper>
    </AddInstrumentsPopupWrapper>
  );
};

export default AddInstrumentsPopup;

const AddInstrumentsPopupWrapper = styled(FlexContainer)`
  box-shadow: 0px 4px 8px rgba(41, 42, 57, 0.09),
    0px 8px 16px rgba(37, 38, 54, 0.24);
  border-radius: 2px;
  background-color: rgba(0, 0, 0, 0.64);

  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(12px);
  }
`;

const InstrumentsWrapper = styled(FlexContainer)`
  overflow-y: auto;
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

const SearchInput = styled.input`
  outline: none;
  background-color: transparent;
  border: none;
  height: 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  margin-right: 4px;
  width: 100%;
  color: #fffccc;
  font-size: 12px;
  line-height: 14px;
  padding-bottom: 4px;
  transition: border-bottom 0.2s ease;
  will-change: border-bottom;

  &:focus {
    content: '';
    border-bottom: 1px solid #21b3a4;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
    font-weight: normal;
  }
`;
