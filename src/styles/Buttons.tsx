import styled from '@emotion/styled';
import { ButtonWithoutStyles } from './ButtonWithoutStyles';

interface PrimaryButtonProps {
  padding?: string;
  backgroundColor?: string;
  width?: string;
}

export const PrimaryButton = styled(ButtonWithoutStyles)<PrimaryButtonProps>`
  padding: ${(props) => props.padding || '4px 8px'};
  width: ${(props) => props.width};
  background-color: ${(props) => props.backgroundColor || '#00ffdd'};
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #9ffff2;
  }

  &:focus {
    background-color: #21b3a4;
  }

  &:disabled {
    background-color: rgba(255, 255, 255, 0.04);
    & span {
      color: rgba(255, 255, 255, 0.4);
    }
    & svg {
      fill: rgba(255, 255, 255, 0.4);
    }
  }
`;

export const SecondaryButton = styled(ButtonWithoutStyles)`
  padding: 4px 8px;
  background-color: rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:focus {
    background-color: rgba(0, 0, 0, 0.24);
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.24);
  }

  &:disabled {
    background-color: rgba(255, 255, 255, 0.04);
    & span {
      color: rgba(255, 255, 255, 0.4);
    }
  }
`;

export const Button = styled(SecondaryButton)<{
  hasInner?: boolean;
}>`
  height: 40px;
  background-color: ${(props) =>
    props.hasInner ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.12)'};
  width: 100%;
  border: 1px solid
    ${(props) =>
      props.hasInner ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0)'};

  display: flex;
  justify-content: ${(props) => (props.hasInner ? 'space-between' : 'center')};
  align-items: center;

  &:active,
  &:focus {
    background-color: rgba(255, 255, 255, 0.12);
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.24) !important;
  }
`;
