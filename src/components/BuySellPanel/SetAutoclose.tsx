import React, { ChangeEvent, FC, useCallback } from 'react';
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
import { useFormContext } from 'react-hook-form';
import Fields from '../../constants/fields';
import { FormValues } from '../../types/Positions';
import hasValue from '../../helpers/hasValue';

interface Props {
  isDisabled?: boolean;
  toggle: (arg0: boolean) => void;
}

const SetAutoclose: FC<Props> = (props) => {
  const { isDisabled, toggle } = props;

  const { t } = useTranslation();

  const { getValues, setValue, errors, watch, register } = useFormContext<
    FormValues
  >();

  const { instrumentsStore } = useStores();

  const handleBeforeInput = (fieldType = TpSlTypeEnum.Currency) => (e: any) => {
    let PRECISION = 2;
    const instrumentId = getValues(Fields.INSTRUMNENT_ID);

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
    setValue('tp', e.target.value.replace(',', '.'));
  };

  const handleChangeLoss = (e: ChangeEvent<HTMLInputElement>) => {
    setValue('sl', e.target.value.replace(',', '.'));
  };

  const handleToggle = () => {
    toggle(false);
  };

  const handleRemoveTp = () => {
    setValue('tp', null);
  };

  const handleRemoveSl = () => {
    setValue('sl', null);
  };

  const handleApplySetAutoClose = useCallback(async () => {
    const { slType, tpType, tp, sl } = getValues();
    console.log({ slType, tpType, tp, sl });
    setValue('sl', sl ?? null, { shouldValidate: true });
    setValue('tp', tp ?? null, { shouldValidate: true });
    return new Promise<void>(async (resolve, reject) => {
      if (!Object.keys(errors).length) {
        resolve(toggle(false));
      } else {
        reject();
      }
    });
  }, [errors]);

  const { tp, tpType, sl, slType, instrumentId } = watch([
    Fields.TAKE_PROFIT_TYPE,
    Fields.TAKE_PROFIT,
    Fields.STOP_LOSS_TYPE,
    Fields.STOP_LOSS,
    Fields.INSTRUMNENT_ID,
  ]);

  return (
    <Wrapper
      position="relative"
      padding="16px"
      flexDirection="column"
      width="252px"
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
        padding={tpType === TpSlTypeEnum.Price ? '0 0 0 8px' : '0 0 0 22px'}
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
        {tpType !== TpSlTypeEnum.Price && <PlusSign>+</PlusSign>}
        <InputPnL
          onBeforeInput={handleBeforeInput(tpType)}
          placeholder={t('Non Set')}
          onChange={handleChangeProfit}
          ref={register({ valueAsNumber: true })}
          name={Fields.TAKE_PROFIT}
          disabled={isDisabled}
        ></InputPnL>
        {!!tp && !isDisabled && (
          <CloseValueButtonWrapper position="absolute" top="50%" right="42px">
            <ButtonWithoutStyles type="button" onClick={handleRemoveTp}>
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
        padding={slType === TpSlTypeEnum.Price ? '0 0 0 8px' : '0 0 0 22px'}
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
        {slType !== TpSlTypeEnum.Price && <PlusSign>-</PlusSign>}
        <InputPnL
          onBeforeInput={handleBeforeInput(slType)}
          placeholder={t('Non Set')}
          onChange={handleChangeLoss}
          name={Fields.STOP_LOSS}
          ref={register({ valueAsNumber: true })}
          disabled={isDisabled}
        ></InputPnL>
        {!!sl && !isDisabled && (
          <CloseValueButtonWrapper position="absolute" top="50%" right="42px">
            <ButtonWithoutStyles type="button" onClick={handleRemoveSl}>
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

      <FlexContainer flexDirection="column" width="100%" marginBottom="24px">
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
                  (inst) => inst.instrumentItem.id === instrumentId
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
          disabled={!hasValue(tp) && !hasValue(sl)}
          onClick={handleApplySetAutoClose}
        >
          {t('Apply')}
        </ButtonApply>
      )}
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
