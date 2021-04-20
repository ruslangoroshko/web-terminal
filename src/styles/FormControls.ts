import styled from '@emotion/styled';

export const InputMaskedCustom = styled.input`
  outline: none;
  height: 48px;
  color: #fffccc;
  box-shadow: none;
  font-size: 14px;
  font-weight: bold;
  width: 100%;
  padding: 12px 16px;
  background-color: transparent;
  border-radius: 4px;
  transition: all 0.2s ease;
  &::placeholder {
    color: rgba(196, 196, 196, 0.5);
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
  }
  &:focus {
    border-color: #fffccc;
    &::placeholder {
      opacity: 0;
    }
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:valid,
  &:-webkit-autofill:active {
    transition: border 0.2s ease, background-color 50000s ease-in-out 0s;
    -webkit-text-fill-color: #fffccc !important;
    font-size: 14px;
  }
`;
