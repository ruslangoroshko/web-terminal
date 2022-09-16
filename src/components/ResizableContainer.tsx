import React, { FC } from 'react';
import { FlexContainer, FlexContainerProps } from '../styles/FlexContainer';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import styled from '@emotion/styled';
import SvgIcon from './SvgIcon';
import IconExpand from '../assets/svg/icon-tabs-fullscreen.svg';
import IconClose from '../assets/svg/icon-popup-close.svg';
import { observer } from 'mobx-react-lite';
import { useStores } from '../hooks/useStores';
import { SideBarTabType } from '../enums/SideBarTabType';

const ResizableContainer: FC = observer(props => {
  const { children } = props;
  const { tabsStore, dateRangeStore, educationStore } = useStores();
  const toggleExpandtab = () => {
    tabsStore.setTabExpanded(!tabsStore.isTabExpanded);
    if (!tabsStore.isTabExpanded) {
      dateRangeStore.resetDatepicker();
    }
  };

  return (
    <RelativeWrapper
      position="relative"
      width="100%"
      height="100%"
      zIndex="102"
      isActive={
        tabsStore.sideBarTabType !== null &&
        !(tabsStore.sideBarTabType === SideBarTabType.Education && educationStore.coursesList === null)
      }
      flexDirection="column"
    >
      <FlexContainer position="absolute" top="12px" right="12px" zIndex="200">
        {
          tabsStore.sideBarTabType !== SideBarTabType.Markets &&
          tabsStore.sideBarTabType !== SideBarTabType.Education &&
          (
            <IconButton onClick={toggleExpandtab}>
              <SvgIcon
                {...IconExpand}
                fillColor="rgba(255, 255, 255, 0.6)"
              ></SvgIcon>
            </IconButton>
          )
        }
        {
          !(
            tabsStore.sideBarTabType === SideBarTabType.Education &&
            educationStore.activeCourse
          ) && <IconButton onClick={tabsStore.closeAnyTab}>
            <SvgIcon
              {...IconClose}
              fillColor="rgba(255, 255, 255, 0.6)"
              hoverFillColor="#00FFDD"
            > </SvgIcon>
          </IconButton>
        }
      </FlexContainer>
      {children}
    </RelativeWrapper>
  );
});

export default ResizableContainer;

const RelativeWrapper = styled(FlexContainer)<
  FlexContainerProps & { isActive?: boolean }
>`
  max-width: ${props => (props.isActive ? '360px' : '0')};
  transition: max-width 0.2s ease-in;
  backface-visibility: hidden;
  will-change: max-width, width;
  background: linear-gradient(
    270deg,
    rgba(0, 0, 0, 0.16) 0%,
    rgba(0, 0, 0, 0) 100%
  );

  & * {
    transition: ${props => !props.isActive && 'none !important'};
  }
`;

const IconButton = styled(ButtonWithoutStyles)`
  margin-right: 8px;
  &:last-of-type {
    margin-right: 0;
  }
`;
