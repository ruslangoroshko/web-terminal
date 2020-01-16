import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import IconClose from '../../assets/svg/icon-popup-close.svg';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import SvgIcon from '../SvgIcon';
import PnLTypeDropdown from './PnLTypeDropdown';
import {
  PrimaryTextParagraph,
  PrimaryTextSpan,
} from '../../styles/TextsElements';
import { AutoCloseTypesEnum } from '../../enums/AutoCloseTypesEnum';
import Fields from '../../constants/fields';
import { OpenPositionModelFormik } from '../../types/Positions';
import MaskedInput from 'react-text-mask';
import { useStores } from '../../hooks/useStores';
import InformationPopup from '../InformationPopup';
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

const Wrapper = styled(FlexContainer)`
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.25),
    0px 6px 12px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.8);

  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(12px);
  }
`;

const InfoIcon = styled(FlexContainer)`
  font-size: 11px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  color: #fffccc;
  font-style: italic;
`;

const ButtonClose = styled(ButtonWithoutStyles)`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InputPnL = styled.input`
  background-color: transparent;
  border: none;
  outline: none;
  width: 100%;
  height: 100%;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  color: #ffffff;
  border-right: 1px solid rgba(255, 255, 255, 0.1);

  &::placeholder {
    color: #fff;
    opacity: 0.3;
    font-weight: normal;
  }
`;

const InputWrapper = styled(FlexContainer)`
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  background-color: rgba(255, 255, 255, 0.06);
`;

const PlusSign = styled.span`
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  color: #ffffff;
  position: absolute;
  top: 50%;
  left: 8px;
  transform: translateY(-50%);
`;

const ButtonApply = styled(ButtonWithoutStyles)`
  background: linear-gradient(0deg, #00fff2, #00fff2);
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  color: #003a38;
  height: 32px;
`;

const ButtonAutoClosePurchase = styled(ButtonWithoutStyles)`
  height: 40px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  width: 100%;
  margin-bottom: 14px;
`;
