import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import React, { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Fields from '../../constants/fields';
import { useStores } from '../../hooks/useStores';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';

interface Props {}

const TopingUpCheck: FC<Props> = observer(() => {
  const { t } = useTranslation();
  const { SLTPstore } = useStores();
  
  const handleClickOn = () => {
    SLTPstore.toggleToppingUp(true);
  };

  const handleClickOff = () => {
    SLTPstore.toggleToppingUp(false);
  };
  return (
    <FlexContainer backgroundColor="#2A2C33" borderRadius="4px" padding="2px">
      <CheckButton
        type="button"
        onClick={handleClickOff}
        isActive={!SLTPstore.isToppingUpActive}
      >
        <PrimaryTextSpan
          fontSize="14px"
          fontWeight="bold"
          color={
            !SLTPstore.isToppingUpActive
              ? '#1C1F26'
              : 'rgba(196, 196, 196, 0.5)'
          }
        >
          {t('Off')}
        </PrimaryTextSpan>
      </CheckButton>
      <CheckButton
        type="button"
        onClick={handleClickOn}
        isActive={SLTPstore.isToppingUpActive}
      >
        <PrimaryTextSpan
          fontSize="14px"
          fontWeight="bold"
          color={
            SLTPstore.isToppingUpActive ? '#1C1F26' : 'rgba(196, 196, 196, 0.5)'
          }
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
