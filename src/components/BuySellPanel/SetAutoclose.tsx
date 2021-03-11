import React, { FC, useCallback } from 'react';
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
import ErropPopup from '../ErropPopup';
import ColorsPallete from '../../styles/colorPallete';
import { getProcessId } from '../../helpers/getProcessId';
import { TpSlTypeEnum } from '../../enums/TpSlTypeEnum';
import { useTranslation } from 'react-i18next';
import Fields from '../../constants/fields';
import { ConnectForm } from './ConnectForm';
import hasValue from '../../helpers/hasValue';
import { Observer, observer } from 'mobx-react-lite';
import setValueAsNullIfEmptyAndNegative from '../../helpers/setValueAsNullIfEmptyAndNegative';
import setValueAsNullIfEmpty from '../../helpers/setValueAsNullIfEmpty';

interface Props {
  isDisabled?: boolean;
  toggle: (arg0: boolean) => void;
  isActive: boolean;
  isNewOrder?: boolean;
}

const SetAutoclose: FC<Props> = observer(
  ({ isDisabled, toggle, children, isActive, isNewOrder }) => {
    const { t } = useTranslation();

    const { instrumentsStore, SLTPstore } = useStores();

    const handleBeforeInput = (fieldType: TpSlTypeEnum | null) => (e: any) => {
      let PRECISION = 2;

      switch (fieldType) {
        case TpSlTypeEnum.Currency:
          PRECISION = 2;
          break;

        case TpSlTypeEnum.Price:
          PRECISION =
            instrumentsStore.instruments.find(
              (item) =>
                item.instrumentItem.id ===
                SLTPstore[isNewOrder ? 'instrumentIdNewOrder' : 'instrumentId']
            )?.instrumentItem.digits || 2;
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

    const handleToggle = () => {
      toggle(false);
    };

    const handleRemoveTp = (setValue: any) => () => {
      setValue('tp', undefined, { shouldValidate: true });
    };

    const handleRemoveSl = (setValue: any) => () => {
      setValue('sl', undefined, { shouldValidate: true });
      setValue(Fields.IS_TOPPING_UP, false);
    };

    const handelFalseRadioClick = (
      setValue: (arg0: any, arg1: any) => void
    ) => () => {
      setValue(Fields.IS_TOPPING_UP, false);
    };

    const handelTrueRadioClick = (
      setValue: (arg0: any, arg1: any) => void
    ) => () => {
      setValue(Fields.IS_TOPPING_UP, true);
    };

    const handleChangeInput = (
      setValue: any,
      field: string,
      clearErrors: any
    ) => (e: React.ChangeEvent<HTMLInputElement>) => {
      clearErrors(field);
      setValue(field, e.target.value);
    };

    return (
      <ConnectForm>
        {({ register, setValue, errors, watch, clearErrors }) => {
          const { sl, tp, isToppingUpActive } = watch();
          return (
            <Wrapper
              position="relative"
              padding="16px"
              flexDirection="column"
              width="252px"
            >
              <>
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
                <Observer>
                  {() => (
                    <InputWrapper
                      padding={
                        SLTPstore[isNewOrder ? 'tpTypeNewOrder' : 'tpType'] ===
                        TpSlTypeEnum.Price
                          ? '0 0 0 8px'
                          : '0 0 0 22px'
                      }
                      margin="0 0 16px 0"
                      height="32px"
                      width="100%"
                      position="relative"
                    >
                      {isActive && errors.tp && (
                        <ErropPopup
                          textColor="#fffccc"
                          bgColor={ColorsPallete.RAZZMATAZZ}
                          classNameTooltip={getProcessId()}
                          direction="left"
                        >
                          {errors.tp.message}
                        </ErropPopup>
                      )}
                      {SLTPstore[isNewOrder ? 'tpTypeNewOrder' : 'tpType'] !==
                        TpSlTypeEnum.Price && <PlusSign>+</PlusSign>}
                      <InputPnL
                        onBeforeInput={handleBeforeInput(
                          SLTPstore[isNewOrder ? 'tpTypeNewOrder' : 'tpType']
                        )}
                        placeholder={t('Non Set')}
                        ref={register({
                          setValueAs: setValueAsNullIfEmpty,
                        })}
                        onChange={handleChangeInput(
                          setValue,
                          Fields.TAKE_PROFIT,
                          clearErrors
                        )}
                        name={Fields.TAKE_PROFIT}
                        disabled={isDisabled}
                      ></InputPnL>
                      {hasValue(tp) && !isDisabled && (
                        <CloseValueButtonWrapper
                          position="absolute"
                          top="50%"
                          right="42px"
                        >
                          <ButtonWithoutStyles
                            type="button"
                            onClick={handleRemoveTp(setValue)}
                          >
                            <SvgIcon
                              {...IconClose}
                              fillColor="rgba(255, 255, 255, 0.6)"
                            ></SvgIcon>
                          </ButtonWithoutStyles>
                        </CloseValueButtonWrapper>
                      )}
                      <PnLTypeDropdown
                        clearErrors={clearErrors}
                        dropdownType="tp"
                        isDisabled={isDisabled}
                        setValue={setValue}
                        isNewOrder={isNewOrder}
                      ></PnLTypeDropdown>
                    </InputWrapper>
                  )}
                </Observer>
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
                <Observer>
                  {() => (
                    <InputWrapper
                      padding={
                        SLTPstore[isNewOrder ? 'slTypeNewOrder' : 'slType'] ===
                        TpSlTypeEnum.Price
                          ? '0 0 0 8px'
                          : '0 0 0 22px'
                      }
                      margin={isDisabled ? '0' : '0 0 16px 0'}
                      height="32px"
                      width="100%"
                      position="relative"
                    >
                      {isActive && errors.sl && (
                        <ErropPopup
                          textColor="#fffccc"
                          bgColor={ColorsPallete.RAZZMATAZZ}
                          classNameTooltip={getProcessId()}
                          direction="left"
                        >
                          {errors.sl.message}
                        </ErropPopup>
                      )}
                      {SLTPstore[isNewOrder ? 'slTypeNewOrder' : 'slType'] !==
                        TpSlTypeEnum.Price && <PlusSign>-</PlusSign>}
                      <InputPnL
                        onBeforeInput={handleBeforeInput(
                          SLTPstore[isNewOrder ? 'slTypeNewOrder' : 'slType']
                        )}
                        placeholder={t('Non Set')}
                        name={Fields.STOP_LOSS}
                        ref={register({
                          setValueAs: setValueAsNullIfEmptyAndNegative,
                        })}
                        onChange={handleChangeInput(
                          setValue,
                          Fields.STOP_LOSS,
                          clearErrors
                        )}
                        disabled={isDisabled}
                      ></InputPnL>
                      {hasValue(sl) && !isDisabled && (
                        <CloseValueButtonWrapper
                          position="absolute"
                          top="50%"
                          right="42px"
                        >
                          <ButtonWithoutStyles
                            type="button"
                            onClick={handleRemoveSl(setValue)}
                          >
                            <SvgIcon
                              {...IconClose}
                              fillColor="rgba(255, 255, 255, 0.6)"
                            ></SvgIcon>
                          </ButtonWithoutStyles>
                        </CloseValueButtonWrapper>
                      )}
                      <PnLTypeDropdown
                        clearErrors={clearErrors}
                        dropdownType="sl"
                        isDisabled={isDisabled}
                        setValue={setValue}
                        isNewOrder={isNewOrder}
                      ></PnLTypeDropdown>
                    </InputWrapper>
                  )}
                </Observer>
                {!isDisabled && (
                  <FlexContainer
                    flexDirection="column"
                    width="100%"
                    marginBottom="24px"
                  >
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
                        {t('Save position from market noise')}
                      </PrimaryTextSpan>
                      <InformationPopup
                        classNameTooltip="autoclose-loss"
                        bgColor="#000"
                        width="260px"
                        direction="left"
                      >
                        <Observer>
                          {() => (
                            <PrimaryTextSpan color="#fffccc" fontSize="12px">
                              {`${t('If the loss for a position reaches')} ${
                                instrumentsStore.instruments.find(
                                  (inst) =>
                                    inst.instrumentItem.id ===
                                    SLTPstore[
                                      isNewOrder
                                        ? 'instrumentIdNewOrder'
                                        : 'instrumentId'
                                    ]
                                )?.instrumentItem.stopOutPercent || 0
                              }%, ${t(
                                'an additional 20% of the original investment amount will be reserved from your balance to save your position from closing. If the position takes a further loss, your available balance is reduced by 20% again and again. Once the position rises to at least'
                              )} ${
                                instrumentsStore.instruments.find(
                                  (inst) =>
                                    inst.instrumentItem.id ===
                                    SLTPstore[
                                      isNewOrder
                                        ? 'instrumentIdNewOrder'
                                        : 'instrumentId'
                                    ]
                                )?.instrumentItem.stopOutPercent || 0
                              }%, ${t(
                                'all previously reserved funds are returned to your balance.'
                              )}`}
                            </PrimaryTextSpan>
                          )}
                        </Observer>
                      </InformationPopup>
                    </FlexContainer>
                    <FlexContainer
                      backgroundColor="#2A2C33"
                      borderRadius="4px"
                      overflow="hidden"
                    >
                      <RadioInput
                        type="checkbox"
                        ref={register}
                        name={Fields.IS_TOPPING_UP}
                      />
                      <PseudoRadio
                        isChecked={!isToppingUpActive}
                        onClick={handelFalseRadioClick(setValue)}
                      >
                        {t('Off')}
                      </PseudoRadio>
                      <PseudoRadio
                        isChecked={isToppingUpActive}
                        onClick={handelTrueRadioClick(setValue)}
                      >
                        {t('On')}
                      </PseudoRadio>
                    </FlexContainer>
                  </FlexContainer>
                )}
                {!isDisabled ? children : null}
              </>
            </Wrapper>
          );
        }}
      </ConnectForm>
    );
  }
);

export default SetAutoclose;

const Wrapper = styled(FlexContainer)`
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.25),
    0px 6px 12px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  background-color: #1c2026;
  /* 
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(0, 0, 0, 0.55);
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

const CloseValueButtonWrapper = styled(FlexContainer)`
  transform: translateY(-50%);
`;

const RadioInput = styled.input`
  display: none;
  & ~ .check-on {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: rgba(196, 196, 196, 0.5);
    background-color: transparent;
  }

  & + .check-off {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: #1c1f26;
    background-color: #fffccc;
  }

  &:checked ~ .check-on {
    color: #1c1f26;
    background-color: #fffccc;
  }

  &:checked + .check-off {
    color: rgba(196, 196, 196, 0.5);
    background-color: transparent;
  }
`;

const RadioLabel = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 36px;
  border-radius: 4px;
  width: 100%;
  margin: 0;
`;

const PseudoRadio = styled.div<{ isChecked: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  padding: 8px 0;
  width: 100%;
  height: 100%;
  color: ${(props) =>
    props.isChecked ? '#1c1f26' : 'rgba(196, 196, 196, 0.5)'};
  background-color: ${(props) => (props.isChecked ? '#fffccc' : 'transparent')};
`;
