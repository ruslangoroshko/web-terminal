import React, { FC } from 'react';
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
import TopingUpCheck from './TopingUpCheck';
import { DeepMap, FieldError, useWatch } from 'react-hook-form';
import Fields from '../../constants/fields';
import setValueAsNullIfEmpty from '../../helpers/setValueAsNullIfEmpty';
import { ConnectForm } from './ConnectForm';
import hasValue from '../../helpers/hasValue';

interface Props {
  isDisabled?: boolean;
  toggle: (arg0: boolean) => void;
}

const SetAutoclose: FC<Props> = ({ isDisabled, toggle }) => {
  const { t } = useTranslation();

  const { instrumentsStore } = useStores();

  const handleBeforeInput = (
    fieldType = TpSlTypeEnum.Currency,
    instrumentId: string
  ) => (e: any) => {
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

  const handleToggle = () => {
    toggle(false);
  };

  const handleRemoveTp = (
    setValue: (arg0: string, arg1: any) => void
  ) => () => {
    setValue('tp', null);
  };

  const handleRemoveSl = (
    setValue: (arg0: string, arg1: any) => void
  ) => () => {
    setValue('sl', null);
  };

  const handleApplySetAutoClose = (
    errors: DeepMap<Record<string, any>, FieldError>
  ) => () => {
    if (!Object.keys(errors).length) {
      toggle(false);
    }
  };

  return (
    <Wrapper
      position="relative"
      padding="16px"
      flexDirection="column"
      width="252px"
    >
      <ConnectForm>
        {({ register, getValues, setValue, errors }) => (
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
            <InputWrapper
              padding={
                getValues(Fields.TAKE_PROFIT_TYPE) === TpSlTypeEnum.Price
                  ? '0 0 0 8px'
                  : '0 0 0 22px'
              }
              margin="0 0 16px 0"
              height="32px"
              width="100%"
              position="relative"
            >
              {errors.tp && (
                <ErropPopup
                  textColor="#fffccc"
                  bgColor={ColorsPallete.RAZZMATAZZ}
                  classNameTooltip={getProcessId()}
                  direction="left"
                >
                  {errors.tp}
                </ErropPopup>
              )}
              {getValues(Fields.TAKE_PROFIT_TYPE) !== TpSlTypeEnum.Price && (
                <PlusSign>+</PlusSign>
              )}
              <InputPnL
                onBeforeInput={handleBeforeInput(
                  getValues(Fields.TAKE_PROFIT_TYPE),
                  getValues(Fields.INSTRUMNENT_ID)
                )}
                placeholder={t('Non Set')}
                ref={register({ setValueAs: setValueAsNullIfEmpty })}
                name={Fields.TAKE_PROFIT}
                disabled={isDisabled}
              ></InputPnL>
              {!!getValues(Fields.TAKE_PROFIT) && !isDisabled && (
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
                getValues(Fields.STOP_LOSS_TYPE) === TpSlTypeEnum.Price
                  ? '0 0 0 8px'
                  : '0 0 0 22px'
              }
              margin={isDisabled ? '0' : '0 0 16px 0'}
              height="32px"
              width="100%"
              position="relative"
            >
              {errors.sl && (
                <ErropPopup
                  textColor="#fffccc"
                  bgColor={ColorsPallete.RAZZMATAZZ}
                  classNameTooltip={getProcessId()}
                  direction="left"
                >
                  {errors.sl}
                </ErropPopup>
              )}
              {getValues(Fields.STOP_LOSS_TYPE) !== TpSlTypeEnum.Price && (
                <PlusSign>-</PlusSign>
              )}
              <InputPnL
                onBeforeInput={handleBeforeInput(
                  getValues(Fields.STOP_LOSS_TYPE),
                  getValues(Fields.INSTRUMNENT_ID)
                )}
                placeholder={t('Non Set')}
                name={Fields.STOP_LOSS}
                ref={register({ setValueAs: setValueAsNullIfEmpty })}
                disabled={isDisabled}
              ></InputPnL>
              {!!getValues(Fields.STOP_LOSS) && !isDisabled && (
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
                  <PrimaryTextSpan color="#fffccc" fontSize="12px">
                    {`${t('If the loss for a position reaches')} ${
                      instrumentsStore.instruments.find(
                        (inst) =>
                          inst.instrumentItem.id ===
                          getValues(Fields.INSTRUMNENT_ID)
                      )?.instrumentItem.stopOutPercent
                    }%, ${t(
                      'an additional 20% of the original investment amount is reserved from your balance to keep your position open.'
                    )}`}
                  </PrimaryTextSpan>
                </InformationPopup>
              </FlexContainer>

              <TopingUpCheck />
            </FlexContainer>
            {!isDisabled && (
              <ButtonApply
                type="button"
                disabled={
                  !hasValue(getValues(Fields.STOP_LOSS)) &&
                  !hasValue(getValues(Fields.TAKE_PROFIT))
                }
                onClick={handleApplySetAutoClose(errors)}
              >
                {t('Apply')}
              </ButtonApply>
            )}
          </>
        )}
      </ConnectForm>
    </Wrapper>
  );
};

export default SetAutoclose;

const Wrapper = styled(FlexContainer)`
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.25),
    0px 6px 12px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  background-color: #1c2026;

  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(12px);
  }

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
