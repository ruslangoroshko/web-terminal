import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import styled from '@emotion/styled';
import { SecondaryButton } from '../../styles/Buttons';
import ConfirmPopup from '../ConfirmPopup';

interface Props {
  applyHandler: () => void;
}

const ClosePositionPopup = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { applyHandler } = props;

  const [on, toggle] = useState(false);

  const [popupPosition, setPopupPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    toggle(!on);
    // @ts-ignore
    const { top, left, width } = ref.current.getBoundingClientRect();
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
      <CloseButton onClick={handleToggle}>
        <PrimaryTextSpan fontSize="12px" lineHeight="14px">
          Close
        </PrimaryTextSpan>
      </CloseButton>
      {on && (
        <FlexContainer
          position="absolute"
          top={`${Math.round(popupPosition.top + 26)}px`}
          left={`${Math.round(popupPosition.width * 0.75)}px`}
          zIndex="101"
        >
          <ConfirmPopup
            toggle={toggle}
            applyHandler={applyHandler}
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
