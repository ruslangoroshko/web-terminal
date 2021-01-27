import styled from '@emotion/styled';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../hooks/useStores';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';

interface TopingUpCheckProps {
  isActive: boolean;
  onSelect: (on: boolean) => void;
}
const TopingUpCheck: FC<TopingUpCheckProps> = ({ isActive, onSelect }) => {
  const { t } = useTranslation();
  const handleClick = (on: boolean) => () => onSelect(on);

  return (
    <FlexContainer backgroundColor="#2A2C33" borderRadius="4px" padding="2px">
      <CheckButton
        type="button"
        onClick={handleClick(true)}
        isActive={isActive}
      >
        <PrimaryTextSpan
          fontSize="14px"
          fontWeight="bold"
          color={isActive ? '#1C1F26' : 'rgba(196, 196, 196, 0.5)'}
        >
          {t('On')}
        </PrimaryTextSpan>
      </CheckButton>

      <CheckButton
        type="button"
        onClick={handleClick(false)}
        isActive={!isActive}
      >
        <PrimaryTextSpan
          fontSize="14px"
          fontWeight="bold"
          color={!isActive ? '#1C1F26' : 'rgba(196, 196, 196, 0.5)'}
        >
          {t('Off')}
        </PrimaryTextSpan>
      </CheckButton>
    </FlexContainer>
  );
};

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
