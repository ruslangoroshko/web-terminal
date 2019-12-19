import styled from '@emotion/styled';

export const ButtonWithoutStyles = styled.button`
  border: none;
  outline: none;
  background-color: transparent;
  padding: 0;

  &:hover,
  &:focus {
    outline: none;
    cursor: pointer;
  }
`;
