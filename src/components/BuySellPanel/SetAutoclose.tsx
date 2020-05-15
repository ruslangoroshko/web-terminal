import React, { ChangeEvent, useEffect, useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import SvgIcon from '../SvgIcon';
import {
  PrimaryTextParagraph,
  PrimaryTextSpan,
} from '../../styles/TextsElements';
import InformationPopup from '../InformationPopup';
import PnLTypeDropdown from './PnLTypeDropdown';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import IconClose from '../../assets/svg/icon-popup-close.svg';
import { useStores } from '../../hooks/useStores';
import { Observer } from 'mobx-react-lite';
import ErropPopup from '../ErropPopup';
import ColorsPallete from '../../styles/colorPallete';
import { getProcessId } from '../../helpers/getProcessId';

interface Props {
  takeProfitValue?: number;
  stopLossValue?: number;
  toggle: (arg0: boolean) => void;
  handleApply: () => void;
  investedAmount: number;
  isDisabled?: boolean;
}

function SetAutoclose(props: Props) {
  const {
    takeProfitValue,
    stopLossValue,
    toggle,
    handleApply,
    investedAmount,
    isDisabled,
  } = props;

  const { SLTPStore, instrumentsStore } = useStores();

  const handleChangeProfit = (e: ChangeEvent<HTMLInputElement>) => {
    SLTPStore.takeProfitValue = e.target.value;
  };

  const [tpError, setTpError] = useState('');
  const [slError, setSlError] = useState('');

  const handleBeforeInput = (e: any) => {
    if (!e.data.match(/^\d|\.|\,/)) {
      e.preventDefault();
      return;
    }
    if ([',', '.'].includes(e.data)) {
      if (
        !e.currentTarget.value ||
        (e.currentTarget.value && e.currentTarget.value.includes('.'))
      ) {
        e.preventDefault();
        return;
      }
    }
    const regex = `^[0-9]+(\.[0-9]{1,${instrumentsStore.activeInstrument!
      .instrumentItem.digits - 1}})?$`;

    if (
      e.currentTarget.value &&
      e.currentTarget.value[e.currentTarget.value.length - 1] !== '.' &&
      !e.currentTarget.value.match(regex)
    ) {
      e.preventDefault();
      return;
    }
  };

  const handleTakeProfitBlur = () => {
    if (SLTPStore.takeProfitValue) {
      SLTPStore.takeProfitValue = `${+SLTPStore.takeProfitValue}`;
    }
  };

  const handleStopLossBlur = () => {
    if (+SLTPStore.stopLossValue > investedAmount) {
      setSlError('Stop loss level can not be higher than the Invest amount');
    }
    setSlError('');

    if (SLTPStore.stopLossValue) {
      SLTPStore.stopLossValue = `${+SLTPStore.stopLossValue}`;
    }
  };

  const handleChangeLoss = (e: ChangeEvent<HTMLInputElement>) => {
    SLTPStore.stopLossValue = e.target.value;
  };

  const handleApplyValues = () => {
    handleApply();
    toggle(false);
  };

  const handleToggle = () => {
    toggle(false);
  };

  useEffect(() => {
    SLTPStore.takeProfitValue = takeProfitValue ? `${takeProfitValue}` : '';
    SLTPStore.stopLossValue = stopLossValue ? `${stopLossValue}` : '';

    return () => {
      return SLTPStore.clearStore();
    };
  }, []);

  const removeSL = () => {
    SLTPStore.stopLossValue = '';
  };

  const removeTP = () => {
    SLTPStore.takeProfitValue = '';
  };

  return (
    <Wrapper
      position="relative"
      padding="16px"
      flexDirection="column"
      width="200px"
    >
      <ButtonClose onClick={handleToggle}>
        <SvgIcon
          {...IconClose}
          fillColor="rgba(255, 255, 255, 0.6)"
          hoverFillColor="#00FFDD"
        ></SvgIcon>
      </ButtonClose>
      <PrimaryTextParagraph marginBottom="16px">
        {isDisabled ? 'Autoclose' : 'Set Autoclose'}
      </PrimaryTextParagraph>
      <FlexContainer
        margin="0 0 6px 0"
        alignItems="center"
        justifyContent="space-between"
      >
        <PrimaryTextSpan
          fontSize="11px"
          lineHeight="12px"
          color="rgba(255, 255, 255, 0.3)"
          textTransform="uppercase"
        >
          When Profit is
        </PrimaryTextSpan>
        <InformationPopup
          classNameTooltip="autoclose-profit"
          bgColor="#000"
          width="200px"
          direction="left"
        >
          Some text here
        </InformationPopup>
      </FlexContainer>
      <InputWrapper
        padding="0 0 0 22px"
        margin="0 0 16px 0"
        height="32px"
        width="100%"
        position="relative"
      >
        <PlusSign>+</PlusSign>
        <Observer>
          {() => (
            <>
              <InputPnL
                onBeforeInput={handleBeforeInput}
                placeholder="Non Set"
                onChange={handleChangeProfit}
                onBlur={handleTakeProfitBlur}
                value={SLTPStore.takeProfitValue || ''}
                disabled={isDisabled}
              ></InputPnL>
              {!!SLTPStore.takeProfitValue && !isDisabled && (
                <CloseValueButtonWrapper
                  position="absolute"
                  top="50%"
                  right="42px"
                >
                  <ButtonWithoutStyles type="button" onClick={removeTP}>
                    <SvgIcon
                      {...IconClose}
                      fillColor="rgba(255, 255, 255, 0.6)"
                    ></SvgIcon>
                  </ButtonWithoutStyles>
                </CloseValueButtonWrapper>
              )}
            </>
          )}
        </Observer>
        <PnLTypeDropdown
          dropdownType="tp"
          isDisabled={isDisabled}
        ></PnLTypeDropdown>
      </InputWrapper>
      <FlexContainer
        margin="0 0 6px 0"
        alignItems="center"
        justifyContent="space-between"
      >
        <PrimaryTextSpan
          fontSize="11px"
          lineHeight="12px"
          color="rgba(255, 255, 255, 0.3)"
          textTransform="uppercase"
        >
          When Loss is
        </PrimaryTextSpan>
        <InformationPopup
          classNameTooltip="autoclose-loss"
          bgColor="#000"
          width="200px"
          direction="left"
        >
          Some text here
        </InformationPopup>
      </FlexContainer>
      <InputWrapper
        padding="0 0 0 22px"
        margin={isDisabled ? '0' : '0 0 16px 0'}
        height="32px"
        width="100%"
        position="relative"
      >
        {slError && (
          <ErropPopup
            textColor="#fffccc"
            bgColor={ColorsPallete.RAZZMATAZZ}
            classNameTooltip={getProcessId()}
            direction="left"
          >
            {slError}
          </ErropPopup>
        )}
        <PlusSign>-</PlusSign>
        <Observer>
          {() => (
            <>
              <InputPnL
                onBeforeInput={handleBeforeInput}
                placeholder="Non Set"
                onChange={handleChangeLoss}
                onBlur={handleStopLossBlur}
                value={SLTPStore.stopLossValue || ''}
                disabled={isDisabled}
              ></InputPnL>
              {!!SLTPStore.stopLossValue && !isDisabled && (
                <CloseValueButtonWrapper
                  position="absolute"
                  top="50%"
                  right="42px"
                >
                  <ButtonWithoutStyles type="button" onClick={removeSL}>
                    <SvgIcon
                      {...IconClose}
                      fillColor="rgba(255, 255, 255, 0.6)"
                    ></SvgIcon>
                  </ButtonWithoutStyles>
                </CloseValueButtonWrapper>
              )}
            </>
          )}
        </Observer>
        <PnLTypeDropdown
          dropdownType="sl"
          isDisabled={isDisabled}
        ></PnLTypeDropdown>
      </InputWrapper>
      {!isDisabled && (
        <ButtonApply
          onClick={handleApplyValues}
          disabled={
            !!(tpError || slError) ||
            (!SLTPStore.takeProfitValue.length &&
              !SLTPStore.stopLossValue.length)
          }
        >
          Apply
        </ButtonApply>
      )}
    </Wrapper>
  );
}

export default SetAutoclose;

const Wrapper = styled(FlexContainer)`
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.25),
    0px 6px 12px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  background-color: #1c2026;

  /* @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(12px);
  } */

  &:hover {
    cursor: default;
  }
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
  color: #fffccc;
  border-right: 1px solid rgba(255, 255, 255, 0.1);

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
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
  color: #fffccc;
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

const CloseValueButtonWrapper = styled(FlexContainer)`
  transform: translateY(-50%);
`;
