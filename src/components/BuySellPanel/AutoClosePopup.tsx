import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import Fields from '../../constants/fields';
import { OpenPositionModelFormik } from '../../types/Positions';
import { useStores } from '../../hooks/useStores';
import SetAutoclose from './SetAutoclose';

interface Props {
  setFieldValue: (field: any, value: any) => void;
  values: OpenPositionModelFormik;
  currencySymbol: string;
}

function AutoClosePopup(props: Props) {
  const { setFieldValue, values, currencySymbol } = props;
  const { SLTPStore } = useStores();
  const [on, toggle] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const handleToggle = () => {
    toggle(!on);
  };

  const handleApply = () => {
    setFieldValue(Fields.TAKE_PROFIT, SLTPStore.takeProfitValue);
    setFieldValue(Fields.STOP_LOSS, SLTPStore.stopLossValue);
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
      <ButtonAutoClosePurchase onClick={handleToggle} type="button">
        <PrimaryTextSpan color="#fffccc">
          {values.sl || values.tp
            ? `+${currencySymbol}${values.tp ||
                'Non Set'} -${currencySymbol}${values.sl || 'Non Set'}`
            : 'Set'}
        </PrimaryTextSpan>
      </ButtonAutoClosePurchase>
      {on && (
        <FlexContainer position="absolute" top="20px" right="100%">
          <SetAutoclose
            handleApply={handleApply}
            stopLossValue={values.sl}
            takeProfitValue={values.tp}
            toggle={toggle}
          />
        </FlexContainer>
      )}
    </FlexContainer>
  );
}

export default AutoClosePopup;

const ButtonAutoClosePurchase = styled(ButtonWithoutStyles)`
  height: 40px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  width: 100%;
  margin-bottom: 14px;
`;
