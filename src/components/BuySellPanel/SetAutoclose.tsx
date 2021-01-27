import React, { ChangeEvent, FC, useEffect, useState } from 'react';
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
import { Observer, observer } from 'mobx-react-lite';
import ErropPopup from '../ErropPopup';
import ColorsPallete from '../../styles/colorPallete';
import { getProcessId } from '../../helpers/getProcessId';
import { TpSlTypeEnum } from '../../enums/TpSlTypeEnum';
import validationInputTexts from '../../constants/validationInputTexts';
import { PositionModelWSDTO } from '../../types/Positions';
import { useTranslation } from 'react-i18next';
import TopingUpCheck from './TopingUpCheck';

interface Props {
  takeProfitValue: PositionModelWSDTO['tp'];
  takeProfitType: PositionModelWSDTO['tpType'];
  stopLossValue: PositionModelWSDTO['sl'];
  stopLossType: PositionModelWSDTO['slType'];
  slError?: string;
  tpError?: string;
  toggle: (arg0: boolean) => void;
  handleApply?: () => Promise<void>;
  isDisabled?: boolean;
  removeSL: () => void;
  removeTP: () => void;
  toggleOut?: () => void;
  instrumentId?: string;
  digits?: number;
  active?: boolean;
  investAmount?: number;
}

const SetAutoclose: FC<Props> = observer((props) => {
  const {
    takeProfitValue,
    stopLossValue,
    stopLossType,
    takeProfitType,
    toggle,
    handleApply,
    isDisabled,
    slError,
    tpError,
    removeSL,
    removeTP,
    toggleOut,
    instrumentId,
    digits,
    investAmount,
  } = props;

  const { t } = useTranslation();

  const { SLTPStore, instrumentsStore } = useStores();

  const [activeNowTP, setActiveNowTP] = useState(true);
  const [activeNowSL, setActiveNowSL] = useState(true);

  const [errorSL, setErrorSL] = useState<boolean>(false);
  const [errorTP, setErrorTP] = useState<boolean>(false);
  const [errorHighLevel, setErrorHighLevel] = useState<boolean>(false);
  const [errorSLForm, setErrorSLForm] = useState<string | undefined>(slError);
  const [errorTPForm, setErrorTPForm] = useState<string | undefined>(tpError);

  const handleBeforeInput = (fieldType: TpSlTypeEnum | null) => (e: any) => {
    let PRECISION = 2;

    switch (fieldType) {
      case TpSlTypeEnum.Currency:
        PRECISION = 2;
        break;

      case TpSlTypeEnum.Price:
        if (instrumentId) {
          PRECISION =
            instrumentsStore.instruments.find(
              (instrument) => instrument.instrumentItem.id === instrumentId
            )?.instrumentItem.digits || 2;
        } else {
          PRECISION = 2;
        }
        break;

      default:
        break;
    }

    const currTargetValue = e.currentTarget.value;

    if (!e.data.match(/^[0-9.,]*$/g)) {
      e.preventDefault();
      return;
    }

    if (!currTargetValue && [',', '.'].includes(e.data)) {
      e.preventDefault();
      return;
    }

    if ([',', '.'].includes(e.data)) {
      if (
        !currTargetValue ||
        (currTargetValue && currTargetValue.includes('.'))
      ) {
        e.preventDefault();
        return;
      }
    }
    // see another regex
    const regex = `^[0-9]{1,7}([,.][0-9]{1,${PRECISION}})?$`;
    const splittedValue =
      currTargetValue.substring(0, e.currentTarget.selectionStart) +
      e.data +
      currTargetValue.substring(e.currentTarget.selectionStart);
    if (
      currTargetValue &&
      ![',', '.'].includes(e.data) &&
      !splittedValue.match(regex)
    ) {
      e.preventDefault();
      return;
    }
    if (e.data.length > 1 && !splittedValue.match(regex)) {
      e.preventDefault();
      return;
    }
  };

  const handleChangeProfit = (e: ChangeEvent<HTMLInputElement>) => {
    setErrorTP(false);
    setErrorTPForm(undefined);
    setActiveNowTP(false);
    SLTPStore.takeProfitValue = e.target.value.replace(',', '.');
  };

  const handleChangeLoss = (e: ChangeEvent<HTMLInputElement>) => {
    setErrorSL(false);
    setErrorSLForm(undefined);
    setActiveNowSL(false);
    setErrorHighLevel(false);
    SLTPStore.stopLossValue = e.target.value.replace(',', '.');
    console.log('change sl');
  };

  const handleChangeTopingUp = (on: boolean) => {
    console.log('toggle')
    SLTPStore.toggleToppingUp(on);
    SLTPStore.updateToppingUp = true;
  };

  const handleApplyValues = async () => {
    if (handleApply) {
      try {
        await handleApply();
        toggle(false);
      } catch (error) {}
    }
  };

  const handleToggle = () => {
    toggle(false);
    if (!!toggleOut) {
      toggleOut();
    }
  };

  const getActiveTP = () => {
    const checkType = SLTPStore.autoCloseTPType === TpSlTypeEnum.Price;
    return !!digits &&
      checkType &&
      activeNowTP &&
      SLTPStore.takeProfitValue !== ''
      ? parseFloat(SLTPStore.takeProfitValue).toFixed(digits)
      : SLTPStore.takeProfitValue;
  };

  const getActiveSL = () => {
    const checkType = SLTPStore.autoCloseSLType === TpSlTypeEnum.Price;
    return !!digits &&
      checkType &&
      activeNowSL &&
      SLTPStore.stopLossValue !== ''
      ? parseFloat(SLTPStore.stopLossValue).toFixed(digits)
      : SLTPStore.stopLossValue;
  };

  const beforeApply = () => {
    const checkTP = parseFloat(getActiveTP()) === 0;
    const checkSL = parseFloat(getActiveSL()) === 0;
    const checkSLLevel = false;
    if (checkSL) {
      setErrorSL(true);
    } else {
      setErrorSL(false);
    }
    if (checkTP) {
      setErrorTP(true);
    } else {
      setErrorTP(false);
    }
    if (checkSLLevel) {
      setErrorHighLevel(true);
    } else {
      setErrorHighLevel(false);
    }
    if (!checkTP && !checkSL && !checkSLLevel) {
      setErrorSLForm(slError);
      setErrorTPForm(tpError);
      handleApplyValues();
    }
  };

  const onRemoveTP = () => {
    setErrorTP(false);
    removeTP();
  };

  const onRemoveSL = () => {
    setErrorSL(false);
    setErrorHighLevel(false);
    removeSL();
  };

  const getActualSLError = () => {
    if (errorSL) {
      return t(validationInputTexts.ZERO_ERROR_SL);
    } else if (errorHighLevel) {
      return t(validationInputTexts.STOP_LOSS_HIGHER);
    } else {
      return slError;
    }
  };

  useEffect(() => {
    SLTPStore.autoCloseSLType =
      stopLossType !== null ? stopLossType : TpSlTypeEnum.Currency;
    SLTPStore.autoCloseTPType =
      takeProfitType !== null ? takeProfitType : TpSlTypeEnum.Currency;
  }, [stopLossType, takeProfitType]);

  useEffect(() => {
    setErrorHighLevel(false);
  }, [SLTPStore.autoCloseSLType]);

  useEffect(() => {
    SLTPStore.takeProfitValue =
      takeProfitValue !== null ? takeProfitValue.toString() : '';
    SLTPStore.stopLossValue =
      stopLossValue !== null ? Math.abs(stopLossValue).toString() : '';
  }, [stopLossValue, takeProfitValue]);

  useEffect(() => {
    setErrorSLForm(slError);
  }, [slError]);

  useEffect(() => {
    setErrorTPForm(tpError);
  }, [tpError]);

  return (
    <Wrapper
      position="relative"
      padding="16px"
      flexDirection="column"
      width="250px"
    >
      <ButtonClose type="button" onClick={handleToggle}>
        <SvgIcon
          {...IconClose}
          fillColor="rgba(255, 255, 255, 0.6)"
          hoverFillColor="#00FFDD"
        ></SvgIcon>
      </ButtonClose>
      <PrimaryTextParagraph marginBottom="16px">
        {isDisabled ? t('Autoclose') : t('Set Autoclose')}
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
          {t('When Profit is')}
        </PrimaryTextSpan>
        <InformationPopup
          classNameTooltip="autoclose-profit"
          bgColor="#000"
          width="200px"
          direction="left"
        >
          <PrimaryTextSpan color="#fffccc" fontSize="12px">
            {t(
              'Determine the Take profit based on the amount of capital you are willing to take at the peak of the deal or based on the price level of your asset'
            )}
          </PrimaryTextSpan>
        </InformationPopup>
      </FlexContainer>
      <InputWrapper
        padding={
          SLTPStore.autoCloseTPType === TpSlTypeEnum.Price
            ? '0 0 0 8px'
            : '0 0 0 22px'
        }
        margin="0 0 16px 0"
        height="32px"
        width="100%"
        position="relative"
      >
        {(errorTPForm || errorTP) && (
          <ErropPopup
            textColor="#fffccc"
            bgColor={ColorsPallete.RAZZMATAZZ}
            classNameTooltip={getProcessId()}
            direction="left"
          >
            {errorTP ? t(validationInputTexts.ZERO_ERROR_TP) : tpError}
          </ErropPopup>
        )}
        {SLTPStore.autoCloseTPType !== TpSlTypeEnum.Price && (
          <PlusSign>+</PlusSign>
        )}
        <Observer>
          {() => (
            <>
              <InputPnL
                onBeforeInput={handleBeforeInput(SLTPStore.autoCloseTPType)}
                placeholder={t('Non Set')}
                onChange={handleChangeProfit}
                value={getActiveTP()}
                disabled={isDisabled}
                typeSlTp={SLTPStore.autoCloseTPType}
              ></InputPnL>
              {!!SLTPStore.takeProfitValue && !isDisabled && (
                <CloseValueButtonWrapper
                  position="absolute"
                  top="50%"
                  right="42px"
                >
                  <ButtonWithoutStyles type="button" onClick={onRemoveTP}>
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
          {t('When Loss is')}
        </PrimaryTextSpan>
        <InformationPopup
          classNameTooltip="autoclose-loss"
          bgColor="#000"
          width="200px"
          direction="left"
        >
          <PrimaryTextSpan color="#fffccc" fontSize="12px">
            {t(
              'Determine the Stop loss based on the amount of capital you are willing to risk or based on the price level of your asset'
            )}
          </PrimaryTextSpan>
        </InformationPopup>
      </FlexContainer>
      <InputWrapper
        padding={
          SLTPStore.autoCloseSLType === TpSlTypeEnum.Price
            ? '0 0 0 8px'
            : '0 0 0 22px'
        }
        margin={isDisabled ? '0' : '0 0 16px 0'}
        height="32px"
        width="100%"
        position="relative"
      >
        {(errorSLForm || errorSL || errorHighLevel) && (
          <ErropPopup
            textColor="#fffccc"
            bgColor={ColorsPallete.RAZZMATAZZ}
            classNameTooltip={getProcessId()}
            direction="left"
          >
            {getActualSLError()}
          </ErropPopup>
        )}
        {SLTPStore.autoCloseSLType !== TpSlTypeEnum.Price && (
          <PlusSign>-</PlusSign>
        )}
        <Observer>
          {() => (
            <>
              <InputPnL
                onBeforeInput={handleBeforeInput(SLTPStore.autoCloseSLType)}
                placeholder={t('Non Set')}
                onChange={handleChangeLoss}
                value={getActiveSL()}
                disabled={isDisabled}
                typeSlTp={SLTPStore.autoCloseSLType}
              ></InputPnL>
              {!!SLTPStore.stopLossValue && !isDisabled && (
                <CloseValueButtonWrapper
                  position="absolute"
                  top="50%"
                  right="42px"
                >
                  <ButtonWithoutStyles type="button" onClick={onRemoveSL}>
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

      <FlexContainer flexDirection="column" width="100%" marginBottom="12px">
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
            {t('Auto-increase trade amount')}
          </PrimaryTextSpan>
          <InformationPopup
            classNameTooltip="autoclose-loss"
            bgColor="#000"
            width="200px"
            direction="left"
          >
            <PrimaryTextSpan color="#fffccc" fontSize="12px">
              {`${t('If the loss for a position reaches ')} ${
                instrumentsStore.instruments.find(
                  (inst) => inst.instrumentItem.id === instrumentId
                )?.instrumentItem.stopOutPercent
              }%, ${t(
                'an additional 20% of the original investment amount is reserved from your balance to keep your position open.'
              )}`}
              
            </PrimaryTextSpan>
          </InformationPopup>
        </FlexContainer>

        <Observer>
          {() => (
            <TopingUpCheck
              isActive={SLTPStore.isToppingUpActive}
              onSelect={handleChangeTopingUp}
            />
          )}
        </Observer>
      </FlexContainer>
      <Observer>
        {() => (
          <>
            {!isDisabled && (
              <ButtonApply
                onClick={beforeApply}
                type="button"
                disabled={
                  SLTPStore.takeProfitValue === null &&
                  SLTPStore.stopLossValue === null
                }
              >
                {t('Apply')}
              </ButtonApply>
            )}
          </>
        )}
      </Observer>
    </Wrapper>
  );
});

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

const InputPnL = styled.input<{ typeSlTp?: TpSlTypeEnum | null }>`
  background-color: transparent;
  border: none;
  outline: none;
  width: calc(100% - 40px);
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
