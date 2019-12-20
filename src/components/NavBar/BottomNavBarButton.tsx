import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import SvgIcon from '../SvgIcon';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import styled from '@emotion/styled';

interface Props {
  iconProps: any;
  title: string;
}

function BottomNavBarButton(props: Props) {
  const { iconProps, title } = props;
  const switchBottomInstruments = () => {};
  return (
    <ButtonWithoutStyles onClick={switchBottomInstruments}>
      <FlexContainer
        flexDirection="column"
        alignItems="center"
        padding="12px 0 8px"
      >
        <FlexContainer margin="0 0 4px 0">
          <SvgIcon {...iconProps} fill="#C4C4C4"></SvgIcon>
        </FlexContainer>
        <Title>{title}</Title>
      </FlexContainer>
    </ButtonWithoutStyles>
  );
}

export default BottomNavBarButton;

const Title = styled.span`
  font-size: 11px;
  line-height: 12px;
  text-align: center;
  color: #ffffff;
`;
