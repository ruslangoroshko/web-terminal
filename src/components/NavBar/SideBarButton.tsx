import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import SvgIcon from '../SvgIcon';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import styled from '@emotion/styled';
import { PrimaryTextParagraph } from '../../styles/TextsElements';

interface Props {
  iconProps: any;
  title: string;
  isActive?: boolean;
  setSideBarActive: () => void;
}

function SideBarButton(props: Props) {
  const { iconProps, title, isActive, setSideBarActive } = props;

  return (
    <ButtonWrapper onClick={setSideBarActive}>
      <FlexContainer margin="0 0 8px 0" justifyContent="center">
        <SvgIcon
          {...iconProps}
          fillColor={isActive ? '#FFFCCC' : 'rgba(255, 255, 255, 0.5)'}
        ></SvgIcon>
      </FlexContainer>
      <PrimaryTextParagraph
        color={isActive ? '#fffccc' : 'rgba(255, 255, 255, 0.6)'}
        fontSize="11px"
      >
        {title}
      </PrimaryTextParagraph>
    </ButtonWrapper>
  );
}

export default SideBarButton;

const ButtonWrapper = styled(ButtonWithoutStyles)`
  flex-direction: column;
  align-items: center;
  padding: 8px 0;
  &:hover {
    & svg > * {
      fill: #fffccc;
    }
    & p {
      color: #fffccc;
    }
  }
`;
