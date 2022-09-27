import styled from '@emotion/styled';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Colors from '../constants/Colors';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { FlexContainer } from '../styles/FlexContainer';
import SvgIcon from './SvgIcon';
import IconShevron from '../assets/svg/icon-shevron-down.svg';
import AddInstrumentsPopup from './AddInstrumentsPopup';
import { useStores } from '../hooks/useStores';
import { observer, Observer } from 'mobx-react-lite';
import { PrimaryTextSpan } from '../styles/TextsElements';
import ImageContainer from './ImageContainer';
import { InstrumentModelWSDTO } from '../types/InstrumentsTypes';

type Props = {
  onSelectInstrument: (instrument: InstrumentModelWSDTO) => void;
  activeInstrument: InstrumentModelWSDTO | null;
};

const AssetSelectorInput = ({
  onSelectInstrument,
  activeInstrument,
}: Props) => {
  console.log(JSON.parse(JSON.stringify(activeInstrument)));
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { instrumentsStore } = useStores();

  const [showList, setShowList] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  const [searchValue, setSearchValue] = useState('');

  const onInputFocus = () => {
    if (activeInstrument) {
      setSearchValue(`${activeInstrument.base}/${activeInstrument.quote}`);
    }
    setIsFocus(true);
    setShowList(true);
  };

  const onInputBlur = () => {
    setSearchValue('');
    setIsFocus(false);
  };

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.trim().toLowerCase();
    instrumentsStore.setFilteredInstrumentsSearch(
      instrumentsStore.instruments
        .filter(
          (item) =>
            !searchValue ||
            item.instrumentItem.id.toLowerCase().includes(searchValue) ||
            item.instrumentItem.base.toLowerCase().includes(searchValue) ||
            item.instrumentItem.name.toLowerCase().includes(searchValue) ||
            item.instrumentItem.quote.toLowerCase().includes(searchValue)
        )
        .map((item) => item.instrumentItem)
    );
    setSearchValue(e.target.value);
  };

  const handleSelectInstrument = (instrument: InstrumentModelWSDTO) => () => {
    onSelectInstrument(instrument);
    setShowList(false);
  };

  const handleClickOutside = useCallback(
    (e: any) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setSearchValue('');
        setShowList(false);
      }
    },
    [activeInstrument]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    instrumentsStore.setFilteredInstrumentsSearch(
      [...instrumentsStore.instruments]
        .sort((a, b) => a.instrumentItem.weight - b.instrumentItem.weight)
        .map((item) => item.instrumentItem)
    );
  }, []);
  console.log(isFocus);

  return (
    <>
      {activeInstrument ? (
        <FlexContainer position="relative" ref={wrapperRef}>
          <SearachInputWrap width="100%" position="relative">
            <FlexContainer
              width="22px"
              height="22px"
              position="absolute"
              left="6px"
              top="6px"
            >
              <ImageContainer instrumentId={activeInstrument.id} />
            </FlexContainer>
            <Input
              value={
                isFocus
                  ? searchValue
                  : `${activeInstrument?.base}/${activeInstrument?.quote}`
              }
              onFocus={onInputFocus}
              onBlur={onInputBlur}
              onChange={handleChangeSearch}
            />

            <SvgIcon
              {...IconShevron}
              fillColor={Colors.WHITE_DARK}
              width={6}
              height={4}
            />
          </SearachInputWrap>

          {showList && (
            <InstrumentsWrapper
              position="absolute"
              flexDirection="column"
              left="0"
              top="calc(100% + 8px)"
              right="0"
              zIndex="2"
              maxHeight="300px"
            >
              <Observer>
                {() => (
                  <>
                    {instrumentsStore.filteredInstrumentsSearch.map((instr) => (
                      <SelectInstrumentBtn
                        key={instr.id}
                        onClick={handleSelectInstrument(instr)}
                      >
                        <FlexContainer
                          width="32px"
                          height="32px"
                          margin="0 8px 0 0"
                        >
                          <ImageContainer instrumentId={instr.id} />
                        </FlexContainer>
                        <FlexContainer
                          flexDirection="column"
                          width="110px"
                          marginRight="4px"
                          alignItems="flex-start"
                        >
                          <PrimaryTextSpan
                            fontSize="12px"
                            color={Colors.ACCENT}
                            marginBottom="4px"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                          >
                            {instr.name}
                          </PrimaryTextSpan>
                          <PrimaryTextSpan
                            fontSize="10px"
                            color={Colors.WHITE_LIGHT}
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                          >
                            {instr.base}/{instr.quote}
                          </PrimaryTextSpan>
                        </FlexContainer>
                      </SelectInstrumentBtn>
                    ))}
                  </>
                )}
              </Observer>
            </InstrumentsWrapper>
          )}
        </FlexContainer>
      ) : null}
    </>
  );
};

export default AssetSelectorInput;

const SearachInputWrap = styled(FlexContainer)`
  svg {
    position: absolute;
    top: 50%;
    right: 12px;
  }
`;

const Input = styled.input`
  background-color: transparent;
  border: none;
  outline: none;
  width: 100%;
  height: 100%;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  padding: 8px 0 8px 8px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${Colors.WHITE};
  background-color: rgba(255, 255, 255, 0.06);
  padding-left: 36px;

  &:-webkit-input-placeholder {
    color: ${Colors.WHITE};
    opacity: 0.3;
    font-weight: normal;
  }

  &:-ms-input-placeholder {
    color: ${Colors.WHITE};
    opacity: 0.3;
    font-weight: normal;
  }

  &::placeholder {
    color: ${Colors.WHITE};
    opacity: 0.3;
    font-weight: normal;
  }
`;

const SelectInstrumentBtn = styled(ButtonWithoutStyles)`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;

  transition: all 0.4s ease;
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  &:not(:last-of-type) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.16);
  }
`;

const InstrumentsWrapper = styled(FlexContainer)`
  background-color: #1c2026;
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
