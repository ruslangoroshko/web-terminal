import React, { FC, ChangeEvent, useState } from 'react';
import styled from '@emotion/styled';
import InputMask from 'react-input-mask';
import { PrimaryTextSpan } from '../styles/TextsElements';
import ErropPopup from './ErropPopup';
import Colors from '../constants/Colors';

interface Props {
  labelText: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  id: string;
  type?: string;
  hasError?: boolean;
  autoComplete?: string;
  errorText?: string;
  mask?: string;
}

const LabelInputMasked: FC<Props> = (props) => {
  const {
    labelText,
    id,
    name,
    onChange,
    value,
    type,
    hasError,
    autoComplete,
    errorText,
    mask,
  } = props;
  const [focused, setFocused] = useState(false);

  const removeFocus = () => {
    setFocused(false);
  };

  const toggleFocus = () => {
    setFocused(true);
  };

  return (
    <LabelWrapper htmlFor={id}>
      <Input
        maskPlaceholder={null}
        mask={mask || ''}
        maskChar={null}
        alwaysShowMask
        id={id}
        type={type || 'type'}
        name={name}
        onChange={onChange}
        onFocus={toggleFocus}
        value={value}
        required
        onBlur={removeFocus}
        hasError={hasError}
        autoComplete={autoComplete}
      ></Input>
      <Label>{labelText}</Label>
      {hasError && (
        <ErropPopup
          textColor={Colors.ACCENT}
          bgColor={Colors.DANGER}
          classNameTooltip={id}
          direction="right"
        >
          {errorText}
        </ErropPopup>
      )}
    </LabelWrapper>
  );
};

export default LabelInputMasked;

const LabelWrapper = styled.label`
  display: flex;
  position: relative;
  margin: 0;
  padding-top: 24px;
`;

const Input = styled(InputMask, {
  shouldForwardProp: (propName: string) =>
    !['hasError', 'maskChar'].includes(propName),
})<{
  hasError?: boolean;
  maskPlaceholder?: string | null;
}>`
  border: none;
  outline: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: ${(props) => props.hasError && `1px solid ${Colors.DANGER} !important`};
  background-color: transparent;
  width: 100%;
  caret-color: ${Colors.WHITE};
  color: ${Colors.ACCENT}
  font-size: 14px;
  line-height: 16px;
  padding-bottom: 4px;
  transition: border 0.2s ease;

  &:hover {
    border-bottom: 1px solid ${Colors.WHITE_LIGHT};

    & + span {
      color: ${Colors.WHITE_DARK};
    }
  }

  &:focus {
    border-bottom: 1px solid ${Colors.PRIMARY};

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
    -webkit-text-fill-color: ${Colors.ACCENT} !important;

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
  color: ${Colors.WHITE_LIGHT};
`;
