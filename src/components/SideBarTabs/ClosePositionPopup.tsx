import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import styled from '@emotion/styled';
import { SecondaryButton } from '../../styles/Buttons';
import ConfirmPopup from '../ConfirmPopup';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import SvgIcon from '../SvgIcon';
import IconClose from '../../assets/svg/icon-close.svg';

interface Props {
  applyHandler: () => void;
  confirmText: string;
  // TODO: refactor crutch
  isButton?: boolean;
  alignPopup?: 'left' | 'right';
  buttonLabel: string;
}

const ClosePositionPopup = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {
    applyHandler,
    isButton,
    confirmText,
    alignPopup = 'left',
    buttonLabel,
  } = props;

  const [on, toggle] = useState(false);

  const [popupPosition, setPopupPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const [isTop, setIsTop] = useState(true);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    toggle(!on);
    // @ts-ignore
    const { top, left, width } = ref.current.getBoundingClientRect();

    const rect = wrapperRef.current?.getBoundingClientRect();

    if (rect && window.innerHeight - rect.top - 150 <= 0) {
      setIsTop(false);
    }
    setPopupPosition({ top, left, width });
  };

  const handleClickOutside = (e: any) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      toggle(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <FlexContainer ref={wrapperRef}>
      {isButton ? (
        <CloseButton onClick={handleToggle}>
          <PrimaryTextSpan fontSize="12px" lineHeight="14px">
            {buttonLabel}
          </PrimaryTextSpan>
        </CloseButton>
      ) : (
        <ButtonWithoutStyles onClick={handleToggle}>
          <SvgIcon
            {...IconClose}
            fillColor="rgba(255, 255, 255, 0.8)"
            hoverFillColor="#00FFDD"
          />
        </ButtonWithoutStyles>
      )}

      {on && (
        <FlexContainer
          position="absolute"
          top={isTop ? `${Math.round(popupPosition.top + 26)}px` : 'auto'}
          bottom={isTop ? 'auto' : '20px'}
          left={
            alignPopup === 'left'
              ? `${Math.round(popupPosition.width * 0.75)}px`
              : 'auto'
          }
          right={
            alignPopup === 'right'
              ? `${Math.round(popupPosition.width * 0.75)}px`
              : 'auto'
          }
          zIndex="101"
        >
          <ConfirmPopup
            toggle={toggle}
            applyHandler={applyHandler}
            confirmText={confirmText}
          ></ConfirmPopup>
        </FlexContainer>
      )}
    </FlexContainer>
  );
});

export default ClosePositionPopup;

const CloseButton = styled(SecondaryButton)`
  border-radius: 3px;
  position: relative;
  overflow: hidden;
`;
