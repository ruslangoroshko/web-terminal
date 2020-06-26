import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import SetAutoclose from '../BuySellPanel/SetAutoclose';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { PositionModelWSDTO } from '../../types/Positions';

interface Props {
  updateSLTP?: () => Promise<void>;
  stopLossValue: PositionModelWSDTO['sl'];
  stopLossType: PositionModelWSDTO['slType'];
  takeProfitValue: PositionModelWSDTO['tp'];
  takeProfitType: PositionModelWSDTO['tpType'];
  stopLossError?: string;
  takeProfitError?: string;
  isDisabled?: boolean;
  children: React.ReactNode;
  removeSl: () => void;
  removeTP: () => void;
}

const AutoClosePopupSideBar = forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    const {
      updateSLTP,
      stopLossValue,
      stopLossType,
      takeProfitValue,
      takeProfitType,
      isDisabled,
      children,
      stopLossError,
      takeProfitError,
      removeSl,
      removeTP,
    } = props;

    const [on, toggle] = useState(false);
    const [isTop, setIsTop] = useState(true);

    const [popupPosition, setPopupPosition] = useState({
      top: 0,
      left: 0,
      width: 0,
      bottom: 0,
      height: 0,
    });

    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => {
      toggle(!on);
      const {
        top,
        left,
        width,
        bottom,
        height,

        // @ts-ignore
      } = ref.current.getBoundingClientRect();
      setPopupPosition({ top, left, width, bottom, height });
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (rect && window.innerHeight - rect.top - 240 <= 0) {
        setIsTop(false);
      }
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
        <ButtonWithoutStyles type="button" onClick={handleToggle}>
          {children}
        </ButtonWithoutStyles>
        {on && (
          <FlexContainer
            position="absolute"
            // FIXME: think about this stupid sheet
            top={
              isTop
                ? `${popupPosition.top +
                    Math.round(popupPosition.height / 5)}px`
                : 'auto'
            }
            left={`${Math.round(popupPosition.width * 0.75)}px`}
            bottom={isTop ? 'auto' : '20px'}
            zIndex="101"
          >
            <SetAutoclose
              handleApply={updateSLTP}
              stopLossType={stopLossType}
              takeProfitType={takeProfitType}
              stopLossValue={stopLossValue}
              takeProfitValue={takeProfitValue}
              slError={stopLossError}
              tpError={takeProfitError}
              toggle={toggle}
              isDisabled={isDisabled}
              removeSL={removeSl}
              removeTP={removeTP}
            />
          </FlexContainer>
        )}
      </FlexContainer>
    );
  }
);

export default AutoClosePopupSideBar;
