import React, { useState, useRef, useEffect } from 'react';
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

function AutoClosePopupSideBar(props: Props) {
  const { updateSLTP, stopLossValue, takeProfitValue } = props;

  const [on, toggle] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    toggle(!on);
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
    <FlexContainer position="relative" ref={wrapperRef}>
      <SetSLTPButton onClick={handleToggle}>
        <PrimaryTextSpan
          fontSize="12px"
          lineHeight="14px"
          color="rgba(255, 255, 255, 0.6)"
        >
          TP SL
        </PrimaryTextSpan>
      </SetSLTPButton>
      {on && (
        <FlexContainer position="absolute" top="24px" right="8px" zIndex="101">
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

export default AutoClosePopupSideBar;

const SetSLTPButton = styled(SecondaryButton)`
  border: 1px solid rgba(255, 255, 255, 0.12);
  margin-right: 8px;
  background-color: transparent;
`;
