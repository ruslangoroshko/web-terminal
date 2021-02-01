import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import React, { FC, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { FormValues } from '../../types/Positions';

const TopingUpCheck: FC = observer(() => {
  const { t } = useTranslation();
  const { getValues, setValue } = useFormContext<FormValues>();

  const handleClickOn = () => {
    setValue('isToppingUpActive', true);
  };

  const handleClickOff = useCallback(() => {
    // if (getValues(Fields.IS_TOPPING_UP)) {
    //   SLTPStore.toggleDeleteToppingUp(true);
    // } else {
    // setValue('isToppingUpActive', false);
    // SLTPStore.toggleToppingUp(false);
    // }
  }, []);

  const { isToppingUpActive } = getValues();

  return (
    <FlexContainer backgroundColor="#2A2C33" borderRadius="4px" padding="2px">
      <CheckButton
        type="button"
        onClick={handleClickOff}
        isActive={!isToppingUpActive}
      >
        <PrimaryTextSpan
          fontSize="14px"
          fontWeight="bold"
          color={!isToppingUpActive ? '#1C1F26' : 'rgba(196, 196, 196, 0.5)'}
        >
          {t('Off')}
        </PrimaryTextSpan>
      </CheckButton>
      <CheckButton
        type="button"
        onClick={handleClickOn}
        isActive={isToppingUpActive}
      >
        <PrimaryTextSpan
          fontSize="14px"
          fontWeight="bold"
          color={isToppingUpActive ? '#1C1F26' : 'rgba(196, 196, 196, 0.5)'}
        >
          {t('On')}
        </PrimaryTextSpan>
      </CheckButton>
    </FlexContainer>
  );
});

export default TopingUpCheck;

const CheckButton = styled(ButtonWithoutStyles)<{ isActive: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 36px;
  border-radius: 4px;
  background-color: ${(props) => props.isActive && '#fffccc'};
  width: 50%;
`;
