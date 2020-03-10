import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import SetAutoclose from '../BuySellPanel/SetAutoclose';
import styled from '@emotion/styled';
import { SecondaryButton } from '../../styles/Buttons';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';

interface Props {
  updateSLTP: () => void;
  stopLossValue: number | null;
  takeProfitValue: number | null;
  investedAmount: number;
  isDisabled?: boolean;
  children: React.ReactNode;
}

const AutoClosePopupSideBar = forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    const {
      updateSLTP,
      stopLossValue,
      takeProfitValue,
      investedAmount,
      isDisabled,
      children,
    } = props;

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
        <ButtonWithoutStyles onClick={handleToggle}>
          {children}
        </ButtonWithoutStyles>
        {on && (
          <FlexContainer
            position="absolute"
            top={`${Math.round(popupPosition.top + 26)}px`}
            left={`${Math.round(popupPosition.width * 0.75)}px`}
            zIndex="101"
          >
            <SetAutoclose
              handleApply={updateSLTP}
              stopLossValue={stopLossValue}
              takeProfitValue={takeProfitValue}
              toggle={toggle}
              investedAmount={investedAmount}
              isDisabled={isDisabled}
            />
          </FlexContainer>
        )}
      </FlexContainer>
    );
  }
);

export default AutoClosePopupSideBar;
