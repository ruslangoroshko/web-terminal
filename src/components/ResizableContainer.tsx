import React, { FC, useEffect, useRef } from 'react';
import { FlexContainer, FlexContainerProps } from '../styles/FlexContainer';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import styled from '@emotion/styled';
import SvgIcon from './SvgIcon';
import IconExpand from '../assets/svg/icon-tabs-fullscreen.svg';
import IconClose from '../assets/svg/icon-popup-close.svg';
import { observer } from 'mobx-react-lite';
import { useStores } from '../hooks/useStores';

const ResizableContainer: FC = observer(props => {
  const { children } = props;
  const { tabsStore } = useStores();
  const toggleExpandtab = () => {
    tabsStore.isTabExpanded = !tabsStore.isTabExpanded;
  };

  return (
    <RelativeWrapper
      position="relative"
      width="320px"
      height="100%"
      zIndex="102"
      isActive={tabsStore.sideBarTabType !== null}
    >
      <FlexContainer position="absolute" top="12px" right="12px">
        <IconButton onClick={toggleExpandtab}>
          <SvgIcon {...IconExpand} fill="rgba(255, 255, 255, 0.6)"></SvgIcon>
        </IconButton>
        <IconButton onClick={tabsStore.closeAnyTab}>
          <SvgIcon {...IconClose} fill="rgba(255, 255, 255, 0.6)"></SvgIcon>
        </IconButton>
      </FlexContainer>
      {children}
    </RelativeWrapper>
  );
});

export default ResizableContainer;

const RelativeWrapper = styled(FlexContainer)<
  FlexContainerProps & { isActive?: boolean }
>`
  max-width: ${props => (props.isActive ? '320px' : '0')};
  overflow: hidden;
  transition: max-width 0.3s linear;
`;

const IconButton = styled(ButtonWithoutStyles)`
  margin-right: 8px;
  &:last-of-type {
    margin-right: 0;
  }
`;
