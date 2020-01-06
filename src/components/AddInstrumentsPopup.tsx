import React, { FC, ChangeEvent, useState, useEffect } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import IconSearch from '../assets/svg/icon-instrument-search.svg';
import IconClose from '../assets/svg/icon-instrument-close.svg';
import IconMarketsTop from '../assets/svg/icon-instrument-markets-top.svg';
import IconMarketsFiat from '../assets/svg/icon-instrument-markets-fiat.svg';
import IconMarketsStocks from '../assets/svg/icon-instrument-markets-stocks.svg';
import IconMarketsCrypto from '../assets/svg/icon-instrument-markets-crypto.svg';
import SvgIcon from './SvgIcon';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { PrimaryTextSpan } from '../styles/TextsElements';
import InstrumentRow from './InstrumentRow';
import { useStores } from '../hooks/useStores';
import { Observer } from 'mobx-react-lite';

interface Props {
  toggle: () => void;
}

const AddInstrumentsPopup: FC<Props> = props => {
  const { toggle } = props;
  const { instrumentsStore } = useStores();

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    instrumentsStore.filteredInstrumentsSearch = instrumentsStore.instruments.filter(
      item => !searchValue || item.id.toLowerCase().includes(searchValue)
    );
  };
  useEffect(() => {
    instrumentsStore.filteredInstrumentsSearch = instrumentsStore.instruments;
  }, []);

  return (
    <AddInstrumentsPopupWrapper
      width="320px"
      position="absolute"
      alignItems="center"
      flexDirection="column"
      top="0"
      left="0"
      zIndex="105"
    >
      <FlexContainer
        padding="12px 12px 0 20px"
        margin="0 0 20px 0"
        width="100%"
      >
        <FlexContainer margin="0 6px 0 0">
          <SvgIcon {...IconSearch} fill="rgba(255, 255, 255, 0.5)"></SvgIcon>
        </FlexContainer>
        <SearchInput onChange={handleChangeSearch} />
        <FlexContainer>
          <ButtonWithoutStyles onClick={toggle}>
            <SvgIcon {...IconClose} fill="rgba(255, 255, 255, 0.5)"></SvgIcon>
          </ButtonWithoutStyles>
        </FlexContainer>
      </FlexContainer>
      <FlexContainer margin="0 0 8px 0">
        <FlexContainer margin="0 20px 0 0">
          <FlexContainer margin="0 4px 0 0">
            <SvgIcon {...IconMarketsTop} fill="#fff" />
          </FlexContainer>
          <PrimaryTextSpan fontSize="12px" lineHeight="14px" color="#fff">
            Top
          </PrimaryTextSpan>
        </FlexContainer>
        <FlexContainer margin="0 20px 0 0">
          <FlexContainer margin="0 4px 0 0">
            <SvgIcon {...IconMarketsStocks} fill="#fff" />
          </FlexContainer>
          <PrimaryTextSpan fontSize="12px" lineHeight="14px" color="#fff">
            Stocks
          </PrimaryTextSpan>
        </FlexContainer>
        <FlexContainer margin="0 20px 0 0">
          <FlexContainer margin="0 4px 0 0">
            <SvgIcon {...IconMarketsFiat} fill="#fff" />
          </FlexContainer>
          <PrimaryTextSpan fontSize="12px" lineHeight="14px" color="#fff">
            Fiat
          </PrimaryTextSpan>
        </FlexContainer>
        <FlexContainer>
          <FlexContainer margin="0 4px 0 0">
            <SvgIcon {...IconMarketsCrypto} fill="#fff" />
          </FlexContainer>
          <PrimaryTextSpan fontSize="12px" lineHeight="14px" color="#fff">
            Crypto
          </PrimaryTextSpan>
        </FlexContainer>
      </FlexContainer>
      <FlexContainer padding="16px" flexDirection="column" width="100%" height="320px">
        <Observer>
          {() => (
            <>
              {instrumentsStore.filteredInstrumentsSearch.map(instrument => (
                <InstrumentRow
                  key={instrument.id}
                  instrument={instrument}
                ></InstrumentRow>
              ))}
            </>
          )}
        </Observer>
      </FlexContainer>
    </AddInstrumentsPopupWrapper>
  );
};

export default AddInstrumentsPopup;

const AddInstrumentsPopupWrapper = styled(FlexContainer)`
  box-shadow: 0px 4px 8px rgba(41, 42, 57, 0.09),
    0px 8px 16px rgba(37, 38, 54, 0.24);
  backdrop-filter: blur(12px);
  border-radius: 2px;

  &:before {
    content: '';
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.34);
  }
`;

const SearchInput = styled.input`
  outline: none;
  background-color: transparent;
  border: none;
  height: 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  margin-right: 2px;
  width: 100%;
  color: #fffccc;
  font-size: 12px;
  line-height: 14px;
  transition: border-bottom 0.2s ease;

  &:focus {
    content: '';
    border-bottom: 1px solid #21b3a4;
  }
`;
