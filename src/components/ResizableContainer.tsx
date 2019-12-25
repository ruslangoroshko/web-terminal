import React, { FC } from 'react';
import { FlexContainer, FlexContainerProps } from '../styles/FlexContainer';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import styled from '@emotion/styled';
import SvgIcon from './SvgIcon';
import IconExpand from '../assets/svg/icon-tabs-fullscreen.svg';
import IconClose from '../assets/svg/icon-popup-close.svg';
import Toggle from './Toggle';
import { observer } from 'mobx-react-lite';
import { useStores } from '../hooks/useStores';

interface Props {}

const ResizableContainer: FC<Props> = observer(props => {
  const { children } = props;
  const { tabsStore } = useStores();
  return (
    <Toggle>
      {({ on, toggle }) => (
        <RelativeWrapper
          position="relative"
          width="320px"
          height="100%"
          zIndex="102"
        >
          <ResizableContainerWrapper
            position="absolute"
            top="0"
            right="0"
            bottom="0"
            width="calc(100vw - 60px)"
            isExpanded={on}
            justifyContent="flex-end"
          >
            <FlexContainer position="absolute" top="12px" right="12px">
              <IconButton onClick={toggle}>
                <SvgIcon
                  {...IconExpand}
                  fill="rgba(255, 255, 255, 0.6)"
                ></SvgIcon>
              </IconButton>
              <IconButton onClick={tabsStore.closeAnyTab}>
                <SvgIcon
                  {...IconClose}
                  fill="rgba(255, 255, 255, 0.6)"
                ></SvgIcon>
              </IconButton>
            </FlexContainer>
            {children}
          </ResizableContainerWrapper>
        </RelativeWrapper>
      )}
    </Toggle>
  );
});

export default ResizableContainer;

const ResizableContainerWrapper = styled(FlexContainer)<
  FlexContainerProps & { isExpanded: boolean }
>`
  transform: ${props =>
    props.isExpanded ? 'translateX(calc(100% - 320px))' : 'translateX(0)'};
  backface-visibility: hidden;
  will-change: transform;
  transition: transform 0.7s cubic-bezier(0.77, 0, 0.175, 1);
`;

const RelativeWrapper = styled(FlexContainer)`
  min-width: 320px;
`;

const IconButton = styled(ButtonWithoutStyles)`
  margin-right: 8px;
  &:last-of-type {
    margin-right: 0;
  }
`;
