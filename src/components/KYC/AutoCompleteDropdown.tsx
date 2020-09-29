import React, { FC, ChangeEvent, useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import {
  PrimaryTextSpan,
  PrimaryTextParagraph,
} from '../../styles/TextsElements';
import { FlexContainer } from '../../styles/FlexContainer';
import { Country } from '../../types/CountriesTypes';
import { useTranslation } from 'react-i18next';

interface Props {
  labelText: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  id: string;
  hasError?: boolean;
  autoComplete?: string;
  dropdownItemsList: Country[];
  setFieldValue: (arg0: string, arg1: string, arg2?: boolean) => void;
  handleChange?: (arg0: Country) => void;
}

const AutoCompleteDropdown: FC<Props> = (props) => {
  const {
    labelText,
    id,
    name,
    onChange,
    value,
    hasError,
    autoComplete,
    dropdownItemsList,
    setFieldValue,
    handleChange,
  } = props;
  const [on, toggle] = useState(false);

  const wrapperRef = useRef<HTMLLabelElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();

  const toggleFocus = (e: any) => {
    if (!dropdownRef.current || !dropdownRef.current.contains(e.target)) {
      toggle(true);
    }
  };

  const handleClickOutside = (e: any) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      console.log('handleClickOutside');
      toggle(false);
    }
  };

  const handleSetValue = (country: Country) => () => {
    setFieldValue(id, country.name);

    if (handleChange) {
      handleChange(country);
    }
    setTimeout(() => {
      console.log('handleSetValue');
      toggle(false);
    }, 100);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    inputRef.current?.addEventListener('focus', toggleFocus);
    return () => inputRef.current?.removeEventListener('focus', toggleFocus);
  }, []);

  const renderItems = () => {
    const filteredList = dropdownItemsList.filter(
      (item) => !value || item.name.toLowerCase().includes(value.toLowerCase())
    );
    return filteredList.length ? (
      filteredList.map((item) => (
        <DropdownItem key={item.id} onClick={handleSetValue(item)}>
          <DropdownItemText color="#fffccc" fontSize="12px">
            {item.name}
          </DropdownItemText>
        </DropdownItem>
      ))
    ) : (
      <PrimaryTextSpan fontSize="11px" color="rgba(255,255,255,0.4)">
        {t('No matches')}
      </PrimaryTextSpan>
    );
  };
  return (
    <LabelWrapper htmlFor={id} ref={wrapperRef} onMouseDown={toggleFocus}>
      <Input
        ref={inputRef}
        id={id}
        type="text"
        name={name}
        onChange={onChange}
        value={value}
        required
        hasError={hasError}
        autoComplete={autoComplete}
      ></Input>
      <Label>{labelText}</Label>
      {on && (
        <DropdownWrapper
          ref={dropdownRef}
          flexDirection="column"
          padding="16px"
          position="absolute"
          top="100%"
          left="0"
          right="0"
          zIndex="101"
          backgroundColor="#1C2026"
        >
          {renderItems()}
        </DropdownWrapper>
      )}
    </LabelWrapper>
  );
};

export default AutoCompleteDropdown;

const LabelWrapper = styled.label`
  display: flex;
  position: relative;
  margin: 0;
  padding-top: 24px;
`;

const Input = styled.input<{ hasError?: boolean }>`
  border: none;
  outline: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: ${(props) => props.hasError && '1px solid #ED145B !important'};
  background-color: transparent;
  width: 100%;
  caret-color: #fff;
  color: #fffccc;
  font-size: 14px;
  line-height: 16px;
  padding-bottom: 4px;
  transition: border 0.2s ease;
  will-change: border;

  &:hover {
    border-bottom: 1px solid rgba(255, 255, 255, 0.4);

    & + span {
      color: rgba(255, 255, 255, 0.6);
    }
  }

  &:focus {
    border-bottom: 1px solid #00ffdd;

    & + span {
      transform: translateY(-30px);
      font-size: 11px;
      text-transform: uppercase;
    }
  }

  &:valid {
    & + span {
      transform: translateY(-30px);
      font-size: 11px;
      text-transform: uppercase;
    }
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:valid,
  &:-webkit-autofill:active {
    transition: border 0.2s ease, background-color 50000s ease-in-out 0s;
    font-size: 14px;
    -webkit-text-fill-color: #fffccc !important;

    & + span {
      transform: translateY(-30px);
      font-size: 11px;
      text-transform: uppercase;
    }
  }
`;

const Label = styled(PrimaryTextSpan)`
  position: absolute;
  bottom: 0px;
  transform: translateY(-4px);
  transition: transform 0.2s ease, font-size 0.2s ease, color 0.2s ease;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
`;

const DropdownWrapper = styled(FlexContainer)`
  max-height: 130px;
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

const DropdownItem = styled(FlexContainer)`
  margin-bottom: 16px;

  &:last-of-type {
    margin-bottom: 0;
  }

  &:hover {
    > p {
      color: #21b3a4;
    }
  }
`;

const DropdownItemText = styled(PrimaryTextParagraph)`
  transition: all 0.2s ease;

  &:hover {
    cursor: pointer;
  }
`;
