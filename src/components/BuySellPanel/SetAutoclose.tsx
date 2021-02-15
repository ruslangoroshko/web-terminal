import React, { FC, MouseEvent } from 'react';
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
import { Controller } from 'react-hook-form';

interface Props {
  isDisabled?: boolean;
  toggle: (arg0: boolean) => void;
  isActive: boolean;
}

const SetAutoclose: FC<Props> = observer(
  ({ isDisabled, toggle, children, isActive }) => {
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
              (item) => item.instrumentItem.id === SLTPstore.instrumentId
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

    const handleRemoveTp = (setValue: (arg0: any, arg1: any) => void) => () => {
      setValue('tp', undefined);
    };

    const handleRemoveSl = (setValue: (arg0: any, arg1: any) => void) => () => {
      setValue('sl', undefined);
    };

    return (
      <Wrapper
        position="relative"
        padding="16px"
        flexDirection="column"
        width="252px"
      >
        <ConnectForm>
          {({ register, setValue, errors, watch }) => {
            const { tp, sl } = watch();
            return (
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
                        SLTPstore.tpType === TpSlTypeEnum.Price
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
                      {SLTPstore.tpType !== TpSlTypeEnum.Price && (
                        <PlusSign>+</PlusSign>
                      )}
                      <InputPnL
                        onBeforeInput={handleBeforeInput(SLTPstore.tpType)}
                        placeholder={t('Non Set')}
                        ref={register({
                          setValueAs: setValueAsNullIfEmpty,
                        })}
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
                        dropdownType="tp"
                        isDisabled={isDisabled}
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
                        SLTPstore.slType === TpSlTypeEnum.Price
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
                      {SLTPstore.slType !== TpSlTypeEnum.Price && (
                        <PlusSign>-</PlusSign>
                      )}
                      <InputPnL
                        onBeforeInput={handleBeforeInput(SLTPstore.slType)}
                        placeholder={t('Non Set')}
                        name={Fields.STOP_LOSS}
                        ref={register({
                          setValueAs: setValueAsNullIfEmptyAndNegative,
                        })}
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
                        dropdownType="sl"
                        isDisabled={isDisabled}
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
                        {t('Auto-increase trade amount')}
                      </PrimaryTextSpan>
                      <InformationPopup
                        classNameTooltip="autoclose-loss"
                        bgColor="#000"
                        width="200px"
                        direction="left"
                      >
                        <Observer>
                          {() => (
                            <PrimaryTextSpan color="#fffccc" fontSize="12px">
                              {`${t('If the loss for a position reaches')} ${
                                instrumentsStore.instruments.find(
                                  (inst) =>
                                    inst.instrumentItem.id ===
                                    SLTPstore.instrumentId
                                )?.instrumentItem.stopOutPercent
                              }%, ${t(
                                'an additional 20% of the original investment amount is reserved from your balance to keep your position open.'
                              )}`}
                            </PrimaryTextSpan>
                          )}
                        </Observer>
                      </InformationPopup>
                    </FlexContainer>
                    <Controller
                      name={Fields.IS_TOPPING_UP}
                      render={(field) => (
                        <FlexContainer
                          backgroundColor="#2A2C33"
                          borderRadius="4px"
                          overflow="hidden"
                        >
                          <RadioLabel>
                            <RadioInput
                              type="radio"
                              {...field}
                              checked={!field.value}
                              onChange={(e) => {
                                field.onChange(e.target.checked);
                              }}
                            />
                            <PrimaryTextSpan
                              fontSize="14px"
                              fontWeight="bold"
                              color="rgba(196, 196, 196, 0.5)"
                            >
                              {t('Off')}
                            </PrimaryTextSpan>
                          </RadioLabel>
                          <RadioLabel>
                            <RadioInput
                              type="radio"
                              {...field}
                              checked={field.value}
                              onChange={(e) => {
                                field.onChange(!e.target.checked);
                              }}
                            />
                            <PrimaryTextSpan
                              fontSize="14px"
                              fontWeight="bold"
                              color="rgba(196, 196, 196, 0.5)"
                            >
                              {t('On')}
                            </PrimaryTextSpan>
                          </RadioLabel>
                        </FlexContainer>
                      )}
                    ></Controller>
                  </FlexContainer>
                )}
                {!isDisabled ? children : null}
              </>
            );
          }}
        </ConnectForm>
      </Wrapper>
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
  & + span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: rgba(196, 196, 196, 0.5);
  }

  &:checked + span {
    color: #1c1f26;
    background-color: #fffccc;
  }
`;

const RadioLabel = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 36px;
  border-radius: 4px;
  width: 50%;
  margin: 0;
`;
