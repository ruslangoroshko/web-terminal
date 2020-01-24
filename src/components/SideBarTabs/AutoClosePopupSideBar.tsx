import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import SetAutoclose from '../BuySellPanel/SetAutoclose';
import styled from '@emotion/styled';
import { SecondaryButton } from '../../styles/Buttons';

interface Props {
  updateSLTP: () => void;
  stopLossValue: number | null;
  takeProfitValue: number | null;
}

const AutoClosePopupSideBar = forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    const { updateSLTP, stopLossValue, takeProfitValue } = props;

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
    });

    return (
      <FlexContainer ref={wrapperRef}>
        <SetSLTPButton onClick={handleToggle}>
          <PrimaryTextSpan
            fontSize="12px"
            lineHeight="14px"
            color={takeProfitValue ? '#fffccc' : 'rgba(255, 255, 255, 0.6)'}
          >
            TP
          </PrimaryTextSpan>
          &nbsp;
          <PrimaryTextSpan
            fontSize="12px"
            lineHeight="14px"
            color={stopLossValue ? '#fffccc' : 'rgba(255, 255, 255, 0.6)'}
          >
            SL
          </PrimaryTextSpan>
        </SetSLTPButton>
        {on && (
          <FlexContainer
            position="absolute"
            top={`${popupPosition.top + 20}px`}
            left={`${popupPosition.width * 0.75}px`}
            zIndex="101"
          >
            <SetAutoclose
              handleApply={updateSLTP}
              stopLossValue={stopLossValue}
              takeProfitValue={takeProfitValue}
              toggle={toggle}
            />
          </FlexContainer>
        )}
      </FlexContainer>
    );
  }
);

export default AutoClosePopupSideBar;

const SetSLTPButton = styled(SecondaryButton)`
  border: 1px solid rgba(255, 255, 255, 0.12);
  margin-right: 8px;
  background-color: transparent;
`;
