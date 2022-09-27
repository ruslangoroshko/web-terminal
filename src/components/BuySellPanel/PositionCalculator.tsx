import styled from '@emotion/styled';
import React, { useCallback, useMemo } from 'react';
import Colors from '../../constants/Colors';
import { Button, PrimaryButton } from '../../styles/Buttons';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import IconClose from '../../assets/svg/icon-popup-close.svg';
import SvgIcon from '../SvgIcon';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import InformationPopup from '../InformationPopup';
import { useTranslation } from 'react-i18next';
import AssetSelectorInput from '../AssetSelectorInput';
import { useStores } from '../../hooks/useStores';
import { InstrumentModelWSDTO } from '../../types/InstrumentsTypes';
import { Observer } from 'mobx-react-lite';
import { FormikHelpers, useFormik } from 'formik';
import * as yup from 'yup';
import MultiplierDropdown from './MultiplierDropdown';

type CalculatorData = {
  operation: string;
  invest: number;
  leverage: number;
  entryPrice: number;
  exitPrice: number | null;
  profitFiat?: number;
  profitPercent?: number;
  liquidationPrice?: number;
};

const PositionCalculator = () => {
  const { instrumentsStore } = useStores();
  const [on, setToggle] = React.useState(false);
  const { t } = useTranslation();

  const validationSchema = () =>
    yup.object().shape<CalculatorData>({
      operation: yup.string().oneOf(['buy', 'sell']).required(),
      invest: yup.number().required(),
      leverage: yup.number().required(),
      entryPrice: yup.number().required(),
      exitPrice: yup.number().nullable().required(),
      profitFiat: yup.number(),
      profitPercent: yup.number(),
      liquidationPrice: yup.number(),
    });

  const initialValues = useCallback((): CalculatorData => {
    return {
      operation: 'buy',
      invest: 1000,
      leverage: 50,
      entryPrice:
        instrumentsStore.calcActiveInstrument?.ask ||
        instrumentsStore.activeInstrument?.instrumentItem.ask ||
        0,
      exitPrice: null,
    };
  }, [
    instrumentsStore.calcActiveInstrument,
    instrumentsStore.activeInstrument,
  ]);

  const setMultiplier = (lev: number) => {
    setFieldValue('leverage', lev);
  };

  const handleCalculate = () => {
    const { invest, leverage, operation, entryPrice, exitPrice } = values;
    if (exitPrice === null) {
      return;
    }
    console.log(values);

    let profitFiat, profitPercent, liquidationPrice, deltaPrice, side;

    side = operation === 'buy' ? 1 : -1;

    profitFiat = (+exitPrice / entryPrice - 1) * invest * leverage * side;

    let grow = profitFiat > 0 ? 1 : -1;
    profitPercent = ((Math.abs(profitFiat) * 100) / invest) * grow;

    liquidationPrice = ( ()/(invest * leverage * 0.9)) / +entryPrice
    setFieldValue('profitFiat', profitFiat.toFixed(2));
    setFieldValue('profitPercent', profitPercent.toFixed(2));
    setFieldValue('liquidationPrice', liquidationPrice);

    console.log(deltaPrice);

    profitFiat = invest * leverage;
  };


/*
soPrice = openPrice - (openPrice / 1000);


*/ 



  const handleChangeRadio = (input: any) => {
    console.log(input);
  };

  const {
    values,
    setFieldError,
    setFieldValue,
    validateForm,
    handleSubmit,
    handleChange,
    getFieldProps,
    errors,
    isValid,
    touched,
    isSubmitting,
  } = useFormik({
    initialValues: initialValues(),
    onSubmit: handleCalculate,
    validationSchema: validationSchema(),
    validateOnBlur: true,
    enableReinitialize: true,
    validateOnChange: true,
    validateOnMount: true,
  });

  const onBeforeInputHandler = (e: any, precision = 2) => {
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
    const regex = `^[0-9]{1,7}([,.][0-9]{1,${precision}})?$`;
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

  const handleToggleBtn = () => {
    setToggle(!on);
  };

  const handleClosePopup = () => {
    setToggle(false);
  };

  const onSelectIntrument = (instrument: InstrumentModelWSDTO) => {
    setFieldValue('leverage', instrument.multiplier[0]);
    instrumentsStore.setCalcActiveInstrument(instrument);
  };

  const handlerClickSubmit = async () => {
    const curErrors = await validateForm();
    const curErrorsKeys = Object.keys(curErrors);
    if (curErrorsKeys.length) {
      const el = document.getElementById(curErrorsKeys[0]);
      if (el) el.focus();
    }
  };

  const instrument = useMemo(() => {
    return (
      instrumentsStore.calcActiveInstrument ||
      instrumentsStore.activeInstrument?.instrumentItem ||
      null
    );
  }, [
    instrumentsStore.calcActiveInstrument,
    instrumentsStore.activeInstrument,
  ]);

  return (
    <FlexContainer marginBottom="12px" position="relative">
      <Button onClick={handleToggleBtn} type="button">
        <PrimaryTextSpan color={Colors.ACCENT} fontSize="14px">
          Calculator
        </PrimaryTextSpan>
      </Button>

      {on && (
        <ModalWrapper
          position="absolute"
          bottom="0px"
          right="calc(100% + 16px)"
        >
          <Wrapper flexDirection="column">
            <FlexContainer
              width="100%"
              justifyContent="flex-end"
              position="absolute"
              top="12px"
              right="12px"
            >
              <FlexContainer>
                {/* <PrimaryTextSpan marginBottom="24px" marginRight="12px">
                Position calculator
              </PrimaryTextSpan> */}
                <InformationPopup
                  bgColor={Colors.DARK_BLACK}
                  classNameTooltip="leverage"
                  width="212px"
                  direction="left"
                >
                  <PrimaryTextSpan color={Colors.ACCENT} fontSize="12px">
                    {t(
                      'The indicative numbers are for reference only. The realized numbers may be slightly different due to trading fees.'
                    )}
                  </PrimaryTextSpan>
                </InformationPopup>
              </FlexContainer>
              <ButtonClose type="button" onClick={handleClosePopup}>
                <SvgIcon
                  {...IconClose}
                  fillColor={Colors.WHITE_DARK}
                  hoverFillColor={Colors.PRIMARY}
                ></SvgIcon>
              </ButtonClose>
            </FlexContainer>

            {/*  */}

            <FlexContainer marginBottom="12px" flexDirection="column">
              <PrimaryTextSpan
                fontSize="11px"
                lineHeight="12px"
                color="rgba(255, 255, 255, 0.3)"
                textTransform="uppercase"
                marginBottom="12px"
              >
                {t('Select instrument')}
              </PrimaryTextSpan>

              <Observer>
                {() => (
                  <AssetSelectorInput
                    onSelectInstrument={onSelectIntrument}
                    activeInstrument={
                      instrumentsStore.calcActiveInstrument ||
                      instrumentsStore.activeInstrument?.instrumentItem ||
                      null
                    }
                  />
                )}
              </Observer>
            </FlexContainer>
            <form noValidate onSubmit={handleSubmit}>
              <FlexContainer
                width="100%"
                borderRadius="8px"
                overflow="hidden"
                marginBottom="16px"
              >
                <TabLabelWrap>
                  <TabInput
                    type="radio"
                    id="radio-buy"
                    name="operation"
                    operation="buy"
                    onChange={handleChange}
                    value="buy"
                    checked={values.operation === 'buy'}
                  />
                  <TabLabel operation="buy" htmlFor="radio-buy">
                    Buy/Long
                  </TabLabel>
                </TabLabelWrap>

                <TabLabelWrap>
                  <TabInput
                    type="radio"
                    id="radio-sell"
                    name="operation"
                    operation="sell"
                    onChange={handleChange}
                    value="sell"
                    checked={values.operation === 'sell'}
                  />
                  <TabLabel operation="sell" htmlFor="radio-sell">
                    Sell/Short
                  </TabLabel>
                </TabLabelWrap>
              </FlexContainer>

              <InputWrapper>
                <PrimaryTextSpan
                  fontSize="11px"
                  lineHeight="12px"
                  color="rgba(255, 255, 255, 0.3)"
                  textTransform="uppercase"
                >
                  {t('Invest')}
                </PrimaryTextSpan>
                <Input
                  placeholder="Invest"
                  name="invest"
                  id="invest"
                  onBeforeInput={onBeforeInputHandler}
                  value={values.invest}
                  onChange={handleChange}
                />
              </InputWrapper>

              <InputWrapper>
                <PrimaryTextSpan
                  fontSize="11px"
                  lineHeight="12px"
                  color="rgba(255, 255, 255, 0.3)"
                  textTransform="uppercase"
                >
                  {t('Leverage')}
                </PrimaryTextSpan>

                <div className="inputWrap">
                  <Observer>
                    {() => (
                      <MultiplierDropdown
                        onToggle={() => {}}
                        multipliers={
                          instrumentsStore.calcActiveInstrument?.multiplier ||
                          instrumentsStore.activeInstrument?.instrumentItem
                            .multiplier || [50]
                        }
                        selectedMultiplier={values.leverage}
                        setMultiplier={setMultiplier}
                      ></MultiplierDropdown>
                    )}
                  </Observer>
                </div>
              </InputWrapper>

              <InputWrapper>
                <PrimaryTextSpan
                  fontSize="11px"
                  lineHeight="12px"
                  color="rgba(255, 255, 255, 0.3)"
                  textTransform="uppercase"
                >
                  {t('Entry price')}
                </PrimaryTextSpan>
                <Input
                  name="entryPrice"
                  value={values.entryPrice}
                  onChange={handleChange}
                  onBeforeInput={(e: any) =>
                    onBeforeInputHandler(e, instrument?.digits)
                  }
                />
              </InputWrapper>

              <InputWrapper>
                <PrimaryTextSpan
                  fontSize="11px"
                  lineHeight="12px"
                  color="rgba(255, 255, 255, 0.3)"
                  textTransform="uppercase"
                >
                  {t('Exit price')}
                </PrimaryTextSpan>
                <Input
                  name="exitPrice"
                  value={values.exitPrice === null ? '' : values.exitPrice}
                  onChange={handleChange}
                  onBeforeInput={(e: any) =>
                    onBeforeInputHandler(e, instrument?.digits)
                  }
                />
              </InputWrapper>

              <InputWrapper>
                <PrimaryTextSpan
                  fontSize="11px"
                  lineHeight="12px"
                  color="rgba(255, 255, 255, 0.3)"
                  textTransform="uppercase"
                >
                  {t('Profit/Loss, USD')}
                </PrimaryTextSpan>
                <Input value={values.profitFiat} />
              </InputWrapper>

              <InputWrapper>
                <PrimaryTextSpan
                  fontSize="11px"
                  lineHeight="12px"
                  color="rgba(255, 255, 255, 0.3)"
                  textTransform="uppercase"
                >
                  {t('Profit/Loss, %')}
                </PrimaryTextSpan>

                <Input value={values.profitPercent} />
              </InputWrapper>

              <InputWrapper>
                <PrimaryTextSpan
                  fontSize="11px"
                  lineHeight="12px"
                  color="rgba(255, 255, 255, 0.3)"
                  textTransform="uppercase"
                >
                  {t('Liquidation price')}
                </PrimaryTextSpan>

                <Input readOnly value={values.liquidationPrice} />
              </InputWrapper>

              <FlexContainer width="100%" flexDirection="column">
                <ButtonAction
                  disabled={!isValid}
                  onClick={handlerClickSubmit}
                  className={values.operation === 'buy' ? 'buy' : ''}
                >
                  Calculate
                </ButtonAction>
              </FlexContainer>
            </form>
          </Wrapper>
        </ModalWrapper>
      )}
    </FlexContainer>
  );
};

export default PositionCalculator;

const ButtonAction = styled(ButtonWithoutStyles)`
  background-color: ${Colors.DANGER};
  border-radius: 4px;
  height: 40px;
  color: ${Colors.WHITE};
  font-weight: bold;
  font-size: 14px;
  line-height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 18px;
  transition: background-color 0.2s ease;
  will-change: background-color;
  &:hover,
  &:focus {
    background-color: ${Colors.DANGER_DARK};
  }
  &:disabled {
    background-color: rgba(255, 255, 255, 0.04);
  }

  &.buy {
    background-color: ${Colors.PRIMARY};
    color: ${Colors.DARK_BLACK};
    &:hover {
      background-color: ${Colors.PRIMARY_LIGHT};
    }
    &:disabled {
      background-color: rgba(255, 255, 255, 0.04);
      color: ${Colors.WHITE};
    }
  }
`;

const Input = styled.input`
  background-color: transparent;
  border: none;
  outline: none;
  width: 100%;
  height: 40px;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  padding: 8px 0 8px 8px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${Colors.WHITE};
  background-color: rgba(255, 255, 255, 0.06);

  &:-webkit-input-placeholder {
    color: ${Colors.WHITE};
    opacity: 0.3;
    font-weight: normal;
  }

  &:-ms-input-placeholder {
    color: ${Colors.WHITE};
    opacity: 0.3;
    font-weight: normal;
  }

  &::placeholder {
    color: ${Colors.WHITE};
    opacity: 0.3;
    font-weight: normal;
  }
`;

const InputWrapper = styled(FlexContainer)`
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 8px;
  .inputWrap,
  input {
    width: 140px;
  }
  .inputWrap > div {
    margin: 0;
  }
`;

const TabLabelWrap = styled(FlexContainer)`
  width: 50%;
  position: relative;
`;
const TabLabel = styled.label<{ operation: 'sell' | 'buy' }>`
  width: 100%;
  margin: 0;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  cursor: pointer;
  color: ${Colors.WHITE_LIGHT};
  border: ${`1px solid ${Colors.INPUT_BORDER}`};

  border-radius: ${(props) =>
    props.operation === 'buy' ? '8px 0 0 8px' : '0 8px 8px 0'};
`;

const TabInput = styled.input<{ operation: 'sell' | 'buy' }>`
  position: absolute;
  z-index: -1;
  opacity: 0;

  &:checked + label {
    background-color: ${(props) =>
      props.operation === 'buy' ? Colors.PRIMARY : Colors.DANGER};
    color: ${(props) =>
      props.operation === 'buy' ? Colors.DARK_BLACK : Colors.WHITE};
    border-color: ${(props) =>
      props.operation === 'buy' ? Colors.PRIMARY : Colors.DANGER};
  }
`;

const ModalWrapper = styled(FlexContainer)`
  width: 260px;
  bottom: auto;
  @media (max-height: 700px) {
    top: auto;
    bottom: 0;
  }
`;

const Wrapper = styled(FlexContainer)`
  width: 100%;
  padding: 14px 12px 12px;
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.25),
    0px 6px 12px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 1);
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(12px);
  }
`;

const ButtonClose = styled(ButtonWithoutStyles)`
  /* position: absolute;
  top: 12px;
  right: 12px; */
  display: flex;
  justify-content: center;
  align-items: center;
`;
