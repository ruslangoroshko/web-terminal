import React, { FC } from 'react';
import { PrimaryTextSpan } from '../styles/TextsElements';
import styled from '@emotion/styled';
import { FlexContainer } from '../styles/FlexContainer';

interface Props {
  checkboxText: string;
  id: string;
  checked?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: FC<Props> = ({
  checkboxText,
  id,
  children,
  checked,
  onChange,
}) => {
  console.log('TCL: checked', checked);
  return (
    <Label htmlFor={id}>
      <InputCheckbox
        checkboxClass={id}
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <CheckboxElement className={`${id}-checkbox`}></CheckboxElement>
      <PrimaryTextSpan fontSize="14px" color="#fffccc">
        {checkboxText}
      </PrimaryTextSpan>
      {children}
    </Label>
  );
};

export default Checkbox;

const Label = styled.label`
  display: flex;
  align-items: center;
  margin: 0;

  &:hover {
    cursor: pointer;
  }
`;

const CheckboxElement = styled(FlexContainer)`
  transition: background-color 0.2s ease;
  overflow: hidden;
  padding: 4px;
  border: 1px solid rgba(255, 255, 255, 0.19);
  border-radius: 4px;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  position: relative;

  &:before {
    content: '';
    background-color: rgba(255, 255, 255, 0.06);
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
`;

const InputCheckbox = styled.input<{ checkboxClass: string }>`
  display: none;

  &:checked + .${props => props.checkboxClass}-checkbox {
    background-color: #00fff2;
  }
`;
