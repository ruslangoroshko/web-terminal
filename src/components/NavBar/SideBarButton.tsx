import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import SvgIcon from '../SvgIcon';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import styled from '@emotion/styled';
import ColorsPallete from '../../styles/colorPallete';

interface Props {
  iconProps: any;
  title: string;
  isActive?: boolean;
  setSideBarActive: () => void;
}

function SideBarButton(props: Props) {
  const { iconProps, title, isActive, setSideBarActive } = props;

  return (
    <ButtonWithoutStyles onClick={setSideBarActive}>
      <FlexContainer
        flexDirection="column"
        alignItems="center"
        padding="12px 0 8px"
      >
        <FlexContainer margin="0 0 4px 0">
          <SvgIcon
            {...iconProps}
            fill={isActive ? ColorsPallete.EASTERN_BLUE : '#C4C4C4'}
          ></SvgIcon>
        </FlexContainer>
        <Title isActive={isActive}>{title}</Title>
      </FlexContainer>
    </ButtonWithoutStyles>
  );
}

export default SideBarButton;

const Title = styled.span<{ isActive?: boolean }>`
  font-size: 11px;
  line-height: 12px;
  text-align: center;
  color: ${props => (props.isActive ? ColorsPallete.EASTERN_BLUE : '#fff')};
`;
